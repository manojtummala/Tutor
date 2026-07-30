"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, Brain, GraduationCap, Library, Settings } from "lucide-react";
import { appName } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/practice", label: "Practice", icon: Brain },
  { href: "/library", label: "Library", icon: Library },
  { href: "/progress", label: "Progress", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children, className }: { children: React.ReactNode; className?: string }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,oklch(0.95_0.06_145),transparent_40%),radial-gradient(circle_at_80%_80%,oklch(0.94_0.04_196.86),transparent_40%),linear-gradient(180deg,oklch(0.985_0.013_91.48),oklch(0.96_0.02_196.86))]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-white/70 px-4 py-6 backdrop-blur-lg md:block">
          <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-lg font-bold text-primary-foreground shadow-sm">か</span>
            <div>
              <p className="text-base font-semibold leading-tight tracking-tight">{appName}</p>
              <p className="text-xs text-muted-foreground">Japanese practice</p>
            </div>
          </Link>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-secondary/80 hover:text-secondary-foreground",
                  )}
                >
                  <item.icon className={cn("size-4", isActive && "text-primary")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-lg md:hidden">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground text-sm">か</span>
              {appName}
            </Link>
          </header>
          <main className={cn("w-full px-4 py-6 md:px-8 md:py-8", className)}>{children}</main>
        </div>
      </div>
    </div>
  );
}
