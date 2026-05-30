const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getChicagoDateKey(date = new Date()) {
  return formatter.format(date);
}

export function updateStreak(currentStreak: number, longestStreak: number, lastActiveDate: string | null, activeDate = getChicagoDateKey()) {
  if (lastActiveDate === activeDate) {
    return { currentStreak, longestStreak, lastActiveDate };
  }

  const yesterday = new Date(`${activeDate}T12:00:00`);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getChicagoDateKey(yesterday);
  const nextCurrentStreak = lastActiveDate === yesterdayKey ? currentStreak + 1 : 1;

  return {
    currentStreak: nextCurrentStreak,
    longestStreak: Math.max(longestStreak, nextCurrentStreak),
    lastActiveDate: activeDate,
  };
}
