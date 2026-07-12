import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { serviceId, description, orderNsu } = body;

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

    const settings = await prisma.mercadoPagoSetting.findMany();
    const config = Object.fromEntries(
      settings.map((s: { key: string; value: string }) => [s.key, s.value])
    );

    const accessToken = config.mp_access_token?.trim();
    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "Access Token do Mercado Pago não configurado. Configure em Configurações > Integração Mercado Pago",
        },
        { status: 400 }
      );
    }

    const environment = config.mp_environment || "sandbox";
    const isProduction = environment === "production";

    const amountInCents = Math.round(Number(service.amount) * 100);
    const amountInReais = Number(service.amount);

    const itemDescription =
      description || `${service.type} - ${service.client.name}`;
    const externalReference = orderNsu || `SVC-${service.id}-${Date.now()}`;

    const preferencePayload: Record<string, unknown> = {
      items: [
        {
          id: service.id,
          title: itemDescription,
          description: itemDescription,
          quantity: 1,
          unit_price: amountInReais,
          currency_id: "BRL",
        },
      ],
      external_reference: externalReference,
      payment_methods: {
        excluded_payment_types: [],
        installments: 1,
      },
    };

    if (config.mp_back_url_success)
      preferencePayload.back_urls = {
        success: config.mp_back_url_success,
        failure: config.mp_back_url_failure || config.mp_back_url_success,
        pending: config.mp_back_url_pending || config.mp_back_url_success,
      };

    if (config.mp_webhook_url)
      preferencePayload.notification_url = config.mp_webhook_url;

    if (service.client) {
      const rawPhone = service.client.phone?.replace(/\D/g, "") || "";
      const areaCode = rawPhone.slice(0, 2);
      const phoneNumber = rawPhone.slice(2);

      preferencePayload.payer = {
        name: service.client.name,
        email: service.client.email || undefined,
        ...(service.client.document
          ? {
              identification: {
                type:
                  service.client.document.replace(/\D/g, "").length === 14
                    ? "CNPJ"
                    : "CPF",
                number: service.client.document.replace(/\D/g, ""),
              },
            }
          : {}),
        ...(rawPhone
          ? {
              phone: {
                area_code: areaCode,
                number: phoneNumber,
              },
            }
          : {}),
        ...(service.client.address
          ? {
              address: {
                street_name: service.client.address,
                street_number: service.client.number || "",
                zip_code:
                  service.client.zipCode?.replace(/\D/g, "") || undefined,
              },
            }
          : {}),
      };
    }

    const baseUrl = isProduction
      ? "https://api.mercadopago.com"
      : "https://api.mercadopago.com";

    console.log(
      "[MercadoPago] Preference payload:",
      JSON.stringify(preferencePayload, null, 2)
    );

    const res = await fetch(`${baseUrl}/checkout/preferences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": externalReference,
      },
      body: JSON.stringify(preferencePayload),
    });

    const data = await res.json().catch(() => null);

    console.log("[MercadoPago] Response status:", res.status);
    console.log(
      "[MercadoPago] Response body:",
      JSON.stringify(data, null, 2)
    );

    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.error ||
            "Erro ao criar preferência no Mercado Pago",
          details: data,
        },
        { status: res.status }
      );
    }

    const link = isProduction
      ? data?.init_point
      : data?.sandbox_init_point || data?.init_point;

    const invoice = await prisma.invoice.create({
      data: {
        serviceId: service.id,
        amount: service.amount,
        status: "pendente",
        provider: "mercadopago",
        externalLink: link,
        externalId: data?.id ? String(data.id) : null,
        orderNsu: externalReference,
      },
    });

    console.log("[MercadoPago] amountInCents:", amountInCents);

    return NextResponse.json({
      success: true,
      invoice,
      link,
      preferenceId: data?.id,
      mercadoPagoResponse: data,
    });
  } catch (error) {
    console.error("MercadoPago Create Preference Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
