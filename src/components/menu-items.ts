import {
  DollarSign,
  Users,
  Truck,
  Package,
  PaintRoller,
  List,
  HardHat,
  Settings,
  FileText,
  BarChart,
  Clock,
  Wrench,
  Inbox,
} from "lucide-react";
const items = [
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
      { title: "المصروفات", url: "#", icon: DollarSign },
      { title: "الرواتب والسلف", url: "#", icon: DollarSign },
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
      { title: "إدارة المخزون", url: "#", icon: Package },
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
