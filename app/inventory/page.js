"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import InventoryModal from "@/components/InventoryModal";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const [filters, setFilters] = useState({
    category: "all",
    rarity: "all",
    inStock: "all",
    search: "",
  });

  const categories = [
    "all",
    "Weapons",
    "Armor",
    "Potions",
    "Trinkets",
    "Stolen Goods",
    "Magical Items",
    "Human Relics",
    "Other"
  ];

  const rarities = ["all", "Common", "Uncommon", "Rare", "Epic", "Legendary"];

  useEffect(() => {
    fetchInventory();
  }, [filters]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value);
        }
      });

      const response = await fetch(`/api/inventory?${params}`);
      const data = await response.json();

      if (response.ok) {
        setInventory(data.inventory);
      } else {
        console.error("Error fetching inventory:", data.message);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      const data = await response.json();

      if (response.ok) {
        setInventory([data.item, ...inventory]);
        setShowAddForm(false);
      } else {
        alert("Error adding item: " + data.message);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/inventory?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInventory(inventory.filter(item => item._id !== id));
      } else {
        const data = await response.json();
        alert("Error deleting item: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item");
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowAddForm(false);
  };

  const handleUpdateItem = async (itemData) => {
    try {
      const response = await fetch(`/api/inventory?id=${editingItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      const data = await response.json();

      if (response.ok) {
        setInventory(inventory.map(item =>
          item._id === editingItem._id ? data.item : item
        ));
        setEditingItem(null);
      } else {
        alert("Error updating item: " + data.message);
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item");
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      Common: "text-gray-400",
      Uncommon: "text-green-400",
      Rare: "text-blue-400",
      Epic: "text-purple-400",
      Legendary: "text-yellow-400",
    };
    return colors[rarity] || "text-gray-400";
  };

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--bg-primary)" }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Goblin Inventory
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage your precious collection of acquired goods
          </p>
        </div>

        {/* Controls */}
        <div className="rounded-lg p-6 mb-8" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}>
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search inventory..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2 rounded-lg border focus:outline-none"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>

            {/* Rarity Filter */}
            <select
              value={filters.rarity}
              onChange={(e) => setFilters({ ...filters, rarity: e.target.value })}
              className="px-4 py-2 rounded-lg border focus:outline-none"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
            >
              {rarities.map(rarity => (
                <option key={rarity} value={rarity}>
                  {rarity === "all" ? "All Rarities" : rarity}
                </option>
              ))}
            </select>

            {/* Stock Filter */}
            <select
              value={filters.inStock}
              onChange={(e) => setFilters({ ...filters, inStock: e.target.value })}
              className="px-4 py-2 rounded-lg border focus:outline-none"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
            >
              <option value="all">All Items</option>
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>

          {/* Add Item Button - Only show for admin */}
          {session?.user?.isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{ background: "var(--accent-primary)", color: "var(--text-on-accent)" }}
            >
              ➕ Add New Item
            </button>
          )}
        </div>

        {/* Add/Edit Item Form */}
        {(showAddForm || editingItem) && (
          <AddItemForm
            onSubmit={editingItem ? handleUpdateItem : handleAddItem}
            onCancel={() => {
              setShowAddForm(false);
              setEditingItem(null);
            }}
            initialData={editingItem}
            isEditing={!!editingItem}
          />
        )}

        {/* Inventory Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg" style={{ color: "var(--text-secondary)" }}>Loading inventory...</div>
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-lg mb-4" style={{ color: "var(--text-primary)" }}>No items found</div>
            <p style={{ color: "var(--text-secondary)" }}>
              {Object.values(filters).some(f => f && f !== "all")
                ? "Try adjusting your filters"
                : "Start by adding your first item!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inventory.map((item) => (
              <InventoryCard
                key={item._id}
                item={item}
                onDelete={handleDeleteItem}
                onEdit={handleEditItem}
                onView={(item) => {
                  setSelectedItem(item);
                  setShowModal(true);
                }}
                getRarityColor={getRarityColor}
                isAdmin={session?.user?.isAdmin}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <InventoryModal
          item={selectedItem}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          isAdmin={session?.user?.isAdmin}
        />
      </div>
    </div>
  );
}

function InventoryCard({ item, onDelete, onEdit, onView, getRarityColor, isAdmin }) {
  return (
    <div className="rounded-lg overflow-hidden border transition-colors cursor-pointer group" onClick={() => onView(item)} style={{ background: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}>
      {/* Item Image */}
      <div className="aspect-square relative" style={{ background: "var(--bg-tertiary)" }}>
        <img
          src={item.picture}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%236B7280' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${getRarityColor(item.rarity)} bg-slate-900 bg-opacity-80`}>
            {item.rarity}
          </span>
          {!item.inStock || item.quantity === 0 ? (
            <span className="px-2 py-1 rounded text-xs font-semibold text-red-400 bg-slate-900 bg-opacity-80">
              Out of Stock
            </span>
          ) : null}
        </div>
      </div>

      {/* Item Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1 transition-colors" style={{ color: "var(--text-primary)" }}>
          {item.title}
        </h3>

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.category}</span>
          <span className="font-bold" style={{ color: "var(--accent-secondary)" }}>
            {item.shlingobs} SL
          </span>
        </div>

        <p className="text-sm mb-3 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
          {item.description}
        </p>

        <div className="text-xs mb-3 opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-tertiary)" }}>
          Click to view details
        </div>

        <div className="flex items-center justify-between text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>
          <span>Qty: {item.quantity}</span>
          <span>{item.condition}</span>
        </div>

        {/* Quick Actions - Only show for admin */}
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item._id);
              }}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              Delete
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="flex-1 px-3 py-2 rounded text-sm font-medium transition-colors"
              style={{ background: "var(--accent-primary)", color: "var(--text-on-accent)" }}>
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AddItemForm({ onSubmit, onCancel, initialData, isEditing }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    picture: initialData?.picture || "",
    shlingobs: initialData?.shlingobs || "",
    category: initialData?.category || "Other",
    rarity: initialData?.rarity || "Common",
    condition: initialData?.condition || "Good",
    quantity: initialData?.quantity || 1,
    merchantNotes: initialData?.merchantNotes || "",
    acquiredFrom: initialData?.acquiredFrom || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.picture || null);

  // Set image preview for editing existing items
  useEffect(() => {
    if (initialData?.picture) {
      setImagePreview(initialData.picture);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.description || !selectedFile || !formData.shlingobs) {
      alert("Please fill in all required fields including an image");
      return;
    }

    try {
      setUploading(true);

      // Upload the image first
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        alert("Error uploading image: " + uploadData.message);
        return;
      }

      // Convert shlingobs to number and include uploaded image URL
      const submitData = {
        ...formData,
        picture: uploadData.url,
        shlingobs: parseFloat(formData.shlingobs),
        quantity: parseInt(formData.quantity),
      };

      onSubmit(submitData);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="rounded-lg p-6 mb-8 border" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
        {isEditing ? "Edit Item" : "Add New Item"}
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

          {/* Shlingobs */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Price (Shlingobs) *
            </label>
            <input
              type="number"
              name="shlingobs"
              value={formData.shlingobs}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full px-3 py-2 rounded-lg border focus:outline-none"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
            />
          </div>

          {/* Picture Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Picture *
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full px-3 py-2 rounded-lg border focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium"
                style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                    style={{ borderColor: "var(--border-primary)" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
            >
              <option value="Weapons">Weapons</option>
              <option value="Armor">Armor</option>
              <option value="Potions">Potions</option>
              <option value="Trinkets">Trinkets</option>
              <option value="Stolen Goods">Stolen Goods</option>
              <option value="Magical Items">Magical Items</option>
              <option value="Human Relics">Human Relics</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Rarity */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Rarity
            </label>
            <select
              name="rarity"
              value={formData.rarity}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
            >
              <option value="Common">Common</option>
              <option value="Uncommon">Uncommon</option>
              <option value="Rare">Rare</option>
              <option value="Epic">Epic</option>
              <option value="Legendary">Legendary</option>
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Condition
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
            >
              <option value="Pristine">Pristine</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
              <option value="Broken">Broken</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 rounded-lg border focus:outline-none"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
          />
        </div>

        {/* Merchant Notes */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Merchant Notes
          </label>
          <textarea
            name="merchantNotes"
            value={formData.merchantNotes}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
          />
        </div>

        {/* Acquired From */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Acquired From
          </label>
          <input
            type="text"
            name="acquiredFrom"
            value={formData.acquiredFrom}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--accent-primary)", color: "var(--text-on-accent)" }}
          >
            {uploading ? "Uploading..." : (isEditing ? "Update Item" : "Add Item")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={uploading}
            className="px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}