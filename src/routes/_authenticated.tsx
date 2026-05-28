import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getLocalUser, getActiveChallengeForUser } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const user = getLocalUser();
    if (!user) {
      throw redirect({ to: "/login" });
    }
    
    // Check if user has an active challenge
    const activeChallenge = getActiveChallengeForUser();
    if (!activeChallenge) {
      throw redirect({ to: "/onboarding" });
    }
    
    return { userId: user.id };
  },
  component: () => <Outlet />,
});
