export type Tone = "strict" | "supportive" | "chaotic";

export const TONE_LABELS: Record<Tone, string> = {
  strict: "Drill sergeant",
  supportive: "Hype coach",
  chaotic: "Goblin mode",
};

const REMINDERS: Record<Tone, string[]> = {
  strict: [
    "Check in. No excuses.",
    "Day {day}. You signed up for this.",
    "The streak doesn't survive procrastination.",
    "Stop scrolling. Log it.",
  ],
  supportive: [
    "You got this. Quick check-in?",
    "Day {day} is yours. Stamp it.",
    "Tiny win, big streak. Log today.",
    "Proud of you. Keep the chain alive.",
  ],
  chaotic: [
    "BEEP BOOP. STREAK DEMANDS BLOOD.",
    "Day {day}. The goblin is watching.",
    "Don't fold. The goblin remembers.",
    "Feed me a check-in or I cry.",
  ],
};

export function pickReminder(tone: Tone, day: number) {
  const pool = REMINDERS[tone];
  const msg = pool[Math.floor(Math.random() * pool.length)];
  return msg.replace("{day}", String(day));
}

export const PANIC_LINES: Record<Tone, string> = {
  strict: "You're about to throw away {day} days. Sit with that for 60 seconds.",
  supportive: "Breathe. {day} days are still yours. The urge passes.",
  chaotic: "WAIT. {day} DAYS. THE GOBLIN BEGS YOU. 60 SECONDS.",
};
