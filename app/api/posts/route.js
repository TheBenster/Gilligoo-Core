import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { requireAdmin } from "@/lib/auth";

// GET - Fetch all posts
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;

    let query = {};
    if (published === "true") {
      query.isPublished = true;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await Post.countDocuments(query);

    return NextResponse.json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Error fetching posts", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new post
export async function POST(request) {
  // Check if user is admin
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    console.log("Attempting to connect to MongoDB...");
    await dbConnect();
    console.log("MongoDB connected successfully");

    const postData = await request.json();
    console.log("Post data received:", postData);

    // Generate slug manually from title
    const slug =
      postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now().toString().slice(-6);

    // Add slug to post data
    postData.slug = slug;

    // Set publishedAt if publishing
    if (postData.isPublished && !postData.publishedAt) {
      postData.publishedAt = new Date();
    }

    console.log("Creating post with slug:", slug);

    const post = new Post(postData);
    await post.save();
    console.log("Post saved successfully:", post);

    return NextResponse.json(
      {
        message: "Post created successfully",
        post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Error creating post", error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update existing post
export async function PUT(request) {
  // Check if user is admin
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await dbConnect();

    const postData = await request.json();
    const { _id, ...updateData } = postData;

    if (!_id) {
      return NextResponse.json(
        { message: "Post ID is required for updates" },
        { status: 400 }
      );
    }

    // Set publishedAt if publishing for first time
    if (updateData.isPublished) {
      const existingPost = await Post.findById(_id);
      if (!existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    updateData.updatedAt = new Date();

    const post = await Post.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { message: "Error updating post", error: error.message },
      { status: 500 }
    );
  }
}
