import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import https from "https";
import { randomUUID } from "crypto";

interface CoraRequestOptions {
  method: string;
  hostname: string;
  path: string;
  cert: string;
  key: string;
  headers?: Record<string, string>;
  body?: string;
}

function coraRequest(options: CoraRequestOptions): Promise<{
  status: number;
  data: unknown;
}> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: options.hostname,
        path: options.path,
        method: options.method,
        cert: options.cert,
        key: options.key,
        headers: options.headers,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const data = body ? JSON.parse(body) : null;
            resolve({ status: res.statusCode || 0, data });
          } catch {
            resolve({ status: res.statusCode || 0, data: body });
          }
        });
      }
    );

    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

export async function POST(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { serviceId } = body;

    if (!serviceId) {
      return NextResponse.json(
        { error: "serviceId é obrigatório" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { client: true },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      );
    }

    if (!service.client) {
      return NextResponse.json(
        { error: "Serviço não possui cliente vinculado" },
        { status: 400 }
      );
    }

    const settings = await prisma.coraSetting.findMany();
    const config = Object.fromEntries(
      settings.map((s: { key: string; value: string }) => [s.key, s.value])
    );

    const clientId = config.cora_client_id?.trim();
    const certificate = config.cora_certificate?.trim();
    const privateKey = config.cora_private_key?.trim();
    const environment = config.cora_environment?.trim() || "stage";

    if (!clientId || !certificate || !privateKey) {
      return NextResponse.json(
        {
          error:
            "Credenciais da Cora não configuradas. Configure em Configurações > Integração Cora",
        },
        { status: 400 }
      );
    }

    const hostname =
      environment === "production"
        ? "matls-clients.api.cora.com.br"
        : "matls-clients.api.stage.cora.com.br";

    // 1. Obter token de acesso
    const tokenRes = await coraRequest({
      method: "POST",
      hostname,
      path: "/token",
      cert: certificate,
      key: privateKey,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${encodeURIComponent(
        clientId
      )}`,
    });

    if (tokenRes.status !== 200 || !(tokenRes.data as { access_token?: string })?.access_token) {
      return NextResponse.json(
        {
          error: "Erro ao autenticar na Cora",
          details: tokenRes.data,
        },
        { status: 401 }
      );
    }

    const accessToken = (tokenRes.data as { access_token: string }).access_token;

    // 2. Montar payload do boleto
    const dueDays = parseInt(config.cora_due_days || "3", 10);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (isNaN(dueDays) ? 3 : dueDays));
    const dueDateStr = dueDate.toISOString().split("T")[0];

    const amountInCents = Math.round(Number(service.amount) * 100);
    const code = `SVC-${service.id}-${Date.now()}`;

    const document = service.client.document?.replace(/\D/g, "");
    const documentType = document && document.length === 14 ? "CNPJ" : "CPF";

    const customerPayload: Record<string, unknown> = {
      name: service.client.name,
      email: service.client.email,
      document: {
        identity: document || "00000000000",
        type: documentType,
      },
    };

    if (service.client.address) {
      customerPayload.address = {
        street: service.client.address,
        number: "S/N",
        district: service.client.city || "N/A",
        city: service.client.city || "N/A",
        state: service.client.state || "SP",
        complement: "N/A",
        zip_code: (service.client.zipCode || "00000000").replace(/\D/g, ""),
      };
    }

    const paymentTerms: Record<string, unknown> = {
      due_date: dueDateStr,
    };

    const fineAmount = parseInt(config.cora_fine_amount || "0", 10);
    if (fineAmount > 0) {
      paymentTerms.fine = { amount: fineAmount };
    }

    const interestRate = parseFloat(config.cora_interest_rate || "0");
    if (interestRate > 0) {
      paymentTerms.interest = { rate: interestRate };
    }

    const discountValue = parseFloat(config.cora_discount_value || "0");
    if (discountValue > 0) {
      paymentTerms.discount = {
        type: config.cora_discount_type || "PERCENT",
        value: discountValue,
      };
    }

    const paymentForms = config.cora_payment_forms
      ? config.cora_payment_forms.split(",").map((s: string) => s.trim())
      : ["BANK_SLIP"];

    const invoicePayload = {
      code,
      customer: customerPayload,
      services: [
        {
          name: service.type,
          description: `${service.type} - ${service.client.name}`,
          amount: amountInCents,
        },
      ],
      payment_terms: paymentTerms,
      payment_forms: paymentForms,
    };

    console.log("[Cora] Invoice payload:", JSON.stringify(invoicePayload, null, 2));

    // 3. Criar boleto na Cora
    const invoiceRes = await coraRequest({
      method: "POST",
      hostname,
      path: "/v2/invoices",
      cert: certificate,
      key: privateKey,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Idempotency-Key": randomUUID(),
      },
      body: JSON.stringify(invoicePayload),
    });

    console.log("[Cora] Invoice response status:", invoiceRes.status);
    console.log("[Cora] Invoice response body:", JSON.stringify(invoiceRes.data, null, 2));

    if (invoiceRes.status !== 200 && invoiceRes.status !== 201) {
      return NextResponse.json(
        {
          error: "Erro ao criar boleto na Cora",
          details: invoiceRes.data,
        },
        { status: invoiceRes.status || 500 }
      );
    }

    const responseData = invoiceRes.data as {
      id?: string;
      document_url?: string;
      status?: string;
      barcode?: string;
      digitable_line?: string;
    };

    const invoice = await prisma.invoice.create({
      data: {
        serviceId: service.id,
        amount: service.amount,
        status: "pendente",
        provider: "cora",
        externalId: responseData.id || null,
        documentUrl: responseData.document_url || null,
        orderNsu: code,
      },
    });

    return NextResponse.json({
      success: true,
      invoice,
      documentUrl: responseData.document_url || null,
      barcode: responseData.barcode || null,
      digitableLine: responseData.digitable_line || null,
      coraResponse: responseData,
    });
  } catch (error) {
    console.error("Cora Create Boleto Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: String(error) },
      { status: 500 }
    );
  }
}
