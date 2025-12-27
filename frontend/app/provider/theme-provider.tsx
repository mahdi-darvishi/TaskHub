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
  defaultTheme = "dark",
  defaultColor = "blue",
  storageKey = "vite-ui-theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColor?: ThemeColor;
  storageKey?: string;
}) {
  // 1. Load Theme from LocalStorage
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  // 2. Load Color from LocalStorage
  const [color, setColor] = useState<ThemeColor>(
    () =>
      (localStorage.getItem(`${storageKey}-color`) as ThemeColor) ||
      defaultColor
  );

  // 3. Effect for Dark/Light Mode
  useEffect(() => {
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
  }, [theme]);

  // 4. Effect for Theme Color
  useEffect(() => {
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
  }, [color]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    color,
    setColor: (color: ThemeColor) => {
      localStorage.setItem(`${storageKey}-color`, color);
      setColor(color);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Custom Hook برای استفاده راحت‌تر
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
