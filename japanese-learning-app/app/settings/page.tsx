"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const router = useRouter();
  const [dailyGoal, setDailyGoal] = useState(10);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    if (!confirm("Reset all progress? This cannot be undone.")) return;
    setResetting(true);
    try {
      await fetch("/api/reset", { method: "POST" });
      router.refresh();
    } finally {
      setResetting(false);
    }
  }

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className="mt-2 text-muted-foreground">Configure your learning preferences.</p>
        </div>

        <Card className="rounded-2xl border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Learning Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily goal</p>
                <p className="text-sm text-muted-foreground">Practice or review actions per day</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setDailyGoal(Math.max(5, dailyGoal - 5))}
                >
                  -5
                </Button>
                <span className="w-12 text-center text-lg font-bold">{dailyGoal}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setDailyGoal(Math.min(50, dailyGoal + 5))}
                >
                  +5
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
              </div>
              <Button variant="outline" className="rounded-xl" size="sm" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                <span className="ml-2">{theme === "light" ? "Dark mode" : "Light mode"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-white shadow-sm border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive text-lg">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reset progress</p>
                <p className="text-sm text-muted-foreground">Clear all practice attempts and item progress</p>
              </div>
              <Button variant="destructive" className="rounded-xl" size="sm" disabled={resetting} onClick={handleReset}>
                <Trash2 className="size-4" />
                <span className="ml-2">{resetting ? "Resetting..." : "Reset"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">App:</span> Kana Path</p>
            <p><span className="font-medium text-foreground">Data source:</span> Local JSON + SQLite</p>
            <p><span className="font-medium text-foreground">Timezone:</span> America/Chicago</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
