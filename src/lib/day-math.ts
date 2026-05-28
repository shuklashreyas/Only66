export const TOTAL_DAYS = 66;

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function todayIso() {
  const d = startOfDay(new Date());
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function dayNumber(startDate: string) {
  const start = startOfDay(new Date(startDate + "T00:00:00"));
  const today = startOfDay(new Date());
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000);
  return diff + 1; // day 1 on start date
}
