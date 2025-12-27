import { useState } from "react";
import { Bell, Palette, Moon, Sun, Laptop, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "@/provider/theme-provider";

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

  const menuItems = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="container max-w-6xl py-8 mx-auto h-full">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize the appearance and preferences of your workspace.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* --- Sidebar Navigation --- */}
        <aside className="lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  "justify-start hover:bg-muted/50",
                  activeTab === item.id && "bg-muted font-medium"
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
        <div className="flex-1 lg:max-w-3xl space-y-6">
          {/* APPEARANCE (Mode + Color) */}
          {activeTab === "appearance" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* 1. Theme Mode (Light/Dark) */}
              <Card>
                <CardHeader>
                  <CardTitle>Theme Mode</CardTitle>
                  <CardDescription>
                    Select the color mode for the dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
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
                            : "border-muted group-hover:border-muted-foreground"
                        )}
                      >
                        <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                          <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-2 w-20 rounded-lg bg-[#ecedef]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
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
                            : "border-muted group-hover:border-muted-foreground"
                        )}
                      >
                        <div className="space-y-2 rounded-sm bg-slate-800 p-2">
                          <div className="space-y-2 rounded-md bg-slate-950 p-2 shadow-sm">
                            <div className="h-2 w-20 rounded-lg bg-slate-800" />
                            <div className="h-2 w-[100px] rounded-lg bg-slate-800" />
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
                            : "border-muted group-hover:border-muted-foreground"
                        )}
                      >
                        <div className="space-y-2 rounded-sm bg-slate-300 p-2">
                          <div className="space-y-2 rounded-md bg-slate-600 p-2 shadow-sm">
                            <div className="h-2 w-20 rounded-lg bg-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
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
                <CardHeader>
                  <CardTitle>Theme Color</CardTitle>
                  <CardDescription>
                    Select the primary color for buttons, links, and accents.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {THEME_COLORS.map((item) => (
                      <div
                        key={item.value}
                        onClick={() => setColor(item.value as any)}
                        className={cn(
                          "cursor-pointer flex items-center justify-between rounded-md border-2 p-2 hover:bg-muted/50 transition-all",
                          color === item.value
                            ? "border-primary bg-muted"
                            : "border-transparent bg-transparent hover:border-muted"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-6 w-6 rounded-full border shadow-sm",
                              item.color
                            )}
                          />
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                        </div>
                        {color === item.value && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Choose what updates you want to receive via email.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="task-assign"
                      className="flex flex-col space-y-1"
                    >
                      <span>Task Assignments</span>
                      <span className="font-normal text-xs text-muted-foreground">
                        Receive emails when you are assigned a new task.
                      </span>
                    </Label>
                    <Switch id="task-assign" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="project-updates"
                      className="flex flex-col space-y-1"
                    >
                      <span>Project Updates</span>
                      <span className="font-normal text-xs text-muted-foreground">
                        Receive emails about major updates in your projects.
                      </span>
                    </Label>
                    <Switch id="project-updates" defaultChecked />
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
