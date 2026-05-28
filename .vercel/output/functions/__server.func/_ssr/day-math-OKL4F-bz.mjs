const TOTAL_DAYS = 66;
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function todayIso() {
  const d = startOfDay(/* @__PURE__ */ new Date());
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function dayNumber(startDate) {
  const start = startOfDay(/* @__PURE__ */ new Date(startDate + "T00:00:00"));
  const today = startOfDay(/* @__PURE__ */ new Date());
  const diff = Math.floor((today.getTime() - start.getTime()) / 864e5);
  return diff + 1;
}
export {
  TOTAL_DAYS as T,
  dayNumber as d,
  todayIso as t
};
