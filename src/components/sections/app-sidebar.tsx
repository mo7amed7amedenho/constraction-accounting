"use client";

import { useState } from "react";
import { Home, Menu, Settings, X } from "lucide-react";
import Logo from "./Logo";
import { motion } from "framer-motion";
import { MENU_ITEMS } from "../menu-items";
import Link from "next/link";

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // Common sidebar content
  const sidebarContent = (
    <>
      <div className="border-b py-4 flex justify-center">
        <Logo />
      </div>
      <div className="flex flex-col h-full p-4">
        <ul className="space-y-2">
          <Link href="/dashboard">
            <li className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 duration-200">
              <Home size={22} />
              <span className="text-base font-medium">الصفحة الرئيسية</span>
            </li>
          </Link>
          {MENU_ITEMS.map((item) => (
  <Link key={item.link} href={item.link}>
    <li className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 duration-200">
      <item.icon size={22} />
      <span className="text-base font-medium">{item.title}</span>
    </li>
  </Link>
))}

          <Link href="/settings">
            <li className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 duration-200">
              <Settings size={22} />
              <span className="text-base font-medium">الإعدادات</span>
            </li>
          </Link>
        </ul>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="bg-white dark:bg-neutral-900 border-r h-screen shadow hidden md:block w-72">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar and Toggle Button */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={isOpen ? { x: "0%" } : { x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 right-0 h-screen w-64 bg-white dark:bg-neutral-900 border-l shadow-lg z-50 md:hidden"
      >
        <div className="border-b p-4 flex justify-between items-center">
          <Logo />
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {MENU_ITEMS.map((item) => (
              <Link key={item.link} href={item.link}>
                <li className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 duration-200">
                  <item.icon size={22} />
                  <span className="text-base font-medium">{item.title}</span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </motion.aside>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-5 left-5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-4 rounded-full shadow-lg transition-transform hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </>
  );
}
