import { useEffect, useState } from "react";
import { isMuted, setMuted, playBgm } from "@/lib/sound";

export function SoundToggle() {
  const [muted, setMutedState] = useState(true);

  useEffect(() => {
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

  return (
    <button
      data-no-sfx="1"
      onClick={toggle}
      title={muted ? "Sound off" : "Sound on"}
      className="rounded-sm border border-border px-3 py-2 text-xs font-mono uppercase tracking-widest hover:bg-surface"
    >
      {muted ? "♪ OFF" : "♪ ON"}
    </button>
  );
}
