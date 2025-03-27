"use client";
import Link from "next/link";
import { LuAlignJustify } from "react-icons/lu";
import { IoMdClose, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "@/components/menu-items";

const Sidebar = () => {
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => setSidebarToggled(false), [pathname]);

  return (
    <>
      <aside
        dir="rtl"
        className={`fixed top-0 right-0 z-50 h-screen w-72 bg-white dark:bg-zinc-900 dark:text-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          sidebarToggled ? "translate-x-0" : "translate-x-full"
        } lg:static lg:translate-x-0`}
      >
        <div className="border-b dark:border-b-zinc-700 p-4">
          <Link href="#" className="flex items-center gap-3">
            <Logo />
          </Link>
        </div>

        <nav className="p-4 space-y-2 text-zinc-700 dark:text-white">
          {loading ? (
            // عرض مؤقت أثناء تحميل البيانات
            <>
              {[...Array(22)].map((_, i) => (
                <div
                  key={i}
                  className="h-5 bg-gray-200 space-y-3 dark:bg-gray-700 animate-pulse rounded-lg"
                ></div>
              ))}
            </>
          ) : MENU_ITEMS.length === 0 ? (
            <p className="text-center text-gray-500">لا توجد عناصر متاحة</p>
          ) : (
            MENU_ITEMS.map((item) => (
              <div key={item.title}>
                {item.subItems.length > 0 ? (
                  <>
                    {/* زر البند الذي يحتوي على بنود فرعية */}
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === item.title ? null : item.title)
                      }
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="text-xl text-blue-600" />
                        <span>{item.title}</span>
                      </div>
                      {openMenu === item.title ? (
                        <IoIosArrowUp className="text-xl" />
                      ) : (
                        <IoIosArrowDown className="text-xl" />
                      )}
                    </button>
                  </>
                ) : (
                  // عرض البند في حالة عدم وجود بنود فرعية
                  <Link
                    href={item.link}
                    className="flex items-center p-3 gap-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition duration-300"
                  >
                    <item.icon className="text-xl text-blue-600" />
                    <span>{item.title}</span>
                  </Link>
                )}
              </div>
            ))
          )}
        </nav>
      </aside>

      {/* زر التبديل (للعرض على الشاشات الصغيرة) */}
      <button
        onClick={() => setSidebarToggled(!sidebarToggled)}
        className="lg:hidden fixed bottom-8 left-8 p-3 rounded-full shadow-md z-50 bg-blue-700 text-white hover:bg-blue-800 transition duration-300"
      >
        {sidebarToggled ? (
          <IoMdClose className="text-2xl" />
        ) : (
          <LuAlignJustify className="text-2xl" />
        )}
      </button>
    </>
  );
};

export default Sidebar;
