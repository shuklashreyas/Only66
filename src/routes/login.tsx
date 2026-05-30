import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { getLocalUser, createLocalUser, getActiveChallengeForUser } from "@/lib/storage";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Log in — Only 66" }],
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }

    const user = getLocalUser();
    if (user) {
      const activeChallenge = getActiveChallengeForUser();
      throw redirect({ to: activeChallenge ? "/dashboard" : "/onboarding" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const name = displayName.trim();
      if (!name) {
        toast.error("Please enter a name");
        setLoading(false);
        return;
      }

      // Create local user
      createLocalUser(name);
      toast.success(`Welcome, ${name}!`);
      await navigate({ to: "/onboarding", replace: true });
      setLoading(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl">
            <span className="text-primary">ONLY</span> 66
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
            [ ENLIST ]
          </div>
          <h1 className="font-display text-4xl uppercase mb-8">Join the streak</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                Display name
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-sm border border-border bg-surface px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary"
                maxLength={50}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-sm bg-primary py-3 font-display uppercase tracking-wider text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "..." : "Enlist"}
            </button>
          </form>

          <p className="mt-6 text-xs font-mono text-muted-foreground">
            This MVP stores everything locally. No account needed.
          </p>
        </div>
      </div>
    </div>
  );
}
