import { ThemeProvider } from "@/components/providers/theme-provider";
import { Alexandria } from "next/font/google";
import "./globals.css";
import Navbar from "../components/sections/Navbar";
import { AppSidebar } from "@/components/sections/app-sidebar";
import { AntTheme } from "@/components/providers/ant-theme";
import { MUITheme } from "@/components/providers/mui-theme";
import ToastProvider from "@/components/providers/ToastProvider";
import Providers from "../components/providers/providers";
import Sidebar from "@/components/sections/Sidebar";
const cairo = Alexandria({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-cairo",
  fallback: ["Cairo", "sans-serif"],
});
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const isHome = pathname === "/"; // الصفحة الرئيسية

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`flex ${cairo.className}`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AntTheme>
              <MUITheme>
                {!isHome && <Sidebar />}
                <div className="flex-1">
                  {!isHome && <Navbar />}

                  <main className="p-2 bg-white dark:bg-neutral-950 h-screen">
                    <ToastProvider />
                    {children}
                  </main>
                </div>
              </MUITheme>
            </AntTheme>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
