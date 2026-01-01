import React, { useEffect, useState } from "react";
import { QrCodeTool } from "./components/QRCodeTool";

export type Theme = "light" | "dark";

export default function App() {
  const [theme, setTheme] = useState<Theme>("light");

  // Keep <html> in sync with theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Listen for parent window postMessage
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data || {};
      if (
        (data.type === "THEME_CHANGE" || data.type === "THEME_RESPONSE") &&
        (data.theme === "light" || data.theme === "dark")
      ) {
        setTheme(data.theme);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="min-h-screen font-sans flex justify-center items-start pt-6 pb-12 px-4 bg-white text-gray-900 dark:bg-[#050706] dark:text-white">
      <div className="w-full max-w-[460px] mx-auto">
        <QrCodeTool theme={theme} />
      </div>
    </div>
  );
}
