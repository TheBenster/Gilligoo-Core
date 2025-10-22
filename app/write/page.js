"use client";

import BlogEditor from "@/components/BlogEditor";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WritePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect non-admin users to home page
    if (status === "loading") return; // Wait for session to load

    if (!session?.user?.isAdmin) {
      router.push("/");
    }
  }, [session, status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-800 py-8 flex items-center justify-center">
        <div className="text-emerald-300 text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render editor if not admin
  if (!session?.user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-800 py-8">
      <div className="container mx-auto px-4">
        <BlogEditor />
      </div>
    </div>
  );
}
