import { SpeakerButton } from "@/components/audio/speaker-button";
import { StatusBadge } from "@/components/practice/status-badge";
import type { ItemStatus, LearningItem } from "@/lib/content/types";
import { cn } from "@/lib/utils";

export function KanaCard({ item, className, showStatus = false }: { item: LearningItem & { status?: ItemStatus }; className?: string; showStatus?: boolean }) {
  return (
    <div className={cn("relative rounded-md border bg-white p-3 shadow-sm", className)}>
      <div className="absolute right-2 top-2">
        <SpeakerButton audioSrc={item.audioSrc} text={item.japanese} className="size-7" />
      </div>
      {showStatus ? (
        <div className="absolute left-2 top-2">
          <StatusBadge status={item.status} />
        </div>
      ) : null}
      <div className="flex min-h-24 items-center justify-center text-5xl font-semibold">{item.japanese}</div>
      <p className="mt-2 text-center text-sm font-medium">{item.romaji ?? item.reading}</p>
    </div>
  );
}
