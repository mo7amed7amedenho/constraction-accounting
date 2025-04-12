"use client"; // ✅ تأكيد أن Navbar يعمل فقط على المتصفح

import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { LuRefreshCcw } from "react-icons/lu";
import { ModeToggle } from "@/components/providers/toggleTheme";
import { SidebarTrigger } from "../ui/sidebar";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ✅ لا تعرض أي شيء حتى يتم تحميل الصفحة

  return (
    <nav className="shadow-md py-2 sm:px-6 px-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 text-black dark:text-white">
      <div className="flex flex-col gap-1 py-1">
        <h3 className="text-sm font-bold">مرحبا بك, محمد حامد</h3>
        <p className="text-gray-600 text-sm dark:text-gray-400">مطور ويب</p>
      </div>
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <ModeToggle />
        <Button
          type="default"
          className="flex items-center gap-2  text-black dark:text-white border-gray-300 dark:border-gray-600"
        >
          <span className="max-sm:hidden">Refresh</span>
          <LuRefreshCcw />
        </Button>
      </div>
    </nav>
  );
}
