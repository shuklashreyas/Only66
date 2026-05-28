import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getLocalUser } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }

    const user = getLocalUser();
    if (!user) {
      throw redirect({ to: "/login" });
    }

    return { userId: user.id };
  },
  component: () => <Outlet />,
});
