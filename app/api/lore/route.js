import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lore from "@/models/Lore";
import { requireAdmin } from "@/lib/auth";

// GET - Fetch all lore entries
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const importance = searchParams.get("importance");
    const secretLevel = searchParams.get("secretLevel");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit")) || 20;
    const page = parseInt(searchParams.get("page")) || 1;

    let query = { isActive: true };

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Filter by importance
    if (importance && importance !== "all") {
      query.importance = importance;
    }

    // Filter by secret level
    if (secretLevel) {
      query.secretLevel = { $lte: parseInt(secretLevel) };
    }

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    const lore = await Lore.find(query)
      .sort({ importance: -1, createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("relatedPosts", "title slug")
      .lean();

    const total = await Lore.countDocuments(query);

    return NextResponse.json({
      lore,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching lore:", error);
    return NextResponse.json(
      { message: "Error fetching lore", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new lore entry
export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await dbConnect();

    const loreData = await request.json();

    // Validate required fields
    const { title, category, content } = loreData;
    if (!title || !category || !content) {
      return NextResponse.json(
        { message: "Missing required fields: title, category, and content" },
        { status: 400 }
      );
    }

    const lore = new Lore(loreData);
    await lore.save();

    return NextResponse.json(
      {
        message: "Lore entry created successfully",
        lore,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lore:", error);
    return NextResponse.json(
      { message: "Error creating lore", error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update existing lore entry
export async function PUT(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const loreData = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Lore ID is required for updates" },
        { status: 400 }
      );
    }

    loreData.updatedAt = new Date();

    const lore = await Lore.findByIdAndUpdate(id, loreData, {
      new: true,
      runValidators: true,
    });

    if (!lore) {
      return NextResponse.json({ message: "Lore entry not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Lore entry updated successfully",
      lore,
    });
  } catch (error) {
    console.error("Error updating lore:", error);
    return NextResponse.json(
      { message: "Error updating lore", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete lore entry
export async function DELETE(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Lore ID is required for deletion" },
        { status: 400 }
      );
    }

    const lore = await Lore.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!lore) {
      return NextResponse.json({ message: "Lore entry not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Lore entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lore:", error);
    return NextResponse.json(
      { message: "Error deleting lore", error: error.message },
      { status: 500 }
    );
  }
}