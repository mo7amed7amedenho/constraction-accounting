import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "معرف المرتب غير صالح" },
        { status: 400 }
      );
    }
    
    const body = await req.json();
    const {
      month,
      dailySalary,
      daysWorked,
      bonuses,
      deductions,
      advances,
    } = body;
    
    // التحقق من البيانات المطلوبة
    if (!dailySalary || !daysWorked) {
      return NextResponse.json(
        { error: "الراتب اليومي وعدد أيام العمل مطلوبان" },
        { status: 400 }
      );
    }
    
    // جلب سجل المرتب الحالي
    const currentPayroll = await prisma.payroll.findUnique({
      where: { id },
    });
    
    if (!currentPayroll) {
      return NextResponse.json(
        { error: "سجل المرتب غير موجود" },
        { status: 404 }
      );
    }
    
    // حساب القيم الجديدة
    const totalSalary = dailySalary * daysWorked;
    const netSalary = totalSalary + Number(bonuses || 0) - Number(deductions || 0) - Number(advances || 0);
    
    // حساب الفرق بين صافي الراتب القديم والجديد
    const netSalaryDifference = netSalary - Number(currentPayroll.netSalary);
    
    // إنشاء المعاملة لضمان تنفيذ جميع العمليات بنجاح أو فشلها جميعًا
    const result = await prisma.$transaction(async (prismaClient) => {
      // تحديث سجل المرتب
      const updatedPayroll = await prismaClient.payroll.update({
        where: { id },
        data: {
          month: month || undefined,
          dailySalary,
          daysWorked,
          totalSalary,
          bonuses: bonuses || 0,
          deductions: deductions || 0,
          advances: advances || 0,
          netSalary,
        },
      });
      
      // تحديث رصيد الموظف إذا تغير صافي الراتب
      if (netSalaryDifference !== 0) {
        await prismaClient.employee.update({
          where: { id: currentPayroll.employeeId },
          data: {
            budget: {
              // إذا كان الفرق موجب (زيادة المبلغ)، نقوم بإضافة الفرق
              // إذا كان الفرق سالب (نقصان المبلغ)، نقوم بخصم الفرق
              increment: netSalaryDifference,
            },
          },
        });
      }
      
      return updatedPayroll;
    });
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("خطأ في تحديث سجل المرتب:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تحديث سجل المرتب", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "معرف المرتب غير صالح" },
        { status: 400 }
      );
    }
    
    // جلب سجل المرتب قبل الحذف
    const payroll = await prisma.payroll.findUnique({
      where: { id },
    });
    
    if (!payroll) {
      return NextResponse.json(
        { error: "سجل المرتب غير موجود" },
        { status: 404 }
      );
    }
    
    // إنشاء المعاملة لضمان تنفيذ جميع العمليات بنجاح أو فشلها جميعًا
    await prisma.$transaction(async (prismaClient) => {
      // حذف سجل المرتب
      await prismaClient.payroll.delete({
        where: { id },
      });
      
      // تحديث رصيد الموظف (خصم صافي الراتب)
      await prismaClient.employee.update({
        where: { id: payroll.employeeId },
        data: {
          budget: {
            decrement: Number(payroll.netSalary),
          },
        },
      });
    });
    
    return NextResponse.json({ message: "تم حذف سجل المرتب بنجاح" });
  } catch (error: any) {
    console.error("خطأ في حذف سجل المرتب:", error);
    return NextResponse.json(
      { error: "حدث خطأ في حذف سجل المرتب", details: error.message },
      { status: 500 }
    );
  }
}