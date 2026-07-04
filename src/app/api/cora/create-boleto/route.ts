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
    const rawCertificate = config.cora_certificate?.trim();
    const rawPrivateKey = config.cora_private_key?.trim();
    const environment = config.cora_environment?.trim() || "stage";

    if (!clientId || !rawCertificate || !rawPrivateKey) {
      return NextResponse.json(
        {
          error:
            "Credenciais da Cora não configuradas. Configure em Configurações > Integração Cora",
        },
        { status: 400 }
      );
    }

    // Garantir que certificado e chave privada tenham as quebras de linha corretas
    const normalizePem = (pem: string, defaultHeader: string, defaultFooter: string) => {
      const trimmed = pem.trim();
      const headerMatch = trimmed.match(/-----BEGIN ([^-]+)-----/);
      const footerMatch = trimmed.match(/-----END ([^-]+)-----/);
      const header = headerMatch ? `-----BEGIN ${headerMatch[1]}-----` : defaultHeader;
      const footer = footerMatch ? `-----END ${footerMatch[1]}-----` : defaultFooter;
      const content = trimmed
        .replace(/-----BEGIN[^-]*-----/g, "")
        .replace(/-----END[^-]*-----/g, "")
        .replace(/\s+/g, "")
        .trim();
      const lines = content.match(/.{1,64}/g)?.join("\n") || content;
      return `${header}\n${lines}\n${footer}`;
    };

    const certificate = normalizePem(
      rawCertificate,
      "-----BEGIN CERTIFICATE-----",
      "-----END CERTIFICATE-----"
    );
    const privateKey = normalizePem(
      rawPrivateKey,
      "-----BEGIN RSA PRIVATE KEY-----",
      "-----END RSA PRIVATE KEY-----"
    );

    console.log("[Cora] clientId prefix:", clientId.slice(0, 10));
    console.log("[Cora] certificate header:", certificate.split("\n")[0]);
    console.log("[Cora] private key header:", privateKey.split("\n")[0]);
    console.log("[Cora] certificate chars:", certificate.length);
    console.log("[Cora] private key chars:", privateKey.length);

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

    console.log("[Cora] Token response status:", tokenRes.status);
    console.log("[Cora] Token response body:", JSON.stringify(tokenRes.data, null, 2));

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
    if (!document || (document.length !== 11 && document.length !== 14)) {
      return NextResponse.json(
        {
          error:
            "Cliente não possui CPF/CNPJ válido cadastrado. É obrigatório para emissão de boleto na Cora.",
        },
        { status: 400 }
      );
    }
    const documentType = document.length === 14 ? "CNPJ" : "CPF";

    const zipCode = (service.client.zipCode || "").replace(/\D/g, "");
    if (!service.client.address || !service.client.city || !service.client.state || zipCode.length !== 8) {
      return NextResponse.json(
        {
          error:
            "Endereço incompleto. Preencha rua, cidade, estado e CEP com 8 dígitos no cadastro do cliente.",
        },
        { status: 400 }
      );
    }

    const customerPayload: Record<string, unknown> = {
      name: service.client.name.slice(0, 60),
      email: service.client.email,
      document: {
        identity: document,
        type: documentType,
      },
      address: {
        street: service.client.address.slice(0, 100),
        number: (service.client.number || "S/N").slice(0, 20),
        district: (service.client.neighborhood || service.client.city || "N/A").slice(0, 60),
        city: service.client.city.slice(0, 60),
        state: (service.client.state || "SP").slice(0, 2).toUpperCase(),
        complement: (service.client.complement || "N/A").slice(0, 60),
        zip_code: zipCode,
      },
    };

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

    const description = `${service.type} - ${service.client.name}`.slice(0, 100);
    const invoicePayload = {
      code,
      customer: customerPayload,
      services: [
        {
          name: service.type.slice(0, 60),
          description,
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
      status?: string;
      payment_options?: {
        bank_slip?: {
          url?: string;
          barcode?: string;
          digitable?: string;
        };
      };
    };

    const bankSlip = responseData.payment_options?.bank_slip;
    const documentUrl = bankSlip?.url || null;
    const barcode = bankSlip?.barcode || null;
    const digitableLine = bankSlip?.digitable || null;

    if (!documentUrl) {
      return NextResponse.json(
        {
          error: "Boleto não retornado pela Cora",
          details: invoiceRes.data,
        },
        { status: 502 }
      );
    }

    const invoice = await prisma.invoice.create({
      data: {
        serviceId: service.id,
        amount: service.amount,
        status: "pendente",
        provider: "cora",
        externalId: responseData.id || null,
        documentUrl,
        orderNsu: code,
      },
    });

    return NextResponse.json({
      success: true,
      invoice,
      documentUrl,
      barcode,
      digitableLine,
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
