export type Tone = "strict" | "brutal" | "chill" | "funny";

export const TONE_LABELS: Record<Tone, string> = {
  strict: "Drill sergeant",
  brutal: "Brutal honest",
  chill: "Chill coach",
  funny: "Goblin mode",
};

export const TONE_DESCRIPTIONS: Record<Tone, string> = {
  strict: "No excuses. No softness.",
  brutal: "Cold truth. You signed up for this.",
  chill: "Warm and rooting for you.",
  funny: "Unhinged. Possibly threatening.",
};

const REMINDERS: Record<Tone, string[]> = {
  strict: [
    "Check in. No excuses.",
    "Day {day}. You signed up for this.",
    "The streak doesn't survive procrastination.",
    "Stop scrolling. Log it.",
  ],
  brutal: [
    "You're {day} days in. Don't waste them.",
    "Future you is watching. Pay them.",
    "It's not optional today.",
    "You said this matters. Prove it.",
  ],
  chill: [
    "You got this. Quick check-in?",
    "Day {day} is yours. Stamp it.",
    "Tiny win, big streak. Log today.",
    "Proud of you. Keep the chain alive.",
  ],
  funny: [
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
  brutal: "{day} days. Gone. For what? Wait 60 seconds.",
  chill: "Breathe. {day} days are still yours. The urge passes.",
  funny: "WAIT. {day} DAYS. THE GOBLIN BEGS YOU. 60 SECONDS.",
};
