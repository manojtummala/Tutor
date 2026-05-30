import type { LearningItem, LessonWithItems } from "@/lib/content/types";

export function getCompletionPercent(completed: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}

export function getLessonItemCount(lesson: LessonWithItems) {
  return lesson.items.length;
}

export function getModuleItemCount(items: LearningItem[], moduleId: string) {
  return items.filter((item) => item.moduleId === moduleId).length;
}
