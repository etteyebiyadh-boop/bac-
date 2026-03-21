"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });

    startTransition(() => {
      router.push("/");
      router.refresh();
    });
  }

  return (
    <button className="button-ghost nav-button" onClick={handleLogout} disabled={isPending}>
      {isPending ? "Signing out..." : "Logout"}
    </button>
  );
}
