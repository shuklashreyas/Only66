import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/win")({
  head: () => ({ meta: [{ title: "Day 66 — You won. Only 66" }] }),
  component: WinPage,
});

function WinPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("the habit");

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data } = await supabase
        .from("challenges")
        .select("name, status")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setName(data.name);
    })();
  }, []);

  const handleNew = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    await supabase
      .from("challenges")
      .update({ status: "won" })
      .eq("user_id", userData.user.id)
      .eq("status", "active");
    navigate({ to: "/onboarding" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-4 font-display text-2xl">
          <span className="text-primary">ONLY</span> 66
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-xl text-center animate-survived-pop">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-reward)] mb-4">
            [ DAY 66 / 66 — SURVIVED ]
          </div>
          <h1 className="font-display text-7xl uppercase">You won.</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            66 days of <span className="text-foreground font-semibold">{name}</span>. The habit is yours.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleNew}
              className="rounded-sm bg-primary px-6 py-3 font-display uppercase tracking-wider text-primary-foreground"
            >
              Start another 66
            </button>
            <Link
              to="/"
              className="rounded-sm border border-border px-6 py-3 font-display uppercase tracking-wider"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
