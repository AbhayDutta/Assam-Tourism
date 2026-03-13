"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Experience, ExperienceCategory } from "@/lib/db";

const AssamMap = dynamic(
  () => import("@/components/AssamMap").then((m) => m.AssamMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
        Loading map...
      </div>
    ),
  },
);

type CategoryFilter = "all" | ExperienceCategory;

const categoryColors: Record<string, string> = {
  festival: "bg-orange-500/20 text-orange-200 border-orange-500/30",
  cuisine: "bg-green-500/20 text-green-200 border-green-500/30",
  craft: "bg-purple-500/20 text-purple-200 border-purple-500/30",
  heritage: "bg-amber-500/20 text-amber-200 border-amber-500/30",
  folk_art: "bg-pink-500/20 text-pink-200 border-pink-500/30",
  other: "bg-slate-500/20 text-slate-200 border-slate-500/30",
};

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

function useExperiences(districtSlug?: string, category: CategoryFilter = "all") {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (districtSlug) params.set("district", districtSlug);
        const res = await fetch(`/api/experiences?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        let items: Experience[] = data.experiences ?? [];
        if (category !== "all") {
          items = items.filter((e) => e.category === category);
        }
        setExperiences(items);
      } catch (error) {
        console.error("Failed to load experiences", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [districtSlug, category]);

  return { experiences, loading };
}

function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 transition-all duration-300 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10">
      {exp.media_url && (
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={exp.media_url}
            alt={exp.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
          <span
            className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
              categoryColors[exp.category] || categoryColors.other
            }`}
          >
            {exp.category.replace("_", " ")}
          </span>
        </div>
      )}
      <div className={`p-4 ${!exp.media_url ? "pt-4" : ""}`}>
        {!exp.media_url && (
          <span
            className={`mb-2 inline-block rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
              categoryColors[exp.category] || categoryColors.other
            }`}
          >
            {exp.category.replace("_", " ")}
          </span>
        )}
        <h3 className="mb-2 text-base font-semibold text-slate-50 group-hover:text-sky-300 transition-colors">
          {exp.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-slate-400">
          {exp.description}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {exp.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
          {exp.contributor_name && (
            <span className="text-[11px] text-slate-500">
              by {exp.contributor_name}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [district, setDistrict] = useState<string | undefined>("guwahati");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const { experiences, loading } = useExperiences(district, category);

  const activeDistrict = districts.find((d) => d.slug === district);
  const activeDistrictLabel = activeDistrict?.name || "All Assam";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-6 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="mb-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Discover Assam&apos;s
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              {" "}
              Cultural Heritage
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-400 sm:text-base">
            Explore festivals, cuisine, crafts, and heritage sites across 10 districts.
            Each experience is a window into Assam&apos;s rich cultural tapestry.
          </p>
        </header>

        {/* District Quick Select */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setDistrict(undefined)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              district === undefined
                ? "border-sky-500 bg-sky-500/20 text-sky-100"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/60"
            }`}
          >
            All Districts
          </button>
          {districts.map((d) => (
            <button
              key={d.slug}
              onClick={() => setDistrict(d.slug)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                district === d.slug
                  ? "border-sky-500 bg-sky-500/20 text-sky-100"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/60"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px]">
          {/* Left: Map */}
          <section className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-300">
                  Interactive Cultural Map
                </h2>
                <span className="text-xs text-slate-500">
                  Click markers to explore
                </span>
              </div>
              <div className="h-[400px] overflow-hidden rounded-xl border border-white/5">
                <AssamMap
                  selectedDistrictSlug={district}
                  onSelectDistrict={(slug) => setDistrict(slug)}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-center">
                <div className="text-2xl font-bold text-sky-400">{districts.length}</div>
                <div className="text-xs text-slate-400">Districts</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-center">
                <div className="text-2xl font-bold text-indigo-400">6</div>
                <div className="text-xs text-slate-400">Categories</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">25+</div>
                <div className="text-xs text-slate-400">Experiences</div>
              </div>
            </div>
          </section>

          {/* Right: Experiences */}
          <section className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 shadow-xl">
              {/* Header */}
              <div className="border-b border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">
                      {activeDistrictLabel}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {experiences.length} {experiences.length === 1 ? "experience" : "experiences"} found
                    </p>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: "all", label: "All" },
                      { id: "festival", label: "Festivals" },
                      { id: "cuisine", label: "Cuisine" },
                      { id: "craft", label: "Crafts" },
                      { id: "heritage", label: "Heritage" },
                      { id: "folk_art", label: "Folk Art" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCategory(item.id)}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                        category === item.id
                          ? "border-sky-500 bg-sky-500/20 text-sky-100"
                          : "border-white/5 bg-white/5 text-slate-400 hover:border-sky-400/60 hover:text-slate-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Grid */}
              <div className="max-h-[600px] overflow-y-auto p-4">
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
                  </div>
                )}

                {!loading && experiences.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="mb-3 text-4xl">🎯</div>
                    <p className="text-sm text-slate-400">
                      No experiences found for this selection.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Try selecting a different district or category.
                    </p>
                  </div>
                )}

                {!loading && experiences.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-1">
                    {experiences.map((exp) => (
                      <ExperienceCard key={exp.id} exp={exp} />
                    ))}
                  </div>
                )}
              </div>

              {/* Contribute CTA */}
              <div className="border-t border-white/10 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-200">
                      Have something to share?
                    </h3>
                    <p className="text-xs text-slate-400">
                      Contribute your local cultural experience
                    </p>
                  </div>
                  <a
                    href="/contribute"
                    className="rounded-full bg-sky-500 px-4 py-2 text-xs font-medium text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
                  >
                    Contribute
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
