import Link from "next/link";
import { BarChart3, BookOpen, Brain, Flame, GraduationCap, Library, Settings } from "lucide-react";
import { appName } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/practice", label: "Practice", icon: Brain },
  { href: "/review", label: "Review", icon: Flame },
  { href: "/library", label: "Library", icon: Library },
  { href: "/progress", label: "Progress", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,oklch(0.95_0.05_145),transparent_30%),linear-gradient(180deg,oklch(0.985_0.013_91.48),oklch(0.96_0.02_196.86))]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 md:grid-cols-[232px_1fr]">
        <aside className="hidden border-r bg-white/75 px-4 py-5 backdrop-blur md:block">
          <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-lg font-bold text-primary-foreground">か</span>
            <div>
              <p className="font-semibold leading-tight">{appName}</p>
              <p className="text-xs text-muted-foreground">Japanese practice</p>
            </div>
          </Link>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-secondary-foreground"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/85 px-4 py-3 backdrop-blur md:hidden">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">か</span>
              {appName}
            </Link>
          </header>
          <main className={cn("w-full px-4 py-6 md:px-8 md:py-8", className)}>{children}</main>
        </div>
      </div>
    </div>
  );
}
