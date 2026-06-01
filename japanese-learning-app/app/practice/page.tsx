import Link from "next/link";
import { Bot, Brain, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";

const practiceOptions = [
  {
    href: "/practice/kana",
    title: "Kana Practice",
    description: "Practice hiragana and katakana with typing, matching, audio recognition, and multiple choice.",
    action: "Start Kana Practice",
    icon: Brain,
  },
  {
    href: "/practice/agent",
    title: "Agent Practice",
    description: "Generate N5 grammar, sentence, and real-life Japanese practice from learned content.",
    action: "Start Agent Practice",
    icon: Bot,
  },
];

export default function PracticePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Practice</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Choose focused kana drills or generated N5 sentence practice.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {practiceOptions.map((option) => (
            <Link key={option.href} href={option.href} className="group block">
              <Card className="h-full rounded-md bg-white/95 shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-5 p-5">
                  <div className="flex size-11 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <option.icon className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">{option.title}</h2>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <div className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary">
                    {option.action}
                    <ChevronRight className="size-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
