import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // استخراج month من query parameters
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    // إعداد شروط التصفية بناءً على الشهر
    const filter: any = {};
    if (month) {
      filter.month = month;
    }

    // جلب سجلات المرتبات مع تطبيق الفلتر
    const payrolls = await prisma.payroll.findMany({
      where: filter,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            jobTitle: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(payrolls);
  } catch (error) {
    console.error("خطأ في جلب سجلات المرتبات:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب سجلات المرتبات" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payrolls, custodyId, totalAmount } = body;

    // التحقق من وجود جميع البيانات المطلوبة
    if (!payrolls || !Array.isArray(payrolls) || payrolls.length === 0) {
      return NextResponse.json(
        { error: "بيانات المرتبات غير صحيحة" },
        { status: 400 }
      );
    }

    // التحقق من وجود العهدة إذا تم تحديدها
    if (custodyId) {
      const custody = await prisma.custody.findUnique({
        where: { id: custodyId },
      });

      if (!custody) {
        return NextResponse.json(
          { error: "العهدة غير موجودة" },
          { status: 404 }
        );
      }

      // التحقق من كفاية رصيد العهدة
      if (custody.remaining < totalAmount) {
        return NextResponse.json(
          { error: "رصيد العهدة غير كافٍ لصرف المرتبات" },
          { status: 400 }
        );
      }
    }

    // إنشاء المعاملة لضمان تنفيذ جميع العمليات بنجاح أو فشلها جميعًا
    const result = await prisma.$transaction(async (prismaClient) => {
      const createdPayrolls = [];

      // إنشاء سجلات المرتبات
      for (const payrollData of payrolls) {
        const {
          employeeId,
          month,
          dailySalary,
          daysWorked,
          totalSalary,
          bonuses,
          deductions,
          advances,
          netSalary,
        } = payrollData;

        // التحقق من وجود الموظف
        const employee = await prismaClient.employee.findUnique({
          where: { id: employeeId },
        });

        if (!employee) {
          throw new Error(`الموظف برقم ${employeeId} غير موجود`);
        }

        // إنشاء سجل المرتب
        const payroll = await prismaClient.payroll.create({
          data: {
            employeeId,
            month,
            dailySalary,
            daysWorked,
            totalSalary,
            bonuses: bonuses || 0,
            deductions: deductions || 0,
            advances: advances || 0,
            netSalary,
          },
        });

        createdPayrolls.push(payroll);

        // تحديث رصيد الموظف (إضافة صافي الراتب)
        await prismaClient.employee.update({
          where: { id: employeeId },
          data: {
            budget: {
              increment: Number(netSalary),
            },
          },
        });
      }

      // تحديث رصيد العهدة إذا تم تحديدها
      if (custodyId) {
        await prismaClient.custody.update({
          where: { id: custodyId },
          data: {
            remaining: {
              decrement: totalAmount,
            },
          },
        });

        // إنشاء مصروف للعهدة
        await prismaClient.expense.create({
          data: {
            description: `صرف مرتبات لشهر ${payrolls[0].month}`,
            amount: totalAmount,
            expenseType: "مرتبات",
            responsiblePerson: "إدارة الموارد البشرية",
            custodyId,
            date: new Date(),
          },
        });
      }

      return createdPayrolls;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("خطأ في إنشاء سجلات المرتبات:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إنشاء سجلات المرتبات", details: error.message },
      { status: 500 }
    );
  }
}