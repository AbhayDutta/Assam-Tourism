"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category =
  | "festival"
  | "cuisine"
  | "craft"
  | "heritage"
  | "folk_art"
  | "other";

const categories: { id: Category; label: string }[] = [
  { id: "festival", label: "Festival" },
  { id: "cuisine", label: "Cuisine" },
  { id: "craft", label: "Craft" },
  { id: "heritage", label: "Heritage" },
  { id: "folk_art", label: "Folk Art" },
  { id: "other", label: "Other" },
];

const districts = [
  { slug: "guwahati", name: "Guwahati" },
  { slug: "majuli", name: "Majuli" },
  { slug: "sivasagar", name: "Sivasagar" },
  { slug: "kaziranga", name: "Kaziranga" },
  { slug: "tezpur", name: "Tezpur" },
  { slug: "jorhat", name: "Jorhat" },
  { slug: "dibrugarh", name: "Dibrugarh" },
  { slug: "tinsukia", name: "Tinsukia" },
  { slug: "goalpara", name: "Goalpara" },
  { slug: "nalbari", name: "Nalbari" },
];

export default function ContributePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    district_slug: "",
    category: "" as Category | "",
    title: "",
    description: "",
    media_url: "",
    tags: "",
    contributor_name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit experience");
      }

      setSubmitStatus("success");
      setFormData({
        district_slug: "",
        category: "",
        title: "",
        description: "",
        media_url: "",
        tags: "",
        contributor_name: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 text-slate-50 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <div className="glass-panel p-6 sm:p-8">
          <div className="mb-6">
            <button
              onClick={() => router.push("/")}
              className="mb-4 text-sm text-sky-300 hover:text-sky-200"
            >
              ← Back to map
            </button>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Contribute an Experience
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Share a cultural experience from your district. Once approved, it
              will appear on the cultural map.
            </p>
          </div>

          {submitStatus === "success" && (
            <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-200">
              <p className="font-medium">✅ Experience submitted successfully!</p>
              <p className="mt-1 text-green-300/80">
                It will be reviewed and appear on the map once approved.
                Redirecting to home...
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              <p className="font-medium">❌ Error submitting experience</p>
              <p className="mt-1 text-red-300/80">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                District <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={formData.district_slug}
                onChange={(e) =>
                  setFormData({ ...formData, district_slug: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
              >
                <option value="">Select a district</option>
                {districts.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, category: cat.id })
                    }
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      formData.category === cat.id
                        ? "border-sky-500 bg-sky-500/20 text-sky-100"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/60"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Traditional Bihu Dance Workshop"
                className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                maxLength={500}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the experience, what visitors can expect, and why it's special..."
                className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
              <p className="mt-1 text-right text-xs text-slate-500">
                {formData.description.length}/500
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.media_url}
                onChange={(e) =>
                  setFormData({ ...formData, media_url: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-500">
                Paste an image URL (you can use Google Images, Unsplash, or any public image link)
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="e.g., festival, dance, traditional, music"
                className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Your Name (optional)
              </label>
              <input
                type="text"
                maxLength={50}
                value={formData.contributor_name}
                onChange={(e) =>
                  setFormData({ ...formData, contributor_name: e.target.value })
                }
                placeholder="How you'd like to be credited"
                className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-sky-500 px-6 py-3 text-sm font-medium text-slate-950 shadow-sm shadow-sky-500/40 transition hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Experience"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
