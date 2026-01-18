import { useState } from "react";
import { Palette, Moon, Sun, Laptop, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "@/provider/theme-provider";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "TaskHub - Settings" }];
};
const THEME_COLORS = [
  { name: "Zinc", value: "zinc", color: "bg-zinc-950" },
  { name: "Cyan", value: "cyan", color: "bg-cyan-600" },
  { name: "Rose", value: "rose", color: "bg-rose-600" },
  { name: "Orange", value: "orange", color: "bg-orange-500" },
  { name: "Green", value: "green", color: "bg-green-600" },
  { name: "Blue", value: "blue", color: "bg-blue-600" },
  { name: "Yellow", value: "yellow", color: "bg-yellow-500" },
  { name: "Violet", value: "violet", color: "bg-violet-600" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("appearance");
  const { theme, setTheme, color, setColor } = useTheme();

  const menuItems = [{ id: "appearance", label: "Appearance", icon: Palette }];

  return (
    // کانتینر اصلی با پدینگ ریسپانسیو
    <div className="container max-w-6xl py-6 md:py-10 px-4 mx-auto min-h-full">
      {/* هدر صفحه */}
      <div className="flex flex-col space-y-2 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Customize the appearance of your workspace.
        </p>
      </div>

      {/* چیدمان اصلی: در موبایل ستونی، در دسکتاپ ردیفی */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 h-full">
        {/* --- Sidebar Navigation --- */}
        {/* در موبایل عرض کامل، در دسکتاپ 1/5 عرض */}
        <aside className="w-full lg:w-1/5 overflow-x-auto pb-2 lg:pb-0">
          <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1 min-w-max lg:min-w-0">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  "justify-start hover:bg-muted/50 whitespace-nowrap", // جلوگیری از شکستن متن در موبایل
                  activeTab === item.id && "bg-muted font-medium",
                )}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* --- Main Content Area --- */}
        <div className="flex-1 lg:max-w-4xl space-y-6">
          {/* APPEARANCE (Mode + Color) */}
          {activeTab === "appearance" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* 1. Theme Mode (Light/Dark) */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg md:text-xl">
                    Theme Mode
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Select the color mode for the dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* در موبایل 1 ستونه (یا اسکرولی)، تبلت/دسکتاپ 3 ستونه */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
                    {/* Light Mode */}
                    <div
                      className="space-y-2 cursor-pointer group"
                      onClick={() => setTheme("light")}
                    >
                      <div
                        className={cn(
                          "items-center rounded-md border-2 p-1 transition-all",
                          theme === "light"
                            ? "border-primary"
                            : "border-muted group-hover:border-muted-foreground",
                        )}
                      >
                        <div className="space-y-2 rounded-sm bg-[#ecedef] p-2 aspect-video sm:aspect-auto">
                          <div className="space-y-2 rounded-md bg-white p-2 shadow-sm h-full">
                            <div className="h-2 w-1/2 rounded-lg bg-[#ecedef]" />
                            <div className="h-2 w-3/4 rounded-lg bg-[#ecedef]" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Sun className="h-4 w-4" />
                        <span className="text-sm font-medium">Light</span>
                      </div>
                    </div>

                    {/* Dark Mode */}
                    <div
                      className="space-y-2 cursor-pointer group"
                      onClick={() => setTheme("dark")}
                    >
                      <div
                        className={cn(
                          "items-center rounded-md border-2 p-1 bg-slate-950 transition-all",
                          theme === "dark"
                            ? "border-primary"
                            : "border-muted group-hover:border-muted-foreground",
                        )}
                      >
                        <div className="space-y-2 rounded-sm bg-slate-800 p-2 aspect-video sm:aspect-auto">
                          <div className="space-y-2 rounded-md bg-slate-950 p-2 shadow-sm h-full">
                            <div className="h-2 w-1/2 rounded-lg bg-slate-800" />
                            <div className="h-2 w-3/4 rounded-lg bg-slate-800" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Moon className="h-4 w-4" />
                        <span className="text-sm font-medium">Dark</span>
                      </div>
                    </div>

                    {/* System Mode */}
                    <div
                      className="space-y-2 cursor-pointer group"
                      onClick={() => setTheme("system")}
                    >
                      <div
                        className={cn(
                          "items-center rounded-md border-2 p-1 transition-all",
                          theme === "system"
                            ? "border-primary"
                            : "border-muted group-hover:border-muted-foreground",
                        )}
                      >
                        <div className="space-y-2 rounded-sm bg-slate-300 p-2 aspect-video sm:aspect-auto">
                          <div className="space-y-2 rounded-md bg-slate-600 p-2 shadow-sm h-full">
                            <div className="h-2 w-1/2 rounded-lg bg-slate-400" />
                            <div className="h-2 w-3/4 rounded-lg bg-slate-400" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Laptop className="h-4 w-4" />
                        <span className="text-sm font-medium">System</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Theme Color (Primary Color) */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg md:text-xl">
                    Theme Color
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Select the primary color for buttons, links, and accents.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* در موبایل 2 ستونه، در تبلت/دسکتاپ 4 ستونه */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {THEME_COLORS.map((item) => (
                      <div
                        key={item.value}
                        onClick={() => setColor(item.value as any)}
                        className={cn(
                          "cursor-pointer flex items-center justify-between rounded-md border-2 p-2 hover:bg-muted/50 transition-all",
                          color === item.value
                            ? "border-primary bg-muted"
                            : "border-transparent bg-transparent hover:border-muted",
                        )}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div
                            className={cn(
                              "h-5 w-5 md:h-6 md:w-6 rounded-full border shadow-sm shrink-0",
                              item.color,
                            )}
                          />
                          <span className="text-sm font-medium truncate">
                            {item.name}
                          </span>
                        </div>
                        {color === item.value && (
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
