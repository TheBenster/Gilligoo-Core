import mongoose from "mongoose";

const LoreSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Goblin Code",
        "Merchant Laws",
        "Human Interference Protocols",
        "Ancient Traditions",
        "Closet Geography",
        "Trade Secrets",
        "Goblin History",
        "Magic & Enchantments",
      ],
    },
    content: {
      type: String,
      required: true,
    },
    // Fields specific to Goblin History
    historyType: {
      type: String,
      enum: ["Event", "General Lore"],
      required: function() { return this.category === "Goblin History"; }
    },
    year: {
      type: Number,
      required: function() { return this.category === "Goblin History" && this.historyType === "Event"; }
    },
    era: {
      type: String,
      enum: ["OD", "AGG"], // OglethorpeDorper, A Great Goblin
      required: function() { return this.category === "Goblin History" && this.historyType === "Event"; }
    },
    // Fields specific to Merchant Laws (statute formatting)
    statuteNumber: {
      type: String,
      required: function() { return this.category === "Merchant Laws"; }
    },
    section: {
      type: String, // For subsections like "a", "b", "c"
      default: ""
    },
    penalty: {
      type: String, // Penalty for violating the law
      default: ""
    },
    importance: {
      type: String,
      enum: ["Sacred", "Important", "Useful", "Trivia"],
      default: "Useful",
    },
    secretLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 1,
      description: "1 = Public knowledge, 10 = Top secret",
    },
    relatedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
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

export default mongoose.models.Lore || mongoose.model("Lore", LoreSchema);
