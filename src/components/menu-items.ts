import {
  DollarSign,
  Users,
  Truck,
  Package,
  PaintRoller,
  HandCoins,
  HardHat,
  Settings,
  Clock,
  Wrench,
  Inbox,
  Shirt,
  Home,
} from "lucide-react";
const items = [
  {
    title: "لوحة التحكم",
    icon: Users,
    items: [
      { title: "الصفحة الرئيسية", url: "/dashboard", icon: Home },

    ],
  },
  {
    title: "الإدارة والموارد البشرية",
    icon: Users,
    items: [
      { title: "إدارة الموظفين", url: "/dashboard/Employees", icon: Users },
      { title: "الحضور والانصراف", url: "/dashboard/Attendance", icon: Clock },
    ],
  },
  {
    title: "الشؤون المالية",
    icon: DollarSign,
    items: [
      { title: "المصروفات", url: "/dashboard/Expenses", icon: HandCoins },
      { title: "الرواتب والسلف", url: "/dashboard/Payroll", icon: DollarSign },
      { title: "العهد المالية", url: "/dashboard/Custody", icon: Package },
    ],
  },
  {
    title: "إدارة المشاريع",
    icon: HardHat,
    items: [
      { title: "إدارة المشاريع", url: "/dashboard/Projects", icon: HardHat },
    ],
  },
  {
    title: "المخزون والمشتريات",
    icon: Truck,
    items: [
      { title: "إدارة الموردين", url: "#", icon: Truck },
      { title: "إدارة المستهلكات", url: "#", icon: Package },
      { title: "إدارة المهمات", url: "#", icon: Shirt }
    ],
  },
  {
    title: "الأصول والمعدات",
    icon: Inbox,
    items: [
      { title: "إدارة المعدات", url: "#", icon: PaintRoller },
      { title: "الصيانة والتكهين", url: "#", icon: Wrench },
    ],
  },
  {
    title: "إعدادات النظام",
    icon: Settings,
    items: [
      { title: "الإعدادات", url: "#", icon: Settings },
      { title: "إدارة المستخدمين", url: "#", icon: Users },
    ],
  },
];

export { items };
