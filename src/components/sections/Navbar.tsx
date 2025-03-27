"use client"; // ✅ تأكيد أن Navbar يعمل فقط على المتصفح

import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { LuRefreshCcw } from "react-icons/lu";
import { ModeToggle } from "@/components/providers/toggleTheme";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ✅ لا تعرض أي شيء حتى يتم تحميل الصفحة

  return (
    <nav className="bg-zinc-50 dark:bg-zinc-900 shadow-md py-2 sm:px-6 px-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 text-black dark:text-white">
      <div>
        <h3 className="text-lg font-bold">مرحبا بك, محمد حامد</h3>
        <p className="text-gray-600 dark:text-gray-400">مطور ويب</p>
      </div>
      <div className="flex items-center space-x-2">
        <ModeToggle />
        <Button
          type="default"
          className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          <span className="max-sm:hidden">Refresh</span>
          <LuRefreshCcw />
        </Button>
      </div>
    </nav>
  );
}
