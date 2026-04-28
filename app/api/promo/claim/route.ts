import { PromoCodeStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePromoCode, promoClaimSchema } from "@/lib/validations";

const prizeLabels: Record<string, string> = {
  no_gana: "Sin premio",
  kit_lavado: "Kit de lavado Bardahl",
  camiseta_argentina: "Camiseta de Argentina",
  combo_50_off: "50% OFF en combo",
  premio_sorpresa: "Premio sorpresa"
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = promoClaimSchema.safeParse({
      ...body,
      code: normalizePromoCode(body?.code || "")
    });

    if (!parsed.success) {
      return NextResponse.json({ status: "invalid_claim", message: "Revisá los datos ingresados." }, { status: 400 });
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: parsed.data.code }
    });

    if (!promoCode) {
      return NextResponse.json({ status: "invalid_code", message: "Código inválido." }, { status: 400 });
    }

    if (promoCode.prize === "no_gana") {
      return NextResponse.json({ status: "no_prize", message: "Este código no tiene premio." }, { status: 400 });
    }

    if (promoCode.status === PromoCodeStatus.CLAIMED) {
      return NextResponse.json({ status: "already_claimed", message: "Este código ya fue utilizado." }, { status: 400 });
    }

    const updated = await prisma.promoCode.updateMany({
      where: { code: parsed.data.code, status: PromoCodeStatus.AVAILABLE },
      data: {
        status: PromoCodeStatus.CLAIMED,
        claimedAt: new Date(),
        claimantName: parsed.data.claimantName,
        claimantPhone: parsed.data.claimantPhone,
        claimantBusiness: parsed.data.claimantBusiness || null,
        claimantCity: parsed.data.claimantCity
      }
    });

    if (!updated.count) {
      return NextResponse.json({ status: "already_claimed", message: "Este código ya fue utilizado." }, { status: 400 });
    }

    return NextResponse.json({
      status: "claimed_success",
      message: "Tu reclamo fue enviado con éxito. Pronto nos contactaremos para coordinar la entrega.",
      prize: prizeLabels[promoCode.prize] || promoCode.prize
    });
  } catch {
    return NextResponse.json({ status: "error", message: "No se pudo registrar el reclamo." }, { status: 500 });
  }
}
