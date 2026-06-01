import { Badge } from "@/components/ui/badge";
import type { ItemStatus } from "@/lib/content/types";

const labels: Record<ItemStatus, string> = {
  new: "New",
  introduced: "Introduced",
  practicing: "Practicing",
  learned: "Learned",
  learning: "Learning",
  reviewing: "Reviewing",
  mastered: "Mastered",
  difficult: "Difficult",
};

export function StatusBadge({ status = "new" }: { status?: ItemStatus }) {
  return <Badge variant={status === "difficult" ? "destructive" : status === "mastered" || status === "learned" ? "default" : "secondary"}>{labels[status]}</Badge>;
}
