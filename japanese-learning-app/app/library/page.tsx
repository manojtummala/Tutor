import { AppShell } from "@/components/layout/app-shell";
import { LibraryClient } from "@/components/library/library-client";
import { getKanaSections, learningItems } from "@/lib/content/data";

export default function LibraryPage() {
  const sections = getKanaSections();

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Library</h1>
          <p className="mt-2 text-muted-foreground">Browse all learning materials. Search, filter, and explore.</p>
        </div>
        <LibraryClient allItems={learningItems} kanaSections={sections} />
      </div>
    </AppShell>
  );
}
