//Payroll/NewPayroll.tsx
"use client";
import { useState, useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, Table, InputNumber, Spin } from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import locale from "antd/lib/date-picker/locale/ar_EG";

const { Option } = Select;

interface Employee {
  id: number;
  name: string;
  jobTitle: string;
  dailySalary: number;
  budget: number;
}

interface PayrollProps {
  custody: any;
  onSuccess: () => void;
}

export default function NewPayroll({ custody, onSuccess }: PayrollProps) {
  const [form] = Form.useForm();
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [payrollData, setPayrollData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // جلب بيانات الموظفين
  const { data: employees = [], isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await axios.get("/api/employees");
      return res.data;
    },
  });

  // جلب بيانات الحضور
  const { data: attendance = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ["attendance", selectedMonth],
    queryFn: async () => {
      if (!selectedMonth) return [];
      
      // تحديد بداية ونهاية الشهر
      const [year, month] = selectedMonth.split("-");
      const startDate = `${year}-${month}-01`;
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      const endDate = `${year}-${month}-${lastDay}`;
      
      const res = await axios.get(`/api/attendance?startDate=${startDate}&endDate=${endDate}`);
      return res.data;
    },
    enabled: !!selectedMonth,
  });

  // إنشاء كشف المرتبات
  const createPayrollMutation = useMutation({
    mutationFn: async (data: any) => {
      return await axios.post("/api/payroll", data);
    },
    onSuccess: () => {
      toast.success("تم صرف المرتبات بنجاح");
      form.resetFields();
      setPayrollData([]);
      setSelectedEmployees([]);
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "حدث خطأ أثناء صرف المرتبات");
    },
  });

  // حساب أيام العمل لكل موظف
  useEffect(() => {
    if (selectedMonth && selectedEmployees.length > 0 && attendance.length > 0) {
      setLoading(true);
      
      const newPayrollData = selectedEmployees.map(employeeId => {
        const employee = employees.find(emp => emp.id === employeeId);
        if (!employee) return null;
        
        // حساب عدد أيام العمل للموظف في الشهر المحدد
        const employeeAttendance = attendance.filter((record: { employeeId: number; }) => record.employeeId === employeeId);
        const daysWorked = employeeAttendance.length;
        
        // حساب إجمالي الراتب
        const totalSalary = employee.dailySalary * daysWorked;
        
        return {
          employeeId,
          name: employee.name,
          dailySalary: employee.dailySalary,
          daysWorked,
          totalSalary,
          bonuses: 0,
          deductions: 0,
          advances: 0,
          netSalary: totalSalary,
        };
      }).filter(Boolean);
      
      setPayrollData(newPayrollData);
      setLoading(false);
    }
  }, [selectedMonth, selectedEmployees, attendance, employees]);

  // جلب بيانات الخصومات والمكافآت والسلف للشهر المحدد
  useEffect(() => {
    if (selectedMonth && payrollData.length > 0) {
      setLoading(true);
      
      const [year, month] = selectedMonth.split("-");
      const startDate = `${year}-${month}-01`;
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      const endDate = `${year}-${month}-${lastDay}`;
      
      // جلب الخصومات
      const fetchDeductions = axios.get(`/api/deductions?startDate=${startDate}&endDate=${endDate}`);
      // جلب المكافآت
      const fetchBonuses = axios.get(`/api/bonuses?startDate=${startDate}&endDate=${endDate}`);
      // جلب السلف
      const fetchAdvances = axios.get(`/api/advances?startDate=${startDate}&endDate=${endDate}`);
      
      Promise.all([fetchDeductions, fetchBonuses, fetchAdvances])
        .then(([deductionsRes, bonusesRes, advancesRes]) => {
          const deductions = deductionsRes.data;
          const bonuses = bonusesRes.data;
          const advances = advancesRes.data;
          
          const updatedPayrollData = payrollData.map(payroll => {
            // حساب إجمالي الخصومات للموظف
            const employeeDeductions = deductions
              .filter((d: { employeeId: any; }) => d.employeeId === payroll.employeeId)
              .reduce((sum: number, d: { amount: any; }) => sum + Number(d.amount), 0);
            
            // حساب إجمالي المكافآت للموظف
            const employeeBonuses = bonuses
              .filter((b: { employeeId: any; }) => b.employeeId === payroll.employeeId)
              .reduce((sum: number, b: { amount: any; }) => sum + Number(b.amount), 0);
            
            // حساب إجمالي السلف للموظف
            const employeeAdvances = advances
              .filter((a: { employeeId: any; status: string; }) => a.employeeId === payroll.employeeId && a.status !== "repaid")
              .reduce((sum: number, a: { amount: any; }) => sum + Number(a.amount), 0);
            
            // حساب صافي الراتب
            const netSalary = payroll.totalSalary + employeeBonuses - employeeDeductions - employeeAdvances;
            
            return {
              ...payroll,
              bonuses: employeeBonuses,
              deductions: employeeDeductions,
              advances: employeeAdvances,
              netSalary: netSalary > 0 ? netSalary : 0,
            };
          });
          
          setPayrollData(updatedPayrollData);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching financial data:", error);
          setLoading(false);
        });
    }
  }, [selectedMonth, payrollData.length]);

  const handleSubmit = () => {
    if (!custody) {
      toast.error("يرجى اختيار العهدة أولاً");
      return;
    }
    
    form.validateFields().then(values => {
      // حساب إجمالي المبلغ المطلوب صرفه
      const totalAmount = payrollData.reduce((sum, item) => sum + item.netSalary, 0);
      
      // التحقق من كفاية رصيد العهدة
      if (totalAmount > custody.remaining) {
        toast.error("رصيد العهدة غير كافٍ لصرف المرتبات");
        return;
      }
      
      // إنشاء كشوف المرتبات
      const payrolls = payrollData.map(item => ({
        employeeId: item.employeeId,
        month: selectedMonth,
        dailySalary: item.dailySalary,
        daysWorked: item.daysWorked,
        totalSalary: item.totalSalary,
        bonuses: item.bonuses,
        deductions: item.deductions,
        advances: item.advances,
        netSalary: item.netSalary,
      }));
      
      createPayrollMutation.mutate({
        payrolls,
        custodyId: custody.id,
        totalAmount,
      });
    });
  };

  // أعمدة جدول كشف المرتبات
  const columns = [
    {
      title: "الموظف",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "الراتب اليومي",
      dataIndex: "dailySalary",
      key: "dailySalary",
      render: (text: number) => `${text} ج.م`,
    },
    {
      title: "أيام العمل",
      dataIndex: "daysWorked",
      key: "daysWorked",
    },
    {
      title: "إجمالي الراتب",
      dataIndex: "totalSalary",
      key: "totalSalary",
      render: (text: number) => `${text} ج.م`,
    },
    {
      title: "المكافآت",
      dataIndex: "bonuses",
      key: "bonuses",
      render: (text: number) => `${text} ج.م`,
    },
    {
      title: "الخصومات",
      dataIndex: "deductions",
      key: "deductions",
      render: (text: number) => `${text} ج.م`,
    },
    {
      title: "السلف",
      dataIndex: "advances",
      key: "advances",
      render: (text: number) => `${text} ج.م`,
    },
    {
      title: "صافي الراتب",
      dataIndex: "netSalary",
      key: "netSalary",
      render: (text: number) => `${text} ج.م`,
    },
  ];

  return (
    <div>
      <Form form={form} layout="vertical">
        <Form.Item
          name="month"
          label="الشهر"
          rules={[{ required: true, message: "يرجى اختيار الشهر" }]}
        >
          <DatePicker
            picker="month"
            style={{ width: "100%" }}
            locale={locale}
            onChange={(date, dateString) => {
              if (date) {
                const formattedDate = dayjs(date).format("YYYY-MM");
                setSelectedMonth(formattedDate);
                setPayrollData([]);
              }
            }}
          />
        </Form.Item>

        <Form.Item
          name="employees"
          label="الموظفين"
          rules={[{ required: true, message: "يرجى اختيار الموظفين" }]}
        >
          <Select
            mode="multiple"
            placeholder="اختر الموظفين"
            style={{ width: "100%" }}
            onChange={(values) => setSelectedEmployees(values)}
            loading={employeesLoading}
          >
            {employees.map((employee) => (
              <Option key={employee.id} value={employee.id}>
                {employee.name} - {employee.jobTitle}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {loading ? (
          <div className="flex justify-center p-4">
            <Spin size="large" />
          </div>
        ) : payrollData.length > 0 ? (
          <>
            <Table
              dataSource={payrollData}
              columns={columns}
              rowKey="employeeId"
              pagination={false}
              scroll={{ x: true }}
              summary={(pageData) => {
                let totalNetSalary = 0;
                pageData.forEach(({ netSalary }) => {
                  totalNetSalary += netSalary;
                });

                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={7} className="text-right font-bold">
                      الإجمالي
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <span className="font-bold">{totalNetSalary.toLocaleString()} ج.م</span>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />

            <div className="mt-4">
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={createPayrollMutation.isPending}
                disabled={!custody}
              >
                صرف المرتبات
              </Button>
              {!custody && (
                <div className="text-red-500 mt-2">يرجى اختيار العهدة أولاً من الصفحة الرئيسية</div>
              )}
            </div>
          </>
        ) : selectedMonth && selectedEmployees.length > 0 ? (
          <div className="text-center p-4 text-gray-500">
            لا توجد بيانات حضور للموظفين المحددين في هذا الشهر
          </div>
        ) : null}
      </Form>
    </div>
  );
}