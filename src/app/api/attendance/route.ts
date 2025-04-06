import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { differenceInHours } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    // استخراج startDate و endDate من query parameters
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // إعداد شروط التصفية بناءً على التاريخ
    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.date = {
        gte: new Date(startDate), // أكبر من أو يساوي تاريخ البداية
        lte: new Date(endDate),   // أقل من أو يساوي تاريخ النهاية
      };
    } else if (startDate) {
      dateFilter.date = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      dateFilter.date = {
        lte: new Date(endDate),
      };
    }

    // جلب سجلات الحضور مع تطبيق الفلتر
    const attendance = await prisma.attendance.findMany({
      where: dateFilter, // تطبيق فلتر التاريخ إذا وُجد
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
  checkInTime: string | Date,
  checkOutTime: string | Date | null,
  dailySalary: number,
  action: "add" | "subtract" = "add"
) {
  try {
    if (!checkOutTime) return; // لو مفيش وقت انصراف، متعملش حاجة

    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);
    const hoursWorked = differenceInHours(checkOut, checkIn);

    let amountToAdd = 0;
    const hourlyRate = dailySalary / 8; // سعر الساعة العادية

    if (hoursWorked >= 8) {
      // لو 8 ساعات أو أكتر، ياخد الراتب كامل + ساعات إضافية
      amountToAdd = dailySalary;
      const overtimeHours = hoursWorked - 8;
      if (overtimeHours > 0) {
        const overtimeRate = hourlyRate * 1.5; // الساعة الإضافية بـ 1.5
        amountToAdd += overtimeHours * overtimeRate;
      }
    } else if (hoursWorked >= 6.5) {
      // لو بين 6.5 و 8 ساعات، ياخد الراتب اليومي كامل
      amountToAdd = dailySalary;
    } else {
      // لو أقل من 6.5 ساعة، يتحسب على الساعات الفعلية
      amountToAdd = hoursWorked * hourlyRate;
    }

    const finalAmount = action === "add" ? Math.round(amountToAdd) : -Math.round(amountToAdd);

    // تحديث الميزانية
    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        budget: {
          increment: finalAmount,
        },
      },
    });

    return true;
  } catch (error) {
    console.error("خطأ في تحديث ميزانية الموظف:", error);
    return false;
  }
}