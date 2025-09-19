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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-800 flex items-center justify-center">
        <div className="goblin-card p-8 text-center max-w-md">
          <h1 className="text-3xl font-bold text-emerald-300 mb-4">
            Chronicle Not Found
          </h1>
          <p className="text-emerald-200 mb-6">
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-800">
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Back to blog link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-emerald-300 hover:text-emerald-100 mb-8"
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
            <span className="bg-purple-600 text-purple-100 px-3 py-1 rounded-full text-sm font-semibold">
              {post.merchantLevel}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-emerald-100 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-emerald-300 text-sm">
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
                  className="bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post content */}
        <div className="bg-black bg-opacity-20 backdrop-blur-sm rounded-lg p-8 border border-emerald-500">
          <div
            className="prose prose-emerald prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              color: "#d1fae5",
              lineHeight: "1.7",
            }}
          />
        </div>

        {/* Post footer */}
        <footer className="mt-12 pt-8 border-t border-emerald-800">
          <div className="flex justify-between items-center">
            <div className="text-emerald-300">
              <p className="text-sm mb-1">Chronicle Classification:</p>
              <div className="flex items-center gap-3">
                <span className="text-amber-400">
                  Goblin Rating: {"★".repeat(post.goblinRating)}
                </span>
                <span className="text-purple-300">
                  Level: {post.merchantLevel}
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
