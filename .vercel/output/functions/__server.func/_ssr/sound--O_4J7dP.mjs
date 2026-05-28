const SFX_SRC = {
  click: "/sounds/click.mp3",
  stamp: "/sounds/stamp.mp3",
  panic: "/sounds/panic.mp3",
  tick: "/sounds/tick.mp3",
  sword: "/sounds/sword.mp3",
  gameover: "/sounds/gameover.mp3"
};
const SFX_VOL = {
  click: 0.25,
  stamp: 0.7,
  panic: 0.6,
  tick: 0.5,
  sword: 0.7,
  gameover: 0.7
};
const MUTE_KEY = "only66:muted";
function isMuted() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(MUTE_KEY) === "1";
}
function setMuted(muted) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  if (muted) stopBgm();
  else playBgm();
  window.dispatchEvent(new CustomEvent("only66:mute-changed"));
}
function play(name) {
  if (typeof window === "undefined" || isMuted()) return;
  try {
    const a = new Audio(SFX_SRC[name]);
    a.volume = SFX_VOL[name];
    void a.play().catch(() => {
    });
  } catch {
  }
}
let bgm = null;
function playBgm() {
  if (typeof window === "undefined" || isMuted()) return;
  if (!bgm) {
    bgm = new Audio("/sounds/bgm.mp3");
    bgm.loop = true;
    bgm.volume = 0.18;
  }
  void bgm.play().catch(() => {
  });
}
function stopBgm() {
  if (bgm) {
    bgm.pause();
  }
}
let ticker = null;
function startTick() {
  if (typeof window === "undefined" || isMuted()) return;
  stopTick();
  ticker = new Audio("/sounds/tick.mp3");
  ticker.loop = true;
  ticker.volume = 0.55;
  void ticker.play().catch(() => {
  });
}
function stopTick() {
  if (ticker) {
    ticker.pause();
    ticker = null;
  }
}
let clickWired = false;
function wireGlobalClickSound() {
  if (typeof window === "undefined" || clickWired) return;
  clickWired = true;
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target;
      if (!t) return;
      const btn = t.closest("button, [role='button']");
      if (!btn) return;
      if (btn.dataset.noSfx === "1") return;
      play("click");
    },
    true
  );
}
export {
  isMuted,
  play,
  playBgm,
  setMuted,
  startTick,
  stopBgm,
  stopTick,
  wireGlobalClickSound
};
