import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    picture: {
      type: String,
      required: true,
    },
    imagePosition: {
      type: String,
      default: "center",
    },
    shlingobs: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "Weapons",
        "Armor",
        "Potions",
        "Trinkets",
        "Stolen Goods",
        "Magical Items",
        "Human Relics",
        "Other"
      ],
      default: "Other",
    },
    rarity: {
      type: String,
      enum: ["Common", "Uncommon", "Rare", "Epic", "Legendary"],
      default: "Common",
    },
    condition: {
      type: String,
      enum: ["Pristine", "Good", "Fair", "Poor", "Broken"],
      default: "Good",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0,
    },
    merchantNotes: {
      type: String,
      default: "",
    },
    acquiredFrom: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
InventorySchema.index({
  title: "text",
  description: "text",
  merchantNotes: "text"
});

export default mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema);