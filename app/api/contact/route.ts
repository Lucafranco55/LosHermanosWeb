import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactLeadSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Revisá los campos del formulario." }, { status: 400 });
    }

    await prisma.contactLead.create({ data: parsed.data });

    return NextResponse.json({
      message: "Tu consulta fue enviada correctamente. Te vamos a responder a la brevedad."
    });
  } catch {
    return NextResponse.json({ message: "No se pudo enviar la consulta." }, { status: 500 });
  }
}
