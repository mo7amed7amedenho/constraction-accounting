"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialChart } from "@/components/ui/cyrclechart";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button, Input } from "antd";
import {
  File,
  PlusCircleIcon,
  Search,
  AlignJustify,
  Edit,
  Trash,
  ArrowUp01Icon,
} from "lucide-react";
import { useState } from "react";
import { AddAmount } from "./AddAmount";
import New from "./NewCustody";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface Custody {
  id: number;
  name: string;
  code: string;
  company: string;
  quantity: number;
  date: string;
  status: string;
  time: string;
  amount: number;
  createdAt: string;
  remaining: number;
  project: string[]; // Assuming project is an array of strings based on your interface
}

export default function Page() {
  const fetchCustodies = async (): Promise<Custody[]> => {
    const response = await axios.get("/api/custodies");
    return response.data;
  };

  const [isAddAmountOpen, setIsAddAmountOpen] = useState<boolean>(false);
  const [isNewOpen, setIsNewOpen] = useState<boolean>(false);

  const {
    data: custodies,
    isLoading,
    error,
  } = useQuery<Custody[], Error>({
    queryKey: ["custodies"],
    queryFn: fetchCustodies,
  });

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-1/4 mx-auto" /> {/* Title */}
        <div className="flex items-center gap-4 border-b pb-4">
          <Skeleton className="h-10 w-full" /> {/* Search Input */}
          <Skeleton className="h-10 w-32" /> {/* Create Button */}
          <Skeleton className="h-10 w-24" /> {/* Reports Button */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="w-full">
                <CardHeader className="flex items-center justify-between">
                  <Skeleton className="h-6 w-1/3" /> {/* Card Title */}
                  <Skeleton className="h-6 w-6" /> {/* Dropdown Icon */}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-32 w-full rounded-full" />{" "}
                    {/* Chart */}
                    <div className="space-y-4 col-span-2">
                      {Array(10) // Adjusted to 10 fields based on new interface
                        .fill(0)
                        .map((_, i) => (
                          <div key={i}>
                            <Skeleton className="h-5 w-1/4" /> {/* Label */}
                            <Skeleton className="h-5 w-3/4 mt-1" />{" "}
                            {/* Value */}
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        حدث خطأ: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-center">إدارة العهدات</h1>
      <div className="flex items-center gap-4 border-b pb-4">
        <Input className="w-full" placeholder="بحث" prefix={<Search />} />
        <Button
          type="primary"
          className="flex items-center gap-2"
          onClick={() => setIsNewOpen(true)}
        >
          <PlusCircleIcon size={18} />
          <span>إنشاء عهدة</span>
        </Button>
        <Button type="text" className="flex items-center gap-2">
          <File size={18} />
          <span>تقارير</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {custodies?.map((custody: Custody) => (
          <Card key={custody.id} className="w-full">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>تفاصيل العهدة</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <AlignJustify className="cursor-pointer hover:opacity-80 duration-300" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsAddAmountOpen(true)}>
                    <ArrowUp01Icon className="mr-2" /> إضافة
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2" /> تعديل
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-800">
                    <Trash className="mr-2 text-red-500" /> حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FinancialChart
                  totalAmount={custody.quantity}
                  remainingAmount={custody.remaining}
                />
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  {[
                    { label: "اسم العهدة", value: custody.name },
                    { label: "الكود", value: custody.code },
                    { label: "الشركة", value: custody.company },
                    { label: "الكمية الإجمالية", value: custody.quantity },
                    { label: "الكمية المتبقية", value: custody.remaining },
                    { label: "الحالة", value: custody.status },
                    {
                      label: "الوقت",
                      value: new Date(custody.time).toLocaleString("ar-EG"),
                    },
                    {
                      label: "تاريخ الإنشاء",
                      value: new Date(custody.createdAt).toLocaleDateString(
                        "ar-EG"
                      ),
                    },
                    {
                      label: "المشاريع",
                      value:
                        Array.isArray(custody.project) &&
                        custody.project.length > 0
                          ? custody.project.join(", ")
                          : "غير مرتبط بمشروع",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex space-x-2">
                      <p className="text-md text-gray-900 dark:text-white">
                        {item.label}:
                      </p>
                      <p className="text-red-700 dark:text-red-300">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isNewOpen && (
        <New isOpen={isNewOpen} onClose={() => setIsNewOpen(false)} />
      )}
      {isAddAmountOpen && (
        <AddAmount
          isOpen={isAddAmountOpen}
          onClose={() => setIsAddAmountOpen(false)}
        />
      )}
    </div>
  );
}
