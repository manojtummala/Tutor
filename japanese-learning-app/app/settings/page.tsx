import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-semibold">Settings</h1><p className="mt-2 text-muted-foreground">Personal app settings for the local MVP.</p></div>
        <Card className="rounded-md bg-white/90"><CardContent className="grid gap-4 p-4 sm:grid-cols-3"><div><p className="font-semibold">Daily goal</p><p className="text-sm text-muted-foreground">10 actions</p></div><div><p className="font-semibold">Timezone</p><p className="text-sm text-muted-foreground">America/Chicago</p></div><div><p className="font-semibold">Data source</p><p className="text-sm text-muted-foreground">Local JSON + SQLite</p></div></CardContent></Card>
      </div>
    </AppShell>
  );
}
