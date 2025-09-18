import BlogEditor from "@/components/BlogEditor";

export default function WritePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-800 py-8">
      <div className="container mx-auto px-4">
        <BlogEditor />
      </div>
    </div>
  );
}
