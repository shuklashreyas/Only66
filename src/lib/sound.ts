// Lightweight sound manager for Only 66.
// Honors a global mute flag stored in localStorage. Auto-loops BGM at low volume.

type SfxName = "click" | "stamp" | "panic" | "tick" | "sword";

const SFX_SRC: Record<SfxName, string> = {
  click: "/sounds/click.mp3",
  stamp: "/sounds/stamp.mp3",
  panic: "/sounds/panic.mp3",
  tick: "/sounds/tick.mp3",
  sword: "/sounds/sword.mp3",
};

const SFX_VOL: Record<SfxName, number> = {
  click: 0.25,
  stamp: 0.7,
  panic: 0.6,
  tick: 0.5,
  sword: 0.7,
};

const MUTE_KEY = "only66:muted";

export function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(MUTE_KEY) === "1";
}

export function setMuted(muted: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  if (muted) stopBgm();
  else playBgm();
  window.dispatchEvent(new CustomEvent("only66:mute-changed"));
}

export function play(name: SfxName) {
  if (typeof window === "undefined" || isMuted()) return;
  try {
    const a = new Audio(SFX_SRC[name]);
    a.volume = SFX_VOL[name];
    void a.play().catch(() => {});
  } catch {
    /* noop */
  }
}

let bgm: HTMLAudioElement | null = null;
export function playBgm() {
  if (typeof window === "undefined" || isMuted()) return;
  if (!bgm) {
    bgm = new Audio("/sounds/bgm.mp3");
    bgm.loop = true;
    bgm.volume = 0.18;
  }
  void bgm.play().catch(() => {});
}
export function stopBgm() {
  if (bgm) {
    bgm.pause();
  }
}

// Looping tick used during panic countdown.
let ticker: HTMLAudioElement | null = null;
export function startTick() {
  if (typeof window === "undefined" || isMuted()) return;
  stopTick();
  ticker = new Audio("/sounds/tick.mp3");
  ticker.loop = true;
  ticker.volume = 0.55;
  void ticker.play().catch(() => {});
}
export function stopTick() {
  if (ticker) {
    ticker.pause();
    ticker = null;
  }
}

// Global delegated click sound for any <button>. Call once on app boot.
let clickWired = false;
export function wireGlobalClickSound() {
  if (typeof window === "undefined" || clickWired) return;
  clickWired = true;
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const btn = t.closest("button, [role='button']");
      if (!btn) return;
      // Skip the mute toggle itself
      if ((btn as HTMLElement).dataset.noSfx === "1") return;
      play("click");
    },
    true
  );
}
