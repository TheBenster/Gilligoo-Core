"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentLore, setRecentLore] = useState([]);

  useEffect(() => {
    // fetch recent posts
    fetch("/api/posts?published=true&limit=3")
      .then((res) => res.json())
      .then((data) => setRecentPosts(data.posts || []))
      .catch((err) => console.error("Error fetching posts:", err));

    // fetch recent lore
    fetch("/api/lore?limit=3")
      .then((res) => res.json())
      .then((data) => setRecentLore(data.lore || []))
      .catch((err) => console.error("Error fetching lore:", err));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="container px-4 py-16 mx-auto">
        {/* hero section */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h1
            className="mb-6 text-5xl font-bold md:text-6xl"
            style={{ color: "var(--text-primary)" }}
          >
            the closet goblin chronicles
          </h1>
          <p
            className="mb-8 text-lg leading-relaxed md:text-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            tales from a goblin merchant dwelling in the shadows of human
            closets. documenting the sacred arts of merchantry, ancient codes,
            and the delicate dance of staying hidden.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/blog" className="btn-primary">
              read chronicles
            </Link>
            <Link href="/lore" className="btn-primary">
              explore lore
            </Link>
            <Link href="/inventory" className="btn-primary">
              view inventory
            </Link>
          </div>
        </div>

        {/* featured content */}
        <div className="grid max-w-6xl gap-8 mx-auto md:grid-cols-2">
          {/* latest chronicles */}
          <div className="card gradient-border">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                latest chronicles
              </h2>
              <Link
                href="/blog"
                className="text-sm font-medium hover:underline"
                style={{ color: "var(--accent-primary)" }}
              >
                view all →
              </Link>
            </div>
            <div className="space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <div className="flex gap-3">
                      <div className="accent-line"></div>
                      <div className="flex-1">
                        <h4
                          className="mb-1 font-semibold group-hover:underline"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {post.title}
                        </h4>
                        <p
                          className="text-sm line-clamp-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {post.excerpt}
                        </p>
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {new Date(
                            post.publishedAt || post.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p style={{ color: "var(--text-secondary)" }}>
                  no chronicles yet. check back soon!
                </p>
              )}
            </div>
          </div>

          {/* sacred wisdom */}
          <div className="card gradient-border">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                sacred wisdom
              </h2>
              <Link
                href="/lore"
                className="text-sm font-medium hover:underline"
                style={{ color: "var(--accent-primary)" }}
              >
                view all →
              </Link>
            </div>
            <div className="space-y-4">
              {recentLore.length > 0 ? (
                recentLore.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="accent-line"></div>
                    <div className="flex-1">
                      <h4
                        className="mb-1 font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </h4>
                      <p
                        className="text-sm line-clamp-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.content.substring(0, 100)}...
                      </p>
                      <p
                        className="mt-1 text-xs"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {item.category}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "var(--text-secondary)" }}>
                  no lore entries yet. ancient wisdom coming soon!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* about section */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="card">
            <h2
              className="mb-4 text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              about this goblin
            </h2>
            <p
              className="leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              a closet merchant on the outskirts of oblivion, an appreciator of
              the archived. as it stands for all of us, we are searching for
              something, a grasp into that which we don't understand in hopes
              that it will come to pass we will, one day. i can not speak for
              you, seldom do i speak for myself. but in passing wisdom will
              emerge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
