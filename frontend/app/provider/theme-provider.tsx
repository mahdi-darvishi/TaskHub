"use client"; // اگر از Next.js 13+ App Router استفاده می‌کنید این خط ضروری است

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type ThemeColor =
  | "zinc"
  | "cyan"
  | "rose"
  | "orange"
  | "green"
  | "blue"
  | "yellow"
  | "violet";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  color: ThemeColor;
  setColor: (color: ThemeColor) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  color: "blue",
  setColor: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColor = "blue",
  storageKey = "vite-ui-theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColor?: ThemeColor;
  storageKey?: string;
}) {
  // ✅ اصلاح شد: مقدار اولیه ثابت است تا در سرور کرش نکند
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [color, setColor] = useState<ThemeColor>(defaultColor);
  const [mounted, setMounted] = useState(false); // برای جلوگیری از Hydration Mismatch

  // 1. Load Theme & Color from LocalStorage (Client Side Only)
  useEffect(() => {
    setMounted(true); // کامپوننت در مرورگر سوار شد

    // خواندن تم
    const storedTheme = localStorage.getItem(storageKey);
    if (storedTheme) {
      setTheme(storedTheme as Theme);
    }

    // خواندن رنگ
    const storedColor = localStorage.getItem(`${storageKey}-color`);
    if (storedColor) {
      setColor(storedColor as ThemeColor);
    }
  }, [storageKey]);

  // 2. Effect for Dark/Light Mode
  useEffect(() => {
    // اگر هنوز در مرورگر مانت نشده، اجرا نکن (برای اطمینان)
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme, mounted]);

  // 3. Effect for Theme Color
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    // پاک کردن تمام کلاس‌های رنگی قبلی
    const colorClasses = [
      "theme-zinc",
      "theme-cyan",
      "theme-rose",
      "theme-orange",
      "theme-green",
      "theme-blue",
      "theme-yellow",
      "theme-violet",
    ];
    root.classList.remove(...colorClasses);

    // اضافه کردن رنگ جدید
    root.classList.add(`theme-${color}`);
  }, [color, mounted]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // فقط اگر در کلاینت هستیم ذخیره کن
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, newTheme);
      }
      setTheme(newTheme);
    },
    color,
    setColor: (newColor: ThemeColor) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(`${storageKey}-color`, newColor);
      }
      setColor(newColor);
    },
  };

  // تا زمانی که در کلاینت مانت نشده‌ایم، برای جلوگیری از پرش تصویر (Flash) می‌توان چیزی رندر نکرد
  // اما معمولاً رندر کردن children مشکلی ندارد، فقط تم پیش‌فرض اعمال می‌شود
  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Custom Hook
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
