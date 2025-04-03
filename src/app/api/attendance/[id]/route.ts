import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// دالة PUT لتعديل سجل الحضور
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // التحقق من وجود المعرف
    if (!id) {
      return NextResponse.json({ error: "معرف السجل مطلوب" }, { status: 400 });
    }

    // التحقق من وجود البيانات المطلوبة
    const { employeeId, date, checkIn, checkOut, notes } = body;
    if (!employeeId || !date || !checkIn) {
      return NextResponse.json(
        { error: "البيانات المطلوبة (employeeId, date, checkIn) غير موجودة" },
        { status: 400 }
      );
    }

    // تحديث السجل في قاعدة البيانات
    const updatedAttendance = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: {
        employeeId: parseInt(employeeId),
        date: new Date(date),
        checkIn: new Date(checkIn),
        checkOut: checkOut ? new Date(checkOut) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json(updatedAttendance, { status: 200 });
  } catch (error) {
    console.error("خطأ أثناء تعديل سجل الحضور:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تعديل السجل" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// دالة DELETE لحذف سجل الحضور
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // التحقق من وجود المعرف
    if (!id) {
      return NextResponse.json({ error: "معرف السجل مطلوب" }, { status: 400 });
    }

    // حذف السجل من قاعدة البيانات
    await prisma.attendance.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "تم حذف السجل بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    console.error("خطأ أثناء حذف سجل الحضور:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف السجل" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
