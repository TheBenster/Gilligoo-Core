"use client";

import { useState } from "react";

export default function InventoryModal({ item, isOpen, onClose, onEdit, onDelete, isAdmin }) {
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !item) return null;

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "Common":
        return "text-gray-400 bg-gray-800 border-gray-600";
      case "Uncommon":
        return "text-green-400 bg-green-900 border-green-700";
      case "Rare":
        return "text-blue-400 bg-blue-900 border-blue-700";
      case "Epic":
        return "text-purple-400 bg-purple-900 border-purple-700";
      case "Legendary":
        return "text-amber-400 bg-amber-900 border-amber-700";
      default:
        return "text-gray-400 bg-gray-800 border-gray-600";
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-600">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-emerald-600 p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-emerald-200 mb-2">{item.title}</h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-emerald-800 text-emerald-200 px-3 py-1 rounded text-sm">
                {item.category}
              </span>
              <span className={`px-3 py-1 rounded text-sm font-semibold border ${getRarityColor(item.rarity)}`}>
                {item.rarity}
              </span>
              {item.inStock && item.quantity > 0 ? (
                <span className="bg-green-800 text-green-200 px-3 py-1 rounded text-sm">
                  In Stock ({item.quantity})
                </span>
              ) : (
                <span className="bg-red-800 text-red-200 px-3 py-1 rounded text-sm">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl ml-4"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          {item.picture && !imageError && (
            <div className="mb-6">
              <img
                src={item.picture}
                alt={item.title}
                className="w-full h-64 object-cover rounded-lg border border-emerald-600"
                style={{ objectPosition: item.imagePosition || "center" }}
                onError={() => setImageError(true)}
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-emerald-200 mb-3">Description</h3>
            <p className="text-emerald-100 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Price */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-emerald-200 mb-2">Price</h3>
            <div className="text-2xl font-bold text-amber-400">
              {item.shlingobs} Shlingobs
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-md font-semibold text-emerald-200 mb-2">Item Details</h4>
              <div className="space-y-2 text-emerald-100">
                <div>
                  <span className="text-emerald-300">Category:</span> {item.category}
                </div>
                <div>
                  <span className="text-emerald-300">Rarity:</span> {item.rarity}
                </div>
                <div>
                  <span className="text-emerald-300">Quantity:</span> {item.quantity}
                </div>
                <div>
                  <span className="text-emerald-300">Status:</span>{" "}
                  {item.inStock && item.quantity > 0 ? "Available" : "Out of Stock"}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-emerald-200 mb-2">Acquisition Info</h4>
              <div className="space-y-2 text-emerald-100">
                <div>
                  <span className="text-emerald-300">Added:</span>{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
                {item.updatedAt && item.updatedAt !== item.createdAt && (
                  <div>
                    <span className="text-emerald-300">Last Updated:</span>{" "}
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="border-t border-emerald-600 pt-6">
              <h4 className="text-md font-semibold text-emerald-200 mb-3">Admin Actions</h4>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onEdit(item);
                    onClose();
                  }}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-emerald-100 px-4 py-2 rounded font-medium transition-colors"
                >
                  Edit Item
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
                      onDelete(item._id);
                      onClose();
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  Delete Item
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}