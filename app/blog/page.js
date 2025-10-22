"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts?published=true");
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-800 flex items-center justify-center">
        <div className="text-emerald-300 text-xl">
          Loading goblin chronicles...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-emerald-100 mb-4">
            Goblin Chronicles
          </h1>
          <p className="text-xl text-emerald-200 max-w-2xl mx-auto">
            Tales from the depths of closet commerce and goblin wisdom
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center">
            <div className="goblin-card p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-emerald-300 mb-4">
                No Chronicles Yet
              </h3>
              <p className="text-emerald-200 mb-6">
                The goblin archives are empty. Time to document some adventures!
              </p>
              {session?.user?.isAdmin && (
                <Link href="/write" className="goblin-button inline-block">
                  Write First Chronicle
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post._id}
                className="goblin-card p-6 hover:scale-105 transition-transform duration-200"
              >
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-400 font-semibold">
                    {"★".repeat(post.goblinRating)}
                  </span>
                  <span className="text-purple-300 text-sm">
                    {post.merchantLevel}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-emerald-200 mb-3 hover:text-emerald-100 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-emerald-300 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags?.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-emerald-800 text-emerald-200 px-2 py-1 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm text-emerald-400">
                  <span>
                    {new Date(
                      post.publishedAt || post.createdAt
                    ).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-emerald-300 hover:text-emerald-100 font-semibold"
                  >
                    Read Chronicle →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {session?.user?.isAdmin && (
          <div className="text-center mt-12">
            <Link href="/write" className="goblin-button">
              Write New Chronicle
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
