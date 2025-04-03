import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { differenceInHours } from "date-fns";

export async function GET() {
  try {
    const attendance = await prisma.attendance.findMany({
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            jobTitle: true,
            nationalId: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(attendance);
  } catch (error) {
    console.error("خطأ في جلب سجلات الحضور:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب سجلات الحضور" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // التحقق من وجود جميع الحقول المطلوبة
    if (!body.employeeId || !body.date || !body.checkIn) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة غير متوفرة" },
        { status: 400 }
      );
    }

    // جلب بيانات الموظف للحصول على الراتب اليومي
    const employee = await prisma.employee.findUnique({
      where: { id: body.employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "لم يتم العثور على الموظف" },
        { status: 404 }
      );
    }

    // إنشاء سجل الحضور
    const attendance = await prisma.attendance.create({
      data: {
        employeeId: body.employeeId,
        date: new Date(body.date),
        checkIn: new Date(body.checkIn),
        checkOut: body.checkOut ? new Date(body.checkOut) : null,
        notes: body.notes,
      },
    });

    // إذا كان هناك وقت انصراف، نقوم بحساب الساعات وتحديث ميزانية الموظف
    if (body.checkOut) {
      await updateEmployeeBudget(body.employeeId, body.checkIn, body.checkOut, employee.dailySalary);
    }

    return NextResponse.json(attendance, { status: 201 });
  } catch (error: any) {
    console.error("خطأ في إنشاء سجل الحضور:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إنشاء سجل الحضور", details: error.message },
      { status: 500 }
    );
  }
}

// دالة لحساب الساعات وتحديث ميزانية الموظف
async function updateEmployeeBudget(
  employeeId: number,
  checkInTime: string,
  checkOutTime: string,
  dailySalary: number
) {
  try {
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);

    // حساب عدد الساعات بين وقت الحضور والانصراف
    const hoursWorked = differenceInHours(checkOut, checkIn);

    // حساب المبلغ المستحق
    let amountToAdd = 0;

    if (hoursWorked >= 8) {
      // إضافة الراتب اليومي الكامل
      amountToAdd = dailySalary;

      // حساب الساعات الإضافية (أكثر من 8 ساعات)
      const overtimeHours = hoursWorked - 8;
      if (overtimeHours > 0) {
        // حساب قيمة الساعة الإضافية (1.5 ضعف السعر العادي)
        const hourlyRate = dailySalary / 8;
        const overtimeRate = hourlyRate * 1.5;
        amountToAdd += overtimeHours * overtimeRate;
      }
    } else {
      // إذا عمل أقل من 8 ساعات، يحصل على نسبة من الراتب اليومي
      const hourlyRate = dailySalary / 8;
      amountToAdd = hoursWorked * hourlyRate;
    }

    // تحديث ميزانية الموظف
    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        budget: {
          increment: Math.round(amountToAdd),
        },
      },
    });

    return true;
  } catch (error) {
    console.error("خطأ في تحديث ميزانية الموظف:", error);
    return false;
  }
}