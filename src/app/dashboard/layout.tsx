import { ThemeProvider } from "@/components/providers/theme-provider";
import { Alexandria } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/sections/Navbar";
import { AntTheme } from "@/components/providers/ant-theme";
import { MUITheme } from "@/components/providers/mui-theme";
import ToastProvider from "@/components/providers/ToastProvider";
import Providers from "@/components/providers/providers";
import { AppSidebar } from "@/components/sections/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const alexandria = Alexandria({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-alexandria",
  fallback: ["Cairo", "sans-serif"],
});

interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`flex min-h-screen ${alexandria.className}`}
        suppressHydrationWarning
      >
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AntTheme>
              <MUITheme>
                <SidebarProvider>
                  <div className="flex flex-1">
                    <div className="md:flex">
                      <AppSidebar />
                    </div>
                    <div className="flex-1 flex flex-col w-full">
                      <Navbar />
                      <main className="flex-1">
                        <ToastProvider />
                        {children}
                      </main>
                    </div>
                  </div>
                </SidebarProvider>
              </MUITheme>
            </AntTheme>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
