"use client";

export default function LoreCard({ lore, onEdit, onDelete }) {
  const getImportanceColor = (importance) => {
    switch (importance) {
      case "Sacred":
        return "text-red-400 bg-red-900 border-red-700";
      case "Important":
        return "text-amber-400 bg-amber-900 border-amber-700";
      case "Useful":
        return "text-emerald-400 bg-emerald-900 border-emerald-700";
      case "Trivia":
        return "text-gray-400 bg-gray-800 border-gray-600";
      default:
        return "text-gray-400 bg-gray-800 border-gray-600";
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "Goblin Code":
        return "CODE";
      case "Merchant Laws":
        return "LAW";
      case "Human Interference Protocols":
        return "HIP";
      case "Ancient Traditions":
        return "TRAD";
      case "Closet Geography":
        return "GEO";
      case "Trade Secrets":
        return "TRADE";
      case "Goblin History":
        return "HIST";
      case "Magic & Enchantments":
        return "MAGIC";
      default:
        return "MISC";
    }
  };

  const getSecretLevelColor = (level) => {
    if (level >= 8) return "text-red-400";
    if (level >= 6) return "text-orange-400";
    if (level >= 4) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="lore-card group relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-2 py-1 bg-slate-700 text-slate-300 rounded">{getCategoryLabel(lore.category)}</span>
          <h3 className="text-xl font-bold text-amber-200 group-hover:text-amber-100 transition-colors">
            {lore.title}
          </h3>
        </div>

        {/* Action buttons - show on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(lore)}
              className="text-blue-400 hover:text-blue-300 text-sm"
              title="Edit Lore"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(lore)}
              className="text-red-400 hover:text-red-300 text-sm"
              title="Delete Lore"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="bg-emerald-800 text-emerald-200 px-2 py-1 rounded text-sm">
          {lore.category}
        </span>

        <span
          className={`px-2 py-1 rounded text-xs font-semibold border ${getImportanceColor(
            lore.importance
          )}`}
        >
          {lore.importance}
        </span>

        <span
          className={`text-xs font-mono ${getSecretLevelColor(
            lore.secretLevel
          )}`}
        >
          Secret Level: {lore.secretLevel}/10
        </span>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-amber-100 leading-relaxed">{lore.content}</p>
      </div>

      {/* Tags */}
      {lore.tags && lore.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {lore.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-purple-800 bg-opacity-50 text-purple-200 px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-amber-400 pt-3 border-t border-amber-800">
        <span>Added {new Date(lore.createdAt).toLocaleDateString()}</span>
        {lore.isActive ? (
          <span className="text-green-400">Active</span>
        ) : (
          <span className="text-gray-400">Archived</span>
        )}
      </div>

      {/* Secret level indicator */}
      <div className="absolute top-2 right-2">
        <div
          className={`w-3 h-3 rounded-full ${
            lore.secretLevel >= 8
              ? "bg-red-500"
              : lore.secretLevel >= 6
              ? "bg-orange-500"
              : lore.secretLevel >= 4
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          title={`Secret Level: ${lore.secretLevel}/10`}
        ></div>
      </div>
    </div>
  );
}
