"use client";

import { useState } from "react";

export default function BlogEditor({ onSave, initialPost = null }) {
  const [title, setTitle] = useState(initialPost?.title || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [tags, setTags] = useState(initialPost?.tags?.join(", ") || "");
  const [goblinRating, setGoblinRating] = useState(
    initialPost?.goblinRating || 3
  );
  const [merchantLevel, setMerchantLevel] = useState(
    initialPost?.merchantLevel || "Apprentice"
  );
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || "");
  const [isPublished, setIsPublished] = useState(
    initialPost?.isPublished || false
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (publish = false) => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content!");
      return;
    }

    setIsSaving(true);

    // Convert basic markdown to HTML
    const htmlContent = content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>");

    const finalContent = `<p>${htmlContent}</p>`;

    const postData = {
      title: title.trim(),
      content: finalContent,
      excerpt: excerpt.trim() || content.substring(0, 200) + "...",
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      goblinRating,
      merchantLevel,
      coverImage,
      isPublished: publish,
      ...(initialPost && { _id: initialPost._id }),
    };

    try {
      const response = await fetch("/api/posts", {
        method: initialPost ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          publish
            ? "Chronicle published successfully!"
            : "Chronicle saved as draft!"
        );
        if (onSave) onSave(result.post);
        // Clear form if it's a new post
        if (!initialPost) {
          setTitle("");
          setContent("");
          setExcerpt("");
          setTags("");
          setCoverImage("");
        }
      } else {
        alert("Error saving chronicle: " + result.message);
      }
    } catch (error) {
      alert("Error saving chronicle: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black bg-opacity-40 backdrop-blur-sm rounded-lg shadow-lg border border-emerald-500">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-emerald-200 mb-2">
          {initialPost ? "Edit Chronicle" : "New Goblin Chronicle"}
        </h2>
        <p className="text-emerald-300">
          Document your latest adventures in the realm of closet commerce
        </p>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-emerald-200 mb-2">
          Chronicle Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-emerald-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-100 placeholder-emerald-400"
          placeholder="The Great Sock Heist of Tuesday..."
        />
      </div>

      {/* Goblin-specific fields */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-emerald-200 mb-2">
            Goblin Rating (1-5 Stars)
          </label>
          <select
            value={goblinRating}
            onChange={(e) => setGoblinRating(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-800 border border-emerald-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-100"
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} {"★".repeat(rating)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-200 mb-2">
            Merchant Level
          </label>
          <select
            value={merchantLevel}
            onChange={(e) => setMerchantLevel(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-emerald-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-100"
          >
            <option value="Apprentice">Apprentice</option>
            <option value="Journeyman">Journeyman</option>
            <option value="Master">Master</option>
            <option value="Grand Master">Grand Master</option>
          </select>
        </div>
      </div>

      {/* Cover Image */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-emerald-200 mb-2">
          Cover Image URL (optional)
        </label>
        <input
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-emerald-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-100 placeholder-emerald-400"
          placeholder="https://example.com/goblin-image.jpg"
        />
        {coverImage && (
          <div className="mt-2">
            <img
              src={coverImage}
              alt="Cover preview"
              className="w-32 h-32 object-cover rounded border border-emerald-600"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* Content Editor */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-emerald-200 mb-2">
          Chronicle Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          className="w-full px-4 py-3 bg-slate-800 border border-emerald-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-100 placeholder-emerald-400 leading-relaxed font-mono"
          placeholder="Begin your goblin tale here...

You can use basic formatting:
**bold text** - wraps text in bold
*italic text* - makes text italic
Double line breaks create new paragraphs

Example:
Today I discovered the **ancient art** of *sock trading* in the depths of the master bedroom closet. The dust bunnies were particularly cooperative, offering me three premium cotton socks in exchange for a single wool mitten.

It was a *most profitable* venture indeed!"
        />
        <div className="bg-emerald-900 bg-opacity-30 rounded p-3 mt-2 border border-emerald-700">
          <h4 className="text-emerald-200 font-semibold mb-2">
            Formatting Guide:
          </h4>
          <div className="text-emerald-300 text-sm space-y-1">
            <p>
              <code>**bold text**</code> → <strong>bold text</strong>
            </p>
            <p>
              <code>*italic text*</code> → <em>italic text</em>
            </p>
            <p>Double line breaks create new paragraphs</p>
          </div>
        </div>
      </div>

      {/* Excerpt */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-emerald-200 mb-2">
          Excerpt (optional - auto-generated if empty)
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-slate-800 border border-emerald-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-100 placeholder-emerald-400"
          placeholder="A brief summary of your chronicle..."
        />
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-emerald-200 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-emerald-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-100 placeholder-emerald-400"
          placeholder="closet, trading, stealth, humans, adventure, dust-bunnies"
        />
        <p className="text-emerald-400 text-sm mt-1">
          Suggested tags: closet, trading, stealth, humans, adventure,
          dust-bunnies, socks, magic, lore
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleSave(false)}
          disabled={isSaving}
          className="px-6 py-3 bg-slate-600 text-white rounded-md hover:bg-slate-700 disabled:opacity-50 font-semibold transition-colors duration-200 flex items-center justify-center"
        >
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Saving...
            </>
          ) : (
            <>💾 Save Draft</>
          )}
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={isSaving}
          className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 font-semibold transition-colors duration-200 shadow-lg flex items-center justify-center"
        >
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Publishing...
            </>
          ) : (
            <>🚀 Publish Chronicle</>
          )}
        </button>
      </div>

      {/* Preview Section */}
      {content && (
        <div className="mt-8 border-t border-emerald-800 pt-6">
          <h3 className="text-lg font-semibold text-emerald-200 mb-3">
            📖 Preview:
          </h3>
          <div className="bg-slate-900 bg-opacity-50 rounded-lg p-4 border border-emerald-700">
            <h4 className="text-xl font-bold text-emerald-100 mb-2">
              {title || "Untitled Chronicle"}
            </h4>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-amber-400">
                {"★".repeat(goblinRating)}
              </span>
              <span className="text-purple-300 text-sm">{merchantLevel}</span>
            </div>
            <div
              className="text-emerald-200 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\*(.*?)\*/g, "<em>$1</em>")
                  .replace(/\n\n/g, "</p><p>")
                  .replace(/\n/g, "<br>")
                  .replace(/^(.*)$/, "<p>$1</p>"),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
