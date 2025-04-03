"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, Input, Select, DatePicker, TimePicker } from "antd";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

interface EditAttendanceProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceRecord: any;
}

interface Employee {
  id: number;
  name: string;
  jobTitle: string;
  nationalId: string;
  dailySalary: number;
}

export default function EditAttendance({ 
  isOpen, 
  onClose, 
  attendanceRecord 
}: EditAttendanceProps) {
  const [form, setForm] = useState({
    employeeId: "",
    date: dayjs(),
    checkIn: dayjs(),
    checkOut: null as dayjs.Dayjs | null,
    notes: "",
  });

  const [errors, setErrors] = useState<any>({});
  const queryClient = useQueryClient();

  // جلب قائمة الموظفين
  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await axios.get("/api/employees");
      return res.data;
    },
  });

  // تحديث النموذج عند تغيير سجل الحضور
  useEffect(() => {
    if (attendanceRecord) {
      setForm({
        employeeId: attendanceRecord.employeeId.toString(),
        date: dayjs(attendanceRecord.date),
        checkIn: dayjs(attendanceRecord.checkIn),
        checkOut: attendanceRecord.checkOut ? dayjs(attendanceRecord.checkOut) : null,
        notes: attendanceRecord.notes || "",
      });
    }
  }, [attendanceRecord]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put(`/api/attendance/${attendanceRecord.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("تم تحديث سجل الحضور بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      onClose();
    },
    onError: (error: any) => {
      console.error("خطأ أثناء تحديث سجل الحضور:", error);
      const errorMessage =
        error.response?.data?.error || "حدث خطأ أثناء تحديث سجل الحضور!";
      toast.error(errorMessage);
    },
  });

  const handleEmployeeChange = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, employeeId: value }));
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setForm((prevForm) => ({ ...prevForm, date }));
    }
  };

  const handleCheckInChange = (time: dayjs.Dayjs | null) => {
    if (time) {
      setForm((prevForm) => ({ ...prevForm, checkIn: time }));
    }
  };

  const handleCheckOutChange = (time: dayjs.Dayjs | null) => {
    setForm((prevForm) => ({ ...prevForm, checkOut: time }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prevForm) => ({ ...prevForm, notes: e.target.value }));
  };

  const validateForm = () => {
    let formErrors: any = {};
    if (!form.employeeId) formErrors.employeeId = "يرجى اختيار موظف";
    if (!form.date) formErrors.date = "يرجى تحديد التاريخ";
    if (!form.checkIn) formErrors.checkIn = "يرجى تحديد وقت الحضور";
    return formErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // تحضير البيانات للإرسال
      const attendanceData = {
        employeeId: parseInt(form.employeeId),
        date: form.date.format("YYYY-MM-DD"),
        checkIn: form.checkIn.format(),
        checkOut: form.checkOut ? form.checkOut.format() : null,
        notes: form.notes || null,
      };

      mutation.mutate(attendanceData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            تعديل سجل الحضور
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="employee" className="font-medium">
              الموظف *
            </label>
            <Select
              id="employee"
              placeholder="اختر الموظف"
              value={form.employeeId || undefined}
              onChange={handleEmployeeChange}
              status={errors.employeeId ? "error" : ""}
              className="w-full"
              disabled={true} // لا يمكن تغيير الموظف في التعديل
            >
              {employees.map((employee) => (
                <Select.Option key={employee.id} value={employee.id.toString()}>
                  {employee.name}
                </Select.Option>
              ))}
            </Select>
            {errors.employeeId && (
              <p className="text-red-500 text-sm">{errors.employeeId}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="date" className="font-medium">
              التاريخ *
            </label>
            <DatePicker
              id="date"
              value={form.date}
              onChange={handleDateChange}
              status={errors.date ? "error" : ""}
              className="w-full"
              format="YYYY-MM-DD"
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="checkIn" className="font-medium">
              وقت الحضور *
            </label>
            <TimePicker
              id="checkIn"
              value={form.checkIn}
              onChange={handleCheckInChange}
              status={errors.checkIn ? "error" : ""}
              className="w-full"
              format="HH:mm"
            />
            {errors.checkIn && (
              <p className="text-red-500 text-sm">{errors.checkIn}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="checkOut" className="font-medium">
              وقت الانصراف
            </label>
            <TimePicker
              id="checkOut"
              value={form.checkOut}
              onChange={handleCheckOutChange}
              className="w-full"
              format="HH:mm"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="notes" className="font-medium">
              ملاحظات
            </label>
            <Input.TextArea
              id="notes"
              value={form.notes}
              onChange={handleNotesChange}
              className="w-full"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="mr-2">
            إلغاء
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={mutation.isPending}
          >
            حفظ التغييرات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}