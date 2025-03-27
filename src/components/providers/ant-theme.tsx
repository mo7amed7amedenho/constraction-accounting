"use client";

import { ConfigProvider, theme } from "antd";
import { useTheme } from "next-themes";

export function AntTheme({ children }: { children: React.ReactNode }) {
  const { theme: mode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: "Alexandria, Cairo, sans-serif",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
