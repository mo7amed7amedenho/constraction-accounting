import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const custodies = await prisma.custody.findMany({
    include: {
      project: true,
      expenses: true,
      AddAmount: true,
    },
  });

  return NextResponse.json(custodies);
}

export async function POST(req: NextRequest) {
  const { name, code, company, quantity, date } = await req.json();
  const newCustody = await prisma.custody.create({
    data: {
      name,
      code,
      company,
      quantity,
      remaining: quantity,
      status: "active",
      time: new Date(date), // تأكد من تخزين التاريخ
    },
  });

  return NextResponse.json(newCustody);
}
