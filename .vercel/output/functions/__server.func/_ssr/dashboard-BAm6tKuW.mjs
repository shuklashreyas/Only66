import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { d as dayNumber, t as todayIso, T as TOTAL_DAYS } from "./day-math-OKL4F-bz.mjs";
import { i as getUserDisplayName, u as updateChallenge, g as getActiveChallengeForUser, e as getCheckInsForChallenge, h as getStoredTheme, T as THEMES, b as createCheckIn, j as setUserDisplayName, s as setStoredTheme, c as clearLocalUser } from "./router-ARfofR06.mjs";
import { isMuted, play, startTick, stopTick, setMuted, playBgm } from "./sound--O_4J7dP.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
const TONE_LABELS = {
  strict: "Drill sergeant",
  brutal: "Brutally honest",
  chill: "Chill coach",
  funny: "Goblin mode"
};
const REMINDERS = {
  strict: [
    "Check in. No excuses.",
    "Day {day}. You signed up for this.",
    "The streak doesn't survive procrastination.",
    "Stop scrolling. Log it."
  ],
  brutal: [
    "You're {day} days in. Don't waste them.",
    "Future you is watching. Pay them.",
    "It's not optional today.",
    "You said this matters. Prove it."
  ],
  chill: [
    "You got this. Quick check-in?",
    "Day {day} is yours. Stamp it.",
    "Tiny win, big streak. Log today.",
    "Proud of you. Keep the chain alive."
  ],
  funny: [
    "BEEP BOOP. STREAK DEMANDS BLOOD.",
    "Day {day}. The goblin is watching.",
    "Don't fold. The goblin remembers.",
    "Feed me a check-in or I cry."
  ]
};
function pickReminder(tone, day) {
  const pool = REMINDERS[tone];
  const msg = pool[Math.floor(Math.random() * pool.length)];
  return msg.replace("{day}", String(day));
}
const PANIC_LINES = {
  strict: "You're about to throw away {day} days. Sit with that for 60 seconds.",
  brutal: "{day} days. Gone. For what? Wait 60 seconds.",
  chill: "Breathe. {day} days are still yours. The urge passes.",
  funny: "WAIT. {day} DAYS. THE GOBLIN BEGS YOU. 60 SECONDS."
};
const PROTOCOLS = {
  build: {
    strict: [
      "Execute {habit} today. No negotiation. No 'tomorrow'.",
      "{habit}. Done before sundown. That's the order.",
      "Drop everything else first. {habit} comes before comfort."
    ],
    brutal: [
      "Do {habit}. You already know what skipping today costs you.",
      "{habit} today, or admit you didn't mean it.",
      "Every day you skip {habit} is a day you chose comfort over the thing you said mattered."
    ],
    chill: [
      "Today's move: {habit}. Small step, big chain.",
      "Carve out a moment for {habit}. You'll feel it tomorrow.",
      "{habit} today. Future you sends thanks."
    ],
    funny: [
      "GOBLIN COMMAND: {habit}. NOW. THE GRID HUNGERS.",
      "Do {habit} or I haunt your for-you page.",
      "{habit} today. Or the goblin tells everyone."
    ]
  },
  quit: {
    strict: [
      "Do not touch it. {habit} is off the table. Period.",
      "When the urge hits: count to 10, walk away. {habit} stays dead.",
      "Today you do not fold. {habit} does not get a vote."
    ],
    brutal: [
      "Every time you go back to {habit}, you bury what you started.",
      "You said no to {habit}. Mean it for one more day.",
      "{habit} won't fix anything. It never has. Sit with that."
    ],
    chill: [
      "Urge to {habit}? Let it pass. It always does.",
      "One more day without {habit}. That's all today asks.",
      "When {habit} calls, breathe and stamp the grid instead."
    ],
    funny: [
      "TOUCH {habit} AND THE GOBLIN WEEPS. DON'T DO IT.",
      "{habit} is a trap. Goblin says no. Goblin is right.",
      "If you fold to {habit} today, the grid tells your mom."
    ]
  }
};
function pickProtocol(tone, kind, habit, day) {
  const pool = PROTOCOLS[kind][tone];
  const idx = (day % pool.length + pool.length) % pool.length;
  return pool[idx].replaceAll("{habit}", habit || (kind === "build" ? "your habit" : "the urge"));
}
const MILESTONES = /* @__PURE__ */ new Set([22, 44, 66]);
const FINAL_DAY = 66;
const DAILY_QUOTES = [
  { text: "We must all suffer one of two things: the pain of discipline or the pain of regret or disappointment.", author: "Jim Rohn" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "With self-discipline most anything is possible.", author: "Theodore Roosevelt" },
  { text: "It was high counsel that I once heard given to a young person, 'Always do what you are afraid to do.'", author: "Ralph Waldo Emerson" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Self-discipline is the magical power that makes you virtually unstoppable.", author: "Dan Kennedy" },
  { text: "The successful person has the habit of doing the things failures don't like to do.", author: "Thomas Edison" },
  { text: "Discipline is the soul of an army. It makes small numbers formidable; procures success to the weak, and esteem to all.", author: "George Washington" },
  { text: "He who cannot obey himself will be commanded. That is the nature of living creatures.", author: "Friedrich Nietzsche" },
  { text: "Freedom is not achieved by satisfying desire, but by the elimination of desire.", author: "Epictetus" },
  { text: "Great leaders always have self-discipline-without exception.", author: "John C. Maxwell" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "The only person you should try to be better than is the person you were yesterday.", author: "Anonymous" },
  { text: "There is nothing noble in being superior to your fellow man; true nobility is being superior to your former self.", author: "Ernest Hemingway" },
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
  { text: "Always be a first-rate version of yourself, instead of a second-rate version of somebody else.", author: "Judy Garland" },
  { text: "Become who you are.", author: "Friedrich Nietzsche" },
  { text: "The best version of you is the one that has decided to stop looking for validation from people who aren't even looking at themselves.", author: "Anonymous" },
  { text: "You are always a valuable person. As long as you believe it, no one else's opinion can alter that.", author: "Wayne Dyer" },
  { text: "Make the most of yourself....for that is all there is of you.", author: "Ralph Waldo Emerson" },
  { text: "Do the best you can until you know better. Then when you know better, do better.", author: "Maya Angelou" },
  { text: "Whether you think you can, or you think you can't-you're right.", author: "Henry Ford" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "If you hear a voice within you say 'you cannot paint,' then by all means paint and that voice will be silenced.", author: "Vincent van Gogh" },
  { text: "Trust thyself: every heart vibrates to that iron string.", author: "Ralph Waldo Emerson" },
  { text: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt" },
  { text: "To build true self-esteem, you must focus on your successes and forget about the failures and the negatives in your life.", author: "Denis Waitley" },
  { text: "The man who wins is the man who thinks he can.", author: "Walter D. Wintle" },
  { text: "If you don't have that self-belief, then you're never going to achieve what you're capable of.", author: "Anonymous" },
  { text: "Don't waste your energy trying to change opinions... Do your thing, and don't care if they like it.", author: "Tina Fey" },
  { text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.", author: "Dr. Seuss" },
  { text: "Magic is believing in yourself, if you can do that, you can make anything happen.", author: "Johann Wolfgang von Goethe" },
  { text: "Character is doing the right thing when nobody's looking.", author: "J.C. Watts" },
  { text: "Be the person your dog thinks you are.", author: "J.W. Stephens" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "I would rather be a superb meteor, every atom of me in magnificent glow, than a sleepy and permanent planet.", author: "Jack London" },
  { text: "Be kind, for everyone you meet is fighting a harder battle.", author: "Plato" },
  { text: "The true measure of a man is how he treats someone who can do him absolutely no good.", author: "Samuel Johnson" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
  { text: "Your life is your message to the world. Make sure it's inspiring.", author: "Anonymous" },
  { text: "I want to be in the arena. I want to be brave with my life.", author: "Brené Brown" },
  { text: "Be a lonely rhinoceros in the world, having no desires and doing no harm.", author: "The Dhammapada" },
  { text: "Live your life in such a way that you would not be ashamed to sell your talking parrot to the town gossip.", author: "Will Rogers" },
  { text: "Confidence comes not from always being right but from not fearing to be wrong.", author: "Peter T. McIntyre" },
  { text: "With confidence, you have won before you have started.", author: "Marcus Garvey" },
  { text: "Kindness in words creates confidence. Kindness in thinking creates profoundness. Kindness in giving creates love.", author: "Lao Tzu" },
  { text: "The eyes of others our prisons; their thoughts our cages.", author: "Virginia Woolf" },
  { text: "Confidence is contagious. So is a lack of confidence.", author: "Vince Lombardi" },
  { text: "You gain strength, courage, and confidence by every experience in which you really stop to look fear in the face.", author: "Eleanor Roosevelt" },
  { text: "Calm mind brings inner strength and self-confidence, so that's very important for good health.", author: "Dalai Lama" },
  { text: "As soon as you trust yourself, you will know how to live.", author: "Johann Wolfgang von Goethe" },
  { text: "Humor comes from self-confidence.", author: "Rita Mae Brown" },
  { text: "True confidence is the ability to be useful in any situation without having to be the center of attention.", author: "Anonymous" },
  { text: "Confidence is silent. Insecurities are loud.", author: "Anonymous" }
];
function pickDailyQuote(day) {
  const index = ((day - 1) % DAILY_QUOTES.length + DAILY_QUOTES.length) % DAILY_QUOTES.length;
  return DAILY_QUOTES[index];
}
function CheckInModal({
  challenge,
  day,
  onClose,
  onDone
}) {
  const [difficulty, setDifficulty] = reactExports.useState(3);
  const [almostFolded, setAlmostFolded] = reactExports.useState(false);
  const [notes, setNotes] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);
  const submit = () => {
    setSubmitting(true);
    try {
      createCheckIn({
        challenge_id: challenge.id,
        day_number: day,
        date: todayIso(),
        completed: true,
        difficulty,
        almost_folded: almostFolded,
        notes: notes.trim() || null
      });
      play("stamp");
      toast.success(`Day ${day} survived.`);
      onDone();
    } catch (err) {
      toast.error(err.message || "Could not save");
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-sm border border-border bg-surface p-6 animate-slide-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-success)] mb-3", children: [
      "[ DAY ",
      day,
      " — STAMP ]"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl uppercase", children: "Survived?" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2", children: [
          "How hard? (",
          difficulty,
          "/5)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "range",
            min: 1,
            max: 5,
            value: difficulty,
            onChange: (e) => setDifficulty(Number(e.target.value)),
            className: "w-full accent-[color:var(--color-primary)]"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: almostFolded,
            onChange: (e) => setAlmostFolded(e.target.checked),
            className: "size-5 accent-[color:var(--color-primary)]"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Almost folded" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: notes,
          onChange: (e) => setNotes(e.target.value),
          rows: 2,
          maxLength: 280,
          placeholder: "Notes (optional)",
          className: "w-full rounded-sm border border-border bg-background px-3 py-2 font-mono text-sm"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "flex-1 rounded-sm border border-border px-4 py-3 font-display uppercase tracking-wider text-sm",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          disabled: submitting,
          onClick: submit,
          className: "flex-1 rounded-sm bg-[color:var(--color-success)] text-background px-4 py-3 font-display uppercase tracking-wider text-sm disabled:opacity-50",
          children: submitting ? "..." : "Stamp it"
        }
      )
    ] })
  ] }) });
}
function PanicModal({
  challenge,
  day,
  message,
  onClose,
  onFold
}) {
  const [seconds, setSeconds] = reactExports.useState(60);
  reactExports.useEffect(() => {
    play("panic");
    startTick();
    return () => stopTick();
  }, []);
  reactExports.useEffect(() => {
    if (seconds <= 0) {
      stopTick();
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1e3);
    return () => clearTimeout(t);
  }, [seconds]);
  const survived = () => {
    play("sword");
    toast.success("You held the line.");
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg rounded-sm border-2 border-primary bg-background p-8 animate-slide-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3 animate-pulse", children: "[ PANIC PROTOCOL ENGAGED ]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl uppercase", children: "Hold the line." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: message }),
    challenge.motivation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-sm border border-border bg-surface p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Why you started" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
        '"',
        challenge.motivation,
        '"'
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-7xl text-primary", children: seconds }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1", children: "seconds remaining" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          disabled: seconds > 0,
          onClick: survived,
          className: `rounded-sm px-4 py-3 font-display uppercase tracking-wider transition ${seconds > 0 ? "bg-surface-2 text-muted-foreground border border-border cursor-not-allowed" : "bg-primary text-primary-foreground hover:opacity-90 shadow-[0_0_24px_oklch(0.62_0.24_25/0.6)]"}`,
          children: seconds > 0 ? `WAIT ${seconds}S` : "I'm staying in"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onFold,
          className: "rounded-sm border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-surface",
          children: "I'm folding"
        }
      )
    ] })
  ] }) });
}
function SettingsSheet({
  challenge,
  onClose,
  onChanged
}) {
  const navigate = useNavigate();
  const [tone, setTone] = reactExports.useState(challenge.tone);
  const [reminderTime, setReminderTime] = reactExports.useState(challenge.reminder_time.slice(0, 5));
  const [displayName, setDisplayName] = reactExports.useState(getUserDisplayName() ?? "");
  const [theme, setTheme] = reactExports.useState(getStoredTheme());
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);
  const save = () => {
    setSaving(true);
    try {
      setUserDisplayName(displayName);
      setStoredTheme(theme);
      updateChallenge(challenge.id, { tone, reminder_time: reminderTime + ":00" });
      toast.success("Saved.");
      onChanged();
      onClose();
    } catch (err) {
      toast.error(err.message || "Save failed");
      setSaving(false);
    }
  };
  const abandon = () => {
    if (!confirm("Abandon this challenge? Your streak ends here.")) return;
    updateChallenge(challenge.id, { status: "abandoned" });
    toast("Challenge abandoned.");
    navigate({ to: "/folded" });
  };
  const signOut = () => {
    clearLocalUser();
    navigate({ to: "/" });
  };
  const requestNotifs = async () => {
    if (typeof Notification === "undefined") return toast.error("Not supported");
    const res = await Notification.requestPermission();
    if (res === "granted") toast.success("Notifications on.");
    else toast.error("Permission denied.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/80 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full w-full max-w-md bg-surface border-l border-border overflow-y-auto animate-slide-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-border flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl uppercase", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-muted-foreground hover:text-foreground font-mono text-xs uppercase", children: "Close" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Challenge" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl", children: challenge.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Tone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: Object.keys(TONE_LABELS).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setTone(t),
            className: `rounded-sm border px-3 py-2 text-left text-sm ${tone === t ? "border-primary bg-primary/10" : "border-border bg-background"}`,
            children: TONE_LABELS[t]
          },
          t
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Reminder time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "time",
            value: reminderTime,
            onChange: (e) => setReminderTime(e.target.value),
            className: "rounded-sm border border-border bg-background px-3 py-2 font-mono"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Display name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: displayName,
            onChange: (e) => setDisplayName(e.target.value),
            placeholder: "What should we call you?",
            maxLength: 50,
            className: "w-full rounded-sm border border-border bg-background px-3 py-2 font-mono"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Theme" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: THEMES.map((themeOption) => {
          const selected = themeOption.id === theme;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setTheme(themeOption.id),
              className: `w-full rounded-sm border px-3 py-2 text-left bg-background transition ${selected ? "border-primary shadow-[0_0_14px_color-mix(in_srgb,var(--primary)_35%,transparent)]" : "border-border hover:bg-surface-2"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-foreground", children: themeOption.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: themeOption.description })
              ]
            },
            themeOption.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: requestNotifs,
            className: "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm font-mono uppercase tracking-widest hover:bg-surface-2",
            children: "Enable browser notifications"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            disabled: true,
            className: "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm font-mono uppercase tracking-widest opacity-40 cursor-not-allowed",
            children: "SMS reminders — coming soon"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: save,
          disabled: saving,
          className: "w-full rounded-sm bg-primary text-primary-foreground px-4 py-3 font-display uppercase tracking-wider disabled:opacity-50",
          children: saving ? "Saving..." : "Save"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-6 border-t border-border space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: abandon,
            className: "w-full rounded-sm border border-primary text-primary px-4 py-2 text-sm font-display uppercase tracking-wider hover:bg-primary/10",
            children: "Abandon challenge"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: signOut,
            className: "w-full rounded-sm border border-border px-4 py-2 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:bg-background",
            children: "Sign out"
          }
        )
      ] })
    ] })
  ] }) });
}
function SoundToggle() {
  const [muted, setMutedState] = reactExports.useState(true);
  reactExports.useEffect(() => {
    setMutedState(isMuted());
    const onChange = () => setMutedState(isMuted());
    window.addEventListener("only66:mute-changed", onChange);
    return () => window.removeEventListener("only66:mute-changed", onChange);
  }, []);
  const toggle = () => {
    const next = !muted;
    setMuted(next);
    if (!next) playBgm();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      "data-no-sfx": "1",
      onClick: toggle,
      title: muted ? "Sound off" : "Sound on",
      className: "rounded-sm border border-border px-3 py-2 text-xs font-mono uppercase tracking-widest hover:bg-surface",
      children: muted ? "♪ OFF" : "♪ ON"
    }
  );
}
function Dashboard() {
  const navigate = useNavigate();
  const [challenge, setChallenge] = reactExports.useState(null);
  const [checkIns, setCheckIns] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showCheckIn, setShowCheckIn] = reactExports.useState(false);
  const [showPanic, setShowPanic] = reactExports.useState(false);
  const [showSettings, setShowSettings] = reactExports.useState(false);
  const [displayName, setDisplayName] = reactExports.useState(null);
  const [selectedDay, setSelectedDay] = reactExports.useState(null);
  const [newlyUnlockedDay, setNewlyUnlockedDay] = reactExports.useState(null);
  const hasInitializedRef = reactExports.useRef(false);
  const prevTodayDoneRef = reactExports.useRef(false);
  const load = () => {
    const ch = getActiveChallengeForUser();
    if (!ch) {
      navigate({
        to: "/onboarding"
      });
      return;
    }
    setChallenge(ch);
    const cins = getCheckInsForChallenge(ch.id);
    setCheckIns(cins);
    setLoading(false);
  };
  const fold = () => {
    if (!challenge) return;
    updateChallenge(challenge.id, {
      status: "abandoned"
    });
    toast("Challenge abandoned.");
    setShowPanic(false);
    navigate({
      to: "/folded"
    });
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  reactExports.useEffect(() => {
    setDisplayName(getUserDisplayName());
  }, []);
  const today = challenge ? dayNumber(challenge.start_date) : 0;
  const todayDone = reactExports.useMemo(() => checkIns.some((c) => c.date === todayIso() && c.completed), [checkIns]);
  const survivedCount = checkIns.filter((c) => c.completed).length;
  const hp = challenge ? Math.max(0, Math.min(100, Math.round(survivedCount / TOTAL_DAYS * 100))) : 0;
  reactExports.useEffect(() => {
    if (!challenge) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    let cancelled = false;
    const tick = () => {
      if (cancelled || !challenge) return;
      const [h, m] = challenge.reminder_time.split(":").map(Number);
      const now = /* @__PURE__ */ new Date();
      if (now.getHours() === h && now.getMinutes() === m) {
        if (!todayDone) {
          new Notification("Only 66", {
            body: pickReminder(challenge.tone, today),
            tag: "only66-daily"
          });
        }
      }
    };
    const interval = setInterval(tick, 6e4);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [challenge, todayDone, today]);
  reactExports.useEffect(() => {
    if (!challenge || loading) return;
    if (survivedCount >= TOTAL_DAYS) {
      updateChallenge(challenge.id, {
        status: "completed"
      });
      navigate({
        to: "/win"
      });
    }
  }, [survivedCount, challenge, loading, navigate]);
  reactExports.useEffect(() => {
    if (loading) return;
    if (!hasInitializedRef.current) {
      prevTodayDoneRef.current = todayDone;
      hasInitializedRef.current = true;
      return;
    }
    if (todayDone && !prevTodayDoneRef.current) {
      setNewlyUnlockedDay(today);
      const t = setTimeout(() => setNewlyUnlockedDay(null), 2200);
      prevTodayDoneRef.current = true;
      return () => clearTimeout(t);
    }
    if (!todayDone) prevTodayDoneRef.current = false;
  }, [loading, todayDone, today]);
  if (loading || !challenge) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center font-mono text-muted-foreground text-sm uppercase tracking-widest", children: "Loading..." });
  }
  const dayMap = /* @__PURE__ */ new Map();
  checkIns.forEach((c) => dayMap.set(c.day_number, c));
  const displayDay = selectedDay ?? today;
  const selectedIsUnlocked = displayDay < today ? dayMap.get(displayDay)?.completed === true : displayDay === today ? todayDone : false;
  const isNewlyUnlocked = newlyUnlockedDay === displayDay;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-6 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "font-display text-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "ONLY" }),
        " 66"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SoundToggle, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowSettings(true), className: "rounded-sm border border-border px-3 py-2 text-xs font-display uppercase tracking-wider hover:bg-surface", children: "Settings" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-5xl px-6 py-8 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-sm border border-border bg-surface p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary", children: [
              "[ DAY ",
              String(today).padStart(2, "0"),
              " / 66 ]"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-display text-4xl uppercase", children: challenge.name }),
            challenge.motivation && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground max-w-md", children: [
              '"',
              challenge.motivation,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: "Survived" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-5xl text-primary", children: survivedCount })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Survival Meter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              hp,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full rounded-sm border border-border bg-background overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary transition-all duration-500", style: {
            width: `${hp}%`
          } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: todayDone || today < 1, onClick: () => setShowCheckIn(true), className: `rounded-sm px-6 py-3 font-display text-lg uppercase tracking-wider ${todayDone ? "bg-primary/30 border border-primary text-primary cursor-default" : "bg-primary text-primary-foreground hover:opacity-90"}`, children: todayDone ? `Day ${today} survived` : `I survived day ${today}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPanic(true), className: "rounded-sm border-2 border-primary text-primary px-6 py-3 font-display uppercase tracking-wider hover:bg-primary/10 animate-pulse-red", children: "I'm about to fold" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground/50", children: "[ OPERATIVE STATUS ]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl uppercase tracking-wider text-foreground drop-shadow-[0_0_8px_oklch(0.62_0.24_25/0.45)]", children: displayName ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "THE RUN CONTINUES, ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: displayName }),
          "."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "THE RUN CONTINUES." }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-start gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3", children: "[ THE 66 ]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-11 gap-1.5 sm:gap-2", children: Array.from({
            length: TOTAL_DAYS
          }, (_, i) => i + 1).map((d) => {
            const c = dayMap.get(d);
            const isToday = d === today;
            const isPast = d < today;
            const survived = !!c?.completed;
            const violated = isPast && !survived;
            const isFinal = d === FINAL_DAY;
            const isMilestone = MILESTONES.has(d) && d !== FINAL_DAY;
            const isClickable = survived || isToday;
            const isSelected = d === displayDay;
            const base = "aspect-square rounded-sm border flex items-center justify-center font-mono text-[10px] sm:text-xs transition relative";
            let cls = "";
            if (survived && isFinal) {
              cls = "bg-primary border-[color:var(--color-reward)] text-primary-foreground shadow-[0_0_18px_oklch(0.85_0.18_90/0.6)]";
            } else if (survived) {
              cls = `bg-primary border-primary text-primary-foreground shadow-[0_0_10px_oklch(0.62_0.24_25/0.55)] ${isMilestone ? "ring-1 ring-[color:var(--color-reward)]" : ""}`;
            } else if (isToday) {
              cls = "border-2 border-primary text-primary bg-primary/10 animate-pulse-red";
            } else if (violated) {
              cls = "bg-[oklch(0.25_0.08_25)] border-[oklch(0.4_0.12_25)] text-[oklch(0.55_0.12_25)] line-through";
            } else if (isFinal) {
              cls = "border-[color:var(--color-reward)]/70 text-[color:var(--color-reward)] bg-[color:var(--color-reward)]/5";
            } else if (isMilestone) {
              cls = "border-[color:var(--color-reward)]/40 text-[color:var(--color-reward)]/70 bg-surface";
            } else {
              cls = "border-border/40 bg-surface/40 text-muted-foreground/40";
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${base} ${cls}${isClickable ? " cursor-pointer" : ""}${isSelected && isClickable ? " outline-2 outline-offset-1 outline-primary/60" : ""}`, title: `Day ${d}${isFinal ? " — FINAL" : isMilestone ? " — milestone" : ""}`, onClick: isClickable ? () => setSelectedDay(d) : void 0, children: survived ? isFinal ? "★" : "✓" : d }, d);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TransmissionCard, { day: displayDay, isUnlocked: selectedIsUnlocked, isNewlyUnlocked })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid grid-cols-3 gap-3", children: [["Streak", String(currentStreak(checkIns))], ["Best", String(bestStreak(checkIns))], ["Days left", String(Math.max(0, TOTAL_DAYS - today + 1))]].map(([label, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-sm border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-3xl", children: val })
      ] }, label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-sm border-l-4 border-primary bg-surface p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3", children: "[ TODAY'S PROTOCOL ]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl uppercase leading-tight", children: pickProtocol(challenge.tone, challenge.kind, challenge.name, today) }),
        challenge.motivation && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
          'Why: "',
          challenge.motivation,
          '"'
        ] })
      ] })
    ] }),
    showCheckIn && /* @__PURE__ */ jsxRuntimeExports.jsx(CheckInModal, { challenge, day: today, onClose: () => setShowCheckIn(false), onDone: () => {
      setShowCheckIn(false);
      setSelectedDay(null);
      load();
    } }),
    showPanic && /* @__PURE__ */ jsxRuntimeExports.jsx(PanicModal, { challenge, day: today, message: PANIC_LINES[challenge.tone].replace("{day}", String(survivedCount)), onClose: () => setShowPanic(false), onFold: fold }),
    showSettings && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsSheet, { challenge, onClose: () => setShowSettings(false), onChanged: () => {
      load();
      setDisplayName(getUserDisplayName());
    } })
  ] });
}
function TransmissionCard({
  day,
  isUnlocked,
  isNewlyUnlocked
}) {
  const quote = pickDailyQuote(day);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "rounded-sm border-l-4 border-primary bg-surface p-5 shadow-[0_0_24px_oklch(0.62_0.24_25/0.15)] lg:w-72 xl:w-80 shrink-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4", children: [
      "[ DAY ",
      String(day).padStart(2, "0"),
      " TRANSMISSION. ]"
    ] }),
    isUnlocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: isNewlyUnlocked ? "animate-quote-flicker" : "", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg leading-relaxed text-foreground", children: [
        "“",
        quote.text,
        "”"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 font-mono text-xs text-muted-foreground tracking-wide", children: [
        "— ",
        quote.author
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-primary/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.3em] text-primary/50", children: "locked" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-primary/30" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground/60 pt-1", children: "TRANSMISSION LOCKED" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
        "Survive Day ",
        day,
        " to unlock."
      ] })
    ] })
  ] });
}
function currentStreak(cins) {
  const byDay = new Map(cins.map((c) => [c.day_number, c]));
  const maxDay = Math.max(0, ...cins.map((c) => c.day_number));
  let s = 0;
  for (let d = maxDay; d >= 1; d--) {
    if (byDay.get(d)?.completed) s++;
    else break;
  }
  return s;
}
function bestStreak(cins) {
  const days = cins.filter((c) => c.completed).map((c) => c.day_number).sort((a, b) => a - b);
  let best = 0, run = 0, prev = -1;
  for (const d of days) {
    if (d === prev + 1) run++;
    else run = 1;
    if (run > best) best = run;
    prev = d;
  }
  return best;
}
export {
  Dashboard as component
};
