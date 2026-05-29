export type Tone = "strict" | "brutal" | "chill" | "funny";

export const TONE_LABELS: Record<Tone, string> = {
  strict: "Drill sergeant",
  brutal: "Brutally honest",
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

const PUSH_REMINDERS: Record<Tone, string[]> = {
  strict: [
    "Day {day}/66. Check in now. No excuses.",
    "Day {day}/66. Protect the streak before the clock beats you.",
    "You set the rule. Day {day}/66 still needs your stamp.",
  ],
  brutal: [
    "Day {day}/66. You still have not checked in. Fix it.",
    "If Day {day}/66 dies tonight, that is on you.",
    "The streak does not care why you are late. Day {day}/66 is still open.",
  ],
  chill: [
    "Day {day}/66 is still waiting for you. One quick check-in.",
    "You're close. Mark Day {day}/66 and keep the run alive.",
    "Small action, strong streak. Day {day}/66 just needs your check-in.",
  ],
  funny: [
    "Day {day}/66. Tiny goblin alert: the streak is hungry.",
    "CHECK IN FOR DAY {day}/66 OR THE GOBLIN FILES A COMPLAINT.",
    "Day {day}/66 remains unstamped. The goblin disapproves loudly.",
  ],
};

export function pickReminder(tone: Tone, day: number) {
  const pool = REMINDERS[tone];
  const msg = pool[Math.floor(Math.random() * pool.length)];
  return msg.replace("{day}", String(day));
}

export function pickPushReminder(tone: Tone, day: number) {
  const pool = PUSH_REMINDERS[tone];
  const idx = ((day - 1) % pool.length + pool.length) % pool.length;
  return pool[idx].replace("{day}", String(day));
}

export const PANIC_LINES: Record<Tone, string> = {
  strict: "You're about to throw away {day} days. Sit with that for 60 seconds.",
  brutal: "{day} days. Gone. For what? Wait 60 seconds.",
  chill: "Breathe. {day} days are still yours. The urge passes.",
  funny: "WAIT. {day} DAYS. THE GOBLIN BEGS YOU. 60 SECONDS.",
};

const PROTOCOLS: Record<"build" | "quit", Record<Tone, string[]>> = {
  build: {
    strict: [
      "Execute {habit} today. No negotiation. No 'tomorrow'.",
      "{habit}. Done before sundown. That's the order.",
      "Drop everything else first. {habit} comes before comfort.",
    ],
    brutal: [
      "Do {habit}. You already know what skipping today costs you.",
      "{habit} today, or admit you didn't mean it.",
      "Every day you skip {habit} is a day you chose comfort over the thing you said mattered.",
    ],
    chill: [
      "Today's move: {habit}. Small step, big chain.",
      "Carve out a moment for {habit}. You'll feel it tomorrow.",
      "{habit} today. Future you sends thanks.",
    ],
    funny: [
      "GOBLIN COMMAND: {habit}. NOW. THE GRID HUNGERS.",
      "Do {habit} or I haunt your for-you page.",
      "{habit} today. Or the goblin tells everyone.",
    ],
  },
  quit: {
    strict: [
      "Do not touch it. {habit} is off the table. Period.",
      "When the urge hits: count to 10, walk away. {habit} stays dead.",
      "Today you do not fold. {habit} does not get a vote.",
    ],
    brutal: [
      "Every time you go back to {habit}, you bury what you started.",
      "You said no to {habit}. Mean it for one more day.",
      "{habit} won't fix anything. It never has. Sit with that.",
    ],
    chill: [
      "Urge to {habit}? Let it pass. It always does.",
      "One more day without {habit}. That's all today asks.",
      "When {habit} calls, breathe and stamp the grid instead.",
    ],
    funny: [
      "TOUCH {habit} AND THE GOBLIN WEEPS. DON'T DO IT.",
      "{habit} is a trap. Goblin says no. Goblin is right.",
      "If you fold to {habit} today, the grid tells your mom.",
    ],
  },
};

export function pickProtocol(
  tone: Tone,
  kind: "build" | "quit",
  habit: string,
  day: number,
) {
  const pool = PROTOCOLS[kind][tone];
  // Stable per-day pick
  const idx = ((day % pool.length) + pool.length) % pool.length;
  return pool[idx].replaceAll("{habit}", habit || (kind === "build" ? "your habit" : "the urge"));
}

// Milestone days where gold accents apply.
export const MILESTONES = new Set<number>([22, 44, 66]);
export const FINAL_DAY = 66;
