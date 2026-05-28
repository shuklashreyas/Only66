import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Log in — Only 66" }],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/dashboard" });
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect on auth via root listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/dashboard", replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/dashboard" },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
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
            [ ENLIST / RE-ENTRY ]
          </div>
          <h1 className="font-display text-4xl uppercase mb-8">
            {mode === "signup" ? "Create profile" : "Re-enter"}
          </h1>

          <button
            onClick={handleGoogle}
            className="w-full rounded-sm border border-border bg-surface py-3 font-display uppercase tracking-wider hover:bg-surface-2 text-sm"
          >
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs font-mono text-muted-foreground uppercase">
            <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-border bg-surface px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-border bg-surface px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-sm bg-primary py-3 font-display uppercase tracking-wider text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "..." : mode === "signup" ? "Enlist" : "Re-enter"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="mt-6 text-xs font-mono text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            {mode === "signup" ? "Have an account? Log in" : "No account? Enlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
