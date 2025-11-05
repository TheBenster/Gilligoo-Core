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

  const handleDeletePost = async (postId, postTitle) => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Chronicle deleted successfully!");
        fetchPosts(); // Refresh the list
      } else {
        const data = await response.json();
        alert("Error deleting chronicle: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting chronicle");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-xl" style={{ color: "var(--text-secondary)" }}>
          Loading goblin chronicles...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Goblin Chronicles
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Tales from the depths of closet commerce and goblin wisdom
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center">
            <div className="goblin-card p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                No Chronicles Yet
              </h3>
              <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
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
                </div>

                <h2 className="text-xl font-bold mb-3 transition-colors" style={{ color: "var(--text-primary)" }}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-sm mb-4 line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags?.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded text-xs"
                      style={{ background: "var(--accent-primary)", color: "var(--text-on-accent)" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm" style={{ color: "var(--text-tertiary)" }}>
                  <span>
                    {new Date(
                      post.publishedAt || post.createdAt
                    ).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-semibold"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    Read Chronicle →
                  </Link>
                </div>

                {/* Admin Actions */}
                {session?.user?.isAdmin && (
                  <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: "var(--border-primary)" }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeletePost(post._id, post.title);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                    <Link
                      href={`/write?edit=${post._id}`}
                      className="flex-1 px-3 py-2 rounded text-sm font-medium transition-colors text-center"
                      style={{ background: "var(--accent-primary)", color: "var(--text-on-accent)" }}
                    >
                      Edit
                    </Link>
                  </div>
                )}
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
