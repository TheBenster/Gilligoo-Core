import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
import { requireAdmin } from "@/lib/auth";

// GET - Fetch all inventory items
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const rarity = searchParams.get("rarity");
    const inStock = searchParams.get("inStock");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit")) || 20;
    const page = parseInt(searchParams.get("page")) || 1;

    let query = {};

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Filter by rarity
    if (rarity && rarity !== "all") {
      query.rarity = rarity;
    }

    // Filter by stock status
    if (inStock === "true") {
      query.inStock = true;
      query.quantity = { $gt: 0 };
    } else if (inStock === "false") {
      query.$or = [
        { inStock: false },
        { quantity: 0 }
      ];
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const inventory = await Inventory.find(query)
      .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await Inventory.countDocuments(query);

    return NextResponse.json({
      inventory,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { message: "Error fetching inventory", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new inventory item
export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await dbConnect();

    const itemData = await request.json();

    // Validate required fields
    const { title, description, picture, shlingobs } = itemData;
    if (!title || !description || !picture || shlingobs === undefined) {
      return NextResponse.json(
        { message: "Missing required fields: title, description, picture, and shlingobs" },
        { status: 400 }
      );
    }

    const item = new Inventory(itemData);
    await item.save();

    return NextResponse.json(
      {
        message: "Inventory item created successfully",
        item,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      { message: "Error creating inventory item", error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update existing inventory item
export async function PUT(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const itemData = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Item ID is required for updates" },
        { status: 400 }
      );
    }

    itemData.updatedAt = new Date();

    const item = await Inventory.findByIdAndUpdate(id, itemData, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Inventory item updated successfully",
      item,
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      { message: "Error updating inventory item", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete inventory item
export async function DELETE(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Item ID is required for deletion" },
        { status: 400 }
      );
    }

    const item = await Inventory.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json(
      { message: "Error deleting inventory item", error: error.message },
      { status: 500 }
    );
  }
}