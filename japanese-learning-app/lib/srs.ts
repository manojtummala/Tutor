import type { ItemStatus } from "@/lib/content/types";

export type ReviewRating = "again" | "hard" | "good" | "easy";

export type SrsProgress = {
  status: ItemStatus;
  ease: number;
  intervalDays: number;
  correctCount: number;
  wrongCount: number;
};

const ratingIntervals: Record<ReviewRating, { minutes?: number; days?: number }> = {
  again: { minutes: 5 },
  hard: { days: 1 },
  good: { days: 3 },
  easy: { days: 7 },
};

export function getNextDueDate(rating: ReviewRating, from = new Date()) {
  const interval = ratingIntervals[rating];
  const next = new Date(from);

  if (interval.minutes) {
    next.setMinutes(next.getMinutes() + interval.minutes);
  }

  if (interval.days) {
    next.setDate(next.getDate() + interval.days);
  }

  return next;
}

export function updateSrsProgress(progress: SrsProgress, rating: ReviewRating): SrsProgress {
  const isCorrect = rating !== "again";
  const correctCount = progress.correctCount + (isCorrect ? 1 : 0);
  const wrongCount = progress.wrongCount + (isCorrect ? 0 : 1);
  const status: ItemStatus = !isCorrect
    ? "difficult"
    : correctCount >= 8
      ? "mastered"
      : correctCount >= 3
        ? "reviewing"
        : "learning";

  return {
    status,
    ease: Math.max(1.3, progress.ease + (rating === "easy" ? 0.15 : rating === "again" ? -0.2 : 0)),
    intervalDays: ratingIntervals[rating].days ?? 0,
    correctCount,
    wrongCount,
  };
}
