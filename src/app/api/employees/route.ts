import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: { user: true },
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطاء في جلب الموظفين" },
      { status: 500 }
    );
  }
}
