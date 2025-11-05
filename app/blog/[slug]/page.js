import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

// Generate static params for published posts
export async function generateStaticParams() {
  try {
    const connection = await dbConnect();
    if (!connection) {
      // During build time, return empty array
      return [];
    }

    const posts = await Post.find({ isPublished: true }).select("slug").lean();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.log("Could not generate static params, returning empty array:", error.message);
    return [];
  }
}

// Get post data
async function getPost(slug) {
  try {
    const connection = await dbConnect();
    if (!connection) {
      // During build time, return null
      return null;
    }

    const post = await Post.findOne({ slug, isPublished: true }).lean();

    if (!post) {
      return null;
    }

    // Convert ObjectId to string for serialization
    return {
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      publishedAt: post.publishedAt?.toISOString() || null,
    };
  } catch (error) {
    console.log("Could not fetch post during build:", error.message);
    return null;
  }
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="goblin-card p-8 text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Chronicle Not Found
          </h1>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            This goblin tale seems to have vanished into the shadows...
          </p>
          <Link href="/blog" className="goblin-button">
            Return to Chronicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Back to blog link */}
        <Link
          href="/blog"
          className="inline-flex items-center mb-8 transition-colors"
          style={{ color: "var(--accent-primary)" }}
        >
          ← Back to Chronicles
        </Link>

        {/* Cover image */}
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-8 shadow-2xl"
          />
        )}

        {/* Post header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-amber-400 text-xl">
              {"★".repeat(post.goblinRating)}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: "var(--text-primary)" }}>
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span>
              Published{" "}
              {new Date(
                post.publishedAt || post.createdAt
              ).toLocaleDateString()}
            </span>
            {post.updatedAt !== post.createdAt && (
              <span>
                Updated {new Date(post.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ background: "var(--accent-primary)", color: "var(--text-on-accent)" }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post content */}
        <div className="rounded-lg p-8 border" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}>
          <div
            className="prose prose-emerald prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              color: "var(--text-primary)",
              lineHeight: "1.7",
            }}
          />
        </div>

        {/* Post footer */}
        <footer className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border-primary)" }}>
          <div className="flex justify-between items-center">
            <div style={{ color: "var(--text-secondary)" }}>
              <p className="text-sm mb-1">Chronicle Classification:</p>
              <div className="flex items-center gap-3">
                <span className="text-amber-400">
                  Goblin Rating: {"★".repeat(post.goblinRating)}
                </span>
              </div>
            </div>

            <Link href="/blog" className="goblin-button">
              More Chronicles
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
