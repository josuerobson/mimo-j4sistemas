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

    const settings = await prisma.infinitiPaySetting.findMany();
    const config = Object.fromEntries(
      settings.map((s: { key: string; value: string }) => [s.key, s.value])
    );

    const handle = config.infinitipay_handle?.trim();
    if (!handle) {
      return NextResponse.json(
        { error: "InfiniteTag não configurada. Configure em Configurações > Integração InfinitiPay" },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(Number(service.amount) * 100);
    const payload: Record<string, unknown> = {
      handle,
      items: [
        {
          quantity: 1,
          price: amountInCents,
          description: description || `${service.type} - ${service.client.name}`,
        },
      ],
    };

    if (orderNsu) payload.order_nsu = orderNsu;
    if (config.infinitipay_redirect_url) payload.redirect_url = config.infinitipay_redirect_url;
    if (config.infinitipay_webhook_url) payload.webhook_url = config.infinitipay_webhook_url;

    if (service.client) {
      payload.customer = {
        name: service.client.name,
        email: service.client.email || undefined,
        phone_number: service.client.phone || undefined,
      };
    }

    const res = await fetch("https://api.checkout.infinitepay.io/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erro ao criar link na InfinitePay", details: data },
        { status: res.status }
      );
    }

    const link = data?.payment_url || data?.url || data?.link || null;
    const slug = data?.slug || null;

    const invoice = await prisma.invoice.create({
      data: {
        serviceId: service.id,
        amount: service.amount,
        status: "pendente",
        externalLink: link,
        externalSlug: slug,
        orderNsu: orderNsu || null,
      },
    });

    return NextResponse.json({
      success: true,
      invoice,
      link,
      slug,
      infinitePayResponse: data,
    });
  } catch (error) {
    console.error("InfinitiPay Create Link Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
