import { PromoCodeStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePromoCode, promoValidateSchema } from "@/lib/validations";

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
    const parsed = promoValidateSchema.safeParse({
      code: normalizePromoCode(body?.code || "")
    });

    if (!parsed.success) {
      return NextResponse.json({ status: "invalid_code", message: "Código inválido." }, { status: 400 });
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: parsed.data.code }
    });

    if (!promoCode) {
      return NextResponse.json({ status: "invalid_code", message: "Código inválido." });
    }

    if (promoCode.prize === "no_gana") {
      return NextResponse.json({ status: "no_prize", message: "Esta vez no ganaste, seguí participando." });
    }

    if (promoCode.status === PromoCodeStatus.CLAIMED) {
      return NextResponse.json({ status: "already_claimed", message: "Este código ya fue utilizado." });
    }

    return NextResponse.json({
      status: "winner_available",
      message: "Felicitaciones, ganaste:",
      prize: prizeLabels[promoCode.prize] || promoCode.prize
    });
  } catch {
    return NextResponse.json({ status: "error", message: "No se pudo validar el código." }, { status: 500 });
  }
}
