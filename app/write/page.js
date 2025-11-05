"use client";

import BlogEditor from "@/components/BlogEditor";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WritePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const editId = searchParams.get("edit");

  useEffect(() => {
    // Redirect non-admin users to home page
    if (status === "loading") return; // Wait for session to load

    if (!session?.user?.isAdmin) {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    // Fetch post if editing
    if (editId && session?.user?.isAdmin) {
      setLoadingPost(true);
      fetch(`/api/posts`)
        .then((res) => res.json())
        .then((data) => {
          const postToEdit = data.posts.find((p) => p._id === editId);
          if (postToEdit) {
            setPost(postToEdit);
          }
        })
        .catch((error) => {
          console.error("Error fetching post:", error);
          alert("Error loading post for editing");
        })
        .finally(() => {
          setLoadingPost(false);
        });
    }
  }, [editId, session]);

  // Show loading state while checking authentication or loading post
  if (status === "loading" || loadingPost) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-xl" style={{ color: "var(--text-secondary)" }}>
          {loadingPost ? "Loading chronicle..." : "Loading..."}
        </div>
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
        <BlogEditor initialPost={post} />
      </div>
    </div>
  );
}
