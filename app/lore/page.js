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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-emerald-100 mb-4">
            Goblin Lore Archive
          </h1>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            Sacred wisdom, ancient codes, and the secret knowledge passed down
            through generations of closet-dwelling merchants
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                selectedCategory === "all"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-800 bg-opacity-50 text-emerald-200 hover:bg-emerald-700"
              }`}
            >
              All Lore
            </button>
            {loreCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                  selectedCategory === category
                    ? "bg-amber-600 text-white"
                    : "bg-amber-800 bg-opacity-50 text-amber-200 hover:bg-amber-700"
                }`}
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
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
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
            <div className="text-emerald-300 text-lg">Loading ancient wisdom...</div>
          </div>
        ) : lore.length === 0 ? (
          <div className="text-center mt-12">
            <div className="goblin-card p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-amber-300 mb-4">
                No Lore Found
              </h3>
              <p className="text-amber-200">
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
              <div className="text-red-300 text-sm">Sacred Texts</div>
            </div>
            <div className="goblin-card p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">
                {lore.filter((l) => l.importance === "Important").length}
              </div>
              <div className="text-amber-300 text-sm">Important Laws</div>
            </div>
            <div className="goblin-card p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {lore.filter((l) => l.importance === "Useful").length}
              </div>
              <div className="text-emerald-300 text-sm">Useful Knowledge</div>
            </div>
            <div className="goblin-card p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {lore.length > 0 ? Math.round(
                  lore.reduce((sum, l) => sum + l.secretLevel, 0) / lore.length
                ) : 0}
              </div>
              <div className="text-purple-300 text-sm">Avg Secret Level</div>
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
              <span className="text-amber-300 font-bold text-lg">
                {lore.year} {lore.era}
              </span>
              <span className="text-amber-500 text-sm">
                ({lore.era === "OD" ? "OglethorpeDorper" : "A Great Goblin"})
              </span>
            </div>
          )}
          {lore.historyType === "General Lore" && (
            <div className="text-amber-400 text-sm font-medium mb-3">
              General Lore
            </div>
          )}
          <div
            className="text-amber-100 leading-relaxed text-base prose prose-amber prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: md.render(lore.content) }}
          />
        </div>
      );
    }

    if (lore.category === "Merchant Laws") {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-300 font-bold">
              Statute {lore.statuteNumber}
              {lore.section && <span className="text-amber-400">({lore.section})</span>}
            </span>
          </div>
          <div
            className="text-amber-100 leading-relaxed font-serif text-base bg-slate-800 bg-opacity-50 p-4 rounded border-l-4 border-amber-600 prose prose-amber prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: md.render(lore.content) }}
          />
          {lore.penalty && (
            <div className="text-red-300 text-sm bg-red-900 bg-opacity-30 p-3 rounded">
              <span className="font-semibold">Penalty:</span> {lore.penalty}
            </div>
          )}
        </div>
      );
    }

    // Default formatting for other categories
    return (
      <div
        className="text-amber-100 leading-relaxed prose prose-amber prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: md.render(lore.content) }}
      />
    );
  };

  return (
    <div className="lore-card">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-amber-200">
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
            <span className="text-purple-300 text-xs">
              Secret Level: {lore.secretLevel}/10
            </span>
          </div>
        )}
      </div>

      <div className="mb-3">
        <span className="bg-emerald-800 text-emerald-200 px-2 py-1 rounded text-sm">
          {lore.category}
        </span>
      </div>

      {formatContent()}

      {lore.tags && lore.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {lore.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Admin Actions */}
      {isAdmin && (
        <div className="mt-4 pt-3 border-t border-slate-700 flex gap-2">
          <button
            onClick={() => onEdit(lore)}
            className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-emerald-100 px-3 py-2 rounded text-sm font-medium transition-colors"
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
    <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-purple-600">
      <h2 className="text-2xl font-bold text-purple-200 mb-4">
        {isEditing ? "Edit Lore Entry" : "Add New Lore Entry"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-purple-300 text-sm font-medium mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-700 text-purple-100 rounded-lg border border-purple-800 focus:border-purple-600 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-purple-300 text-sm font-medium mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-700 text-purple-100 rounded-lg border border-purple-800 focus:border-purple-600 focus:outline-none"
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
                <label className="block text-purple-300 text-sm font-medium mb-1">
                  Entry Type *
                </label>
                <select
                  name="historyType"
                  value={formData.historyType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 text-purple-100 rounded-lg border border-purple-800 focus:border-purple-600 focus:outline-none"
                >
                  <option value="Event">Historical Event</option>
                  <option value="General Lore">General Lore</option>
                </select>
              </div>

              {formData.historyType === "Event" && (
                <>
                  <div>
                    <label className="block text-purple-300 text-sm font-medium mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-slate-700 text-purple-100 rounded-lg border border-purple-800 focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-300 text-sm font-medium mb-1">
                      Era *
                    </label>
                    <select
                      name="era"
                      value={formData.era}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-slate-700 text-purple-100 rounded-lg border border-purple-800 focus:border-purple-600 focus:outline-none"
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
                <label className="block text-purple-300 text-sm font-medium mb-1">
                  Statute Number *
                </label>
                <input
                  type="text"
                  name="statuteNumber"
                  value={formData.statuteNumber}
                  onChange={handleChange}
                  placeholder="e.g., 42.1"
                  required
                  className="w-full px-3 py-2 bg-slate-700 text-purple-100 rounded-lg border border-purple-800 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-purple-300 text-sm font-medium mb-1">
                  Section (optional)
                </label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="e.g., a, b, c"
                  className="w-full px-3 py-2 bg-slate-700 text-purple-100 rounded-lg border border-purple-800 focus:border-purple-600 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Importance - Hide for Goblin History */}
          {formData.category !== "Goblin History" && (
            <div>
              <label className="block text-purple-300 text-sm font-medium mb-1">
                Importance
              </label>
              <select
                name="importance"
                value={formData.importance}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 text-purple-100 rounded-lg border border-purple-800 focus:border-purple-600 focus:outline-none"
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
              <label className="block text-purple-300 text-sm font-medium mb-1">
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
          <label className="block text-purple-300 text-sm font-medium mb-1">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={formData.category === "Goblin History" ? 6 : 4}
            className="w-full px-3 py-2 bg-slate-700 text-purple-100 rounded-lg border border-purple-800 focus:border-purple-600 focus:outline-none"
          />
        </div>

        {/* Penalty for Merchant Laws */}
        {formData.category === "Merchant Laws" && (
          <div>
            <label className="block text-purple-300 text-sm font-medium mb-1">
              Penalty (optional)
            </label>
            <input
              type="text"
              name="penalty"
              value={formData.penalty}
              onChange={handleChange}
              placeholder="e.g., Loss of trading privileges for 1 moon cycle"
              className="w-full px-3 py-2 bg-slate-700 text-purple-100 rounded-lg border border-purple-800 focus:border-purple-600 focus:outline-none"
            />
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-purple-300 text-sm font-medium mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., stealth, trading, ancient"
            className="w-full px-3 py-2 bg-slate-700 text-purple-100 rounded-lg border border-purple-800 focus:border-purple-600 focus:outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-500 text-purple-100 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isEditing ? "Update Lore Entry" : "Add Lore Entry"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-600 hover:bg-slate-500 text-purple-100 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
