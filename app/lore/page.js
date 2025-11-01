"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MarkdownIt from "markdown-it";

export default function LorePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lore, setLore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLore, setEditingLore] = useState(null);
  const { data: session } = useSession();

  const loreCategories = [
    "Goblin Code",
    "Merchant Laws",
    "Human Interference Protocols",
    "Ancient Traditions",
    "Closet Geography",
    "Trade Secrets",
    "Goblin History",
    "Magic & Enchantments",
  ];

  useEffect(() => {
    fetchLore();
  }, [selectedCategory]);

  const fetchLore = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      const response = await fetch(`/api/lore?${params}`);
      const data = await response.json();

      if (response.ok) {
        setLore(data.lore);
      } else {
        console.error("Error fetching lore:", data.message);
      }
    } catch (error) {
      console.error("Error fetching lore:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLore = async (loreData) => {
    try {
      const response = await fetch("/api/lore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loreData),
      });

      const data = await response.json();

      if (response.ok) {
        setLore([data.lore, ...lore]);
        setShowAddForm(false);
      } else {
        alert("Error adding lore: " + data.message);
      }
    } catch (error) {
      console.error("Error adding lore:", error);
      alert("Error adding lore");
    }
  };

  const handleEditLore = (loreEntry) => {
    setEditingLore(loreEntry);
    setShowAddForm(false);
  };

  const handleUpdateLore = async (loreData) => {
    try {
      const response = await fetch(`/api/lore?id=${editingLore._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loreData),
      });

      const data = await response.json();

      if (response.ok) {
        setLore(lore.map(item =>
          item._id === editingLore._id ? data.lore : item
        ));
        setEditingLore(null);
      } else {
        alert("Error updating lore: " + data.message);
      }
    } catch (error) {
      console.error("Error updating lore:", error);
      alert("Error updating lore");
    }
  };

  const handleDeleteLore = async (id) => {
    if (!confirm("Are you sure you want to delete this lore entry?")) return;

    try {
      const response = await fetch(`/api/lore?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setLore(lore.filter(item => item._id !== id));
      } else {
        const data = await response.json();
        alert("Error deleting lore: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting lore:", error);
      alert("Error deleting lore");
    }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case "Sacred":
        return "text-red-400 bg-red-900";
      case "Important":
        return "text-amber-400 bg-amber-900";
      case "Useful":
        return "text-emerald-400 bg-emerald-900";
      default:
        return "text-gray-400 bg-gray-800";
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Goblin Lore Archive
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Sacred wisdom, ancient codes, and the secret knowledge passed down
            through generations of closet-dwelling merchants
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
              style={{
                background: selectedCategory === "all" ? "var(--accent-primary)" : "var(--bg-secondary)",
                color: selectedCategory === "all" ? "var(--text-on-accent)" : "var(--text-secondary)"
              }}
            >
              All Lore
            </button>
            {loreCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                style={{
                  background: selectedCategory === category ? "var(--accent-secondary)" : "var(--bg-secondary)",
                  color: selectedCategory === category ? "var(--text-on-accent)" : "var(--text-secondary)"
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Add Lore Button - Only show for admin */}
        {session?.user?.isAdmin && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
              style={{ background: "var(--accent-primary)", color: "var(--text-on-accent)" }}
            >
              Add New Lore
            </button>
          </div>
        )}

        {/* Add/Edit Lore Form */}
        {(showAddForm || editingLore) && (
          <AddLoreForm
            onSubmit={editingLore ? handleUpdateLore : handleAddLore}
            onCancel={() => {
              setShowAddForm(false);
              setEditingLore(null);
            }}
            initialData={editingLore}
            isEditing={!!editingLore}
          />
        )}

        {/* Lore Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg" style={{ color: "var(--text-secondary)" }}>Loading ancient wisdom...</div>
          </div>
        ) : lore.length === 0 ? (
          <div className="text-center mt-12">
            <div className="goblin-card p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                No Lore Found
              </h3>
              <p style={{ color: "var(--text-secondary)" }}>
                This category of ancient wisdom has yet to be documented...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {lore.map((item) => (
              <LoreCard
                key={item._id}
                lore={item}
                getImportanceColor={getImportanceColor}
                isAdmin={session?.user?.isAdmin}
                onEdit={handleEditLore}
                onDelete={handleDeleteLore}
              />
            ))}
          </div>
        )}

        {/* Lore Stats */}
        {lore.length > 0 && (
          <div className="grid md:grid-cols-4 gap-4 mt-16">
            <div className="goblin-card p-4 text-center">
              <div className="text-2xl font-bold text-red-400">
                {lore.filter((l) => l.importance === "Sacred").length}
              </div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Sacred Texts</div>
            </div>
            <div className="goblin-card p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">
                {lore.filter((l) => l.importance === "Important").length}
              </div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Important Laws</div>
            </div>
            <div className="goblin-card p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: "var(--accent-primary)" }}>
                {lore.filter((l) => l.importance === "Useful").length}
              </div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Useful Knowledge</div>
            </div>
            <div className="goblin-card p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {lore.length > 0 ? Math.round(
                  lore.reduce((sum, l) => sum + l.secretLevel, 0) / lore.length
                ) : 0}
              </div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Avg Secret Level</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoreCard({ lore, getImportanceColor, isAdmin, onEdit, onDelete }) {
  // Initialize markdown parser
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  });

  // Format display based on category
  const formatContent = () => {
    if (lore.category === "Goblin History") {
      return (
        <div className="space-y-3">
          {lore.historyType === "Event" && lore.year && lore.era && (
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-lg" style={{ color: "var(--accent-secondary)" }}>
                {lore.year} {lore.era}
              </span>
              <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                ({lore.era === "OD" ? "OglethorpeDorper" : "A Great Goblin"})
              </span>
            </div>
          )}
          {lore.historyType === "General Lore" && (
            <div className="text-sm font-medium mb-3" style={{ color: "var(--accent-secondary)" }}>
              General Lore
            </div>
          )}
          <div
            className="leading-relaxed text-base prose prose-invert max-w-none"
            style={{ color: "var(--text-primary)" }}
            dangerouslySetInnerHTML={{ __html: md.render(lore.content) }}
          />
        </div>
      );
    }

    if (lore.category === "Merchant Laws") {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold" style={{ color: "var(--accent-secondary)" }}>
              Statute {lore.statuteNumber}
              {lore.section && <span style={{ color: "var(--text-secondary)" }}>({lore.section})</span>}
            </span>
          </div>
          <div
            className="leading-relaxed font-serif text-base p-4 rounded border-l-4 prose prose-invert max-w-none"
            style={{
              color: "var(--text-primary)",
              background: "var(--bg-tertiary)",
              borderColor: "var(--accent-secondary)"
            }}
            dangerouslySetInnerHTML={{ __html: md.render(lore.content) }}
          />
          {lore.penalty && (
            <div className="text-sm p-3 rounded" style={{ color: "var(--text-primary)", background: "var(--bg-tertiary)" }}>
              <span className="font-semibold">Penalty:</span> {lore.penalty}
            </div>
          )}
        </div>
      );
    }

    // Default formatting for other categories
    return (
      <div
        className="leading-relaxed prose prose-invert max-w-none"
        style={{ color: "var(--text-primary)" }}
        dangerouslySetInnerHTML={{ __html: md.render(lore.content) }}
      />
    );
  };

  return (
    <div className="lore-card">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          {lore.title}
        </h3>
        {lore.category !== "Goblin History" && (
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${getImportanceColor(
                lore.importance
              )}`}
            >
              {lore.importance}
            </span>
            <span className="text-xs text-purple-300">
              Secret Level: {lore.secretLevel}/10
            </span>
          </div>
        )}
      </div>

      <div className="mb-3">
        <span className="px-2 py-1 rounded text-sm" style={{ background: "var(--accent-primary)", color: "var(--text-on-accent)" }}>
          {lore.category}
        </span>
      </div>

      {formatContent()}

      {lore.tags && lore.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {lore.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded text-xs"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Admin Actions */}
      {isAdmin && (
        <div className="mt-4 pt-3 border-t flex gap-2" style={{ borderColor: "var(--border-primary)" }}>
          <button
            onClick={() => onEdit(lore)}
            className="flex-1 px-3 py-2 rounded text-sm font-medium transition-colors"
            style={{ background: "var(--accent-primary)", color: "var(--text-on-accent)" }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(lore._id)}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function AddLoreForm({ onSubmit, onCancel, initialData, isEditing }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "Goblin Code",
    content: initialData?.content || "",
    importance: initialData?.importance || "Useful",
    secretLevel: initialData?.secretLevel || 1,
    tags: initialData?.tags?.join(", ") || "",
    // Goblin History fields
    historyType: initialData?.historyType || "Event",
    year: initialData?.year || "",
    era: initialData?.era || "OD",
    // Merchant Laws fields
    statuteNumber: initialData?.statuteNumber || "",
    section: initialData?.section || "",
    penalty: initialData?.penalty || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.content) {
      alert("Please fill in title and content");
      return;
    }

    // Category-specific validation
    if (formData.category === "Goblin History" && formData.historyType === "Event" && !formData.year) {
      alert("Please provide a year for Goblin History events");
      return;
    }

    if (formData.category === "Merchant Laws" && !formData.statuteNumber) {
      alert("Please provide a statute number for Merchant Laws");
      return;
    }

    // Process form data
    const submitData = {
      ...formData,
      year: formData.year ? parseInt(formData.year) : undefined,
      secretLevel: parseInt(formData.secretLevel),
      tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag) : [],
    };

    // Remove empty fields
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === "" || submitData[key] === undefined) {
        delete submitData[key];
      }
    });

    onSubmit(submitData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="rounded-lg p-6 mb-8 border" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
        {isEditing ? "Edit Lore Entry" : "Add New Lore Entry"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border focus:outline-none"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
            >
              <option value="Goblin Code">Goblin Code</option>
              <option value="Merchant Laws">Merchant Laws</option>
              <option value="Human Interference Protocols">Human Interference Protocols</option>
              <option value="Ancient Traditions">Ancient Traditions</option>
              <option value="Closet Geography">Closet Geography</option>
              <option value="Trade Secrets">Trade Secrets</option>
              <option value="Goblin History">Goblin History</option>
              <option value="Magic & Enchantments">Magic & Enchantments</option>
            </select>
          </div>

          {/* Goblin History Fields */}
          {formData.category === "Goblin History" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Entry Type *
                </label>
                <select
                  name="historyType"
                  value={formData.historyType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none" style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                >
                  <option value="Event">Historical Event</option>
                  <option value="General Lore">General Lore</option>
                </select>
              </div>

              {formData.historyType === "Event" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                      Year *
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none" style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                      Era *
                    </label>
                    <select
                      name="era"
                      value={formData.era}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none" style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                    >
                      <option value="OD">OD (OglethorpeDorper)</option>
                      <option value="AGG">AGG (A Great Goblin)</option>
                    </select>
                  </div>
                </>
              )}
            </>
          )}

          {/* Merchant Laws Fields */}
          {formData.category === "Merchant Laws" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Statute Number *
                </label>
                <input
                  type="text"
                  name="statuteNumber"
                  value={formData.statuteNumber}
                  onChange={handleChange}
                  placeholder="e.g., 42.1"
                  required
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none" style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Section (optional)
                </label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="e.g., a, b, c"
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none" style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                />
              </div>
            </>
          )}

          {/* Importance - Hide for Goblin History */}
          {formData.category !== "Goblin History" && (
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                Importance
              </label>
              <select
                name="importance"
                value={formData.importance}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none" style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
              >
                <option value="Trivia">Trivia</option>
                <option value="Useful">Useful</option>
                <option value="Important">Important</option>
                <option value="Sacred">Sacred</option>
              </select>
            </div>
          )}

          {/* Secret Level - Hide for Goblin History */}
          {formData.category !== "Goblin History" && (
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                Secret Level (1-10)
              </label>
              <input
                type="range"
                name="secretLevel"
                value={formData.secretLevel}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full"
              />
              <div className="text-purple-400 text-sm text-center mt-1">
                {formData.secretLevel}/10
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={formData.category === "Goblin History" ? 6 : 4}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none" style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
          />
        </div>

        {/* Penalty for Merchant Laws */}
        {formData.category === "Merchant Laws" && (
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Penalty (optional)
            </label>
            <input
              type="text"
              name="penalty"
              value={formData.penalty}
              onChange={handleChange}
              placeholder="e.g., Loss of trading privileges for 1 moon cycle"
              className="w-full px-3 py-2 rounded-lg border focus:outline-none" style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
            />
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., stealth, trading, ancient"
            className="w-full px-3 py-2 rounded-lg border focus:outline-none" style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 rounded-lg font-medium transition-colors"
            style={{ background: "var(--accent-primary)", color: "var(--text-on-accent)" }}
          >
            {isEditing ? "Update Lore Entry" : "Add Lore Entry"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg font-medium transition-colors"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
