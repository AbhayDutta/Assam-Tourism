"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ItineraryPlanner } from "@/components/ItineraryPlanner";

type ExperienceCategory = "festivals" | "cuisine" | "crafts" | "heritage" | "folkArt";

interface Experience {
  id: string;
  title: string;
  description: string;
  district: string;
  category: ExperienceCategory;
  media_url?: string;
  tags: string[];
  contributor_name: string;
  wikipedia_url?: string;
}

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

const districts = [
  { name: "Guwahati", slug: "guwahati" },
  { name: "Majuli", slug: "majuli" },
  { name: "Sivasagar", slug: "sivasagar" },
  { name: "Kaziranga", slug: "kaziranga" },
  { name: "Tezpur", slug: "tezpur" },
  { name: "Jorhat", slug: "jorhat" },
  { name: "Dibrugarh", slug: "dibrugarh" },
  { name: "Tinsukia", slug: "tinsukia" },
  { name: "Goalpara", slug: "goalpara" },
  { name: "Nalbari", slug: "nalbari" },
  { name: "Morigaon", slug: "morigaon" },
];

type CategoryFilter = "all" | "festivals" | "cuisine" | "heritage" | "crafts" | "folkArt";

function useExperiences(districtSlug: string | undefined, category: CategoryFilter) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const cacheRef = useRef<Map<string, Experience[]>>(new Map());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the API call
    timeoutRef.current = setTimeout(async () => {
      const cacheKey = `${districtSlug || 'all'}-${category}`;
      
      // Check cache first
      if (cacheRef.current.has(cacheKey)) {
        setExperiences(cacheRef.current.get(cacheKey)!);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (districtSlug) params.set("district", districtSlug);
        if (category !== "all") params.set("category", category);
        
        const res = await fetch(`/api/experiences?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        const items: Experience[] = data.experiences ?? [];
        
        // Update cache
        cacheRef.current.set(cacheKey, items);
        setExperiences(items);
      } catch (error) {
        console.error("Failed to load experiences", error);
      } finally {
        setLoading(false);
      }
    }, 150); // 150ms debounce delay

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [districtSlug, category]);

  return { experiences, loading };
}

function ExperienceCard({ exp }: { exp: Experience }) {
  const { t } = useLanguage();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${exp.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/experiences/${exp.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the page to show updated list
        window.location.reload();
      } else {
        alert('Failed to delete experience');
      }
    } catch {
      alert('Error deleting experience');
    }
  };

  return (
    <article className="group rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-all duration-200 hover:border-[var(--accent-warm)]/30 hover:shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[var(--accent-warm)] uppercase tracking-wide">
            {t(exp.category)}
          </span>
          <span className="text-xs text-[var(--muted)]">
            {exp.district}
          </span>
        </div>
        
        <h3 className="mb-2 text-base font-semibold text-[var(--foreground)] leading-tight">
          {exp.title}
        </h3>
        
        <p className="mb-3 line-clamp-2 text-sm text-[var(--muted)] leading-relaxed">
          {exp.description}
        </p>
        
        {exp.wikipedia_url && (
          <div className="mb-3">
            <a
              href={exp.wikipedia_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-warm)] hover:text-[var(--accent-warm-hover)] transition-colors"
              title="Learn more"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              More Details
            </a>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {exp.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs text-[var(--muted)]"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--muted)] opacity-75">
              {exp.contributor_name}
            </span>
            <button
              onClick={handleDelete}
              className="text-xs text-red-500 hover:text-red-400 transition-colors"
              title="Delete experience"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [district, setDistrict] = useState<string | undefined>("guwahati");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const { experiences, loading } = useExperiences(district, category);
  const { t } = useLanguage();

  const activeDistrict = districts.find((d) => d.slug === district);
  const activeDistrictLabel = activeDistrict?.name || "All Assam";

  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--background)]/95 to-[var(--background)] px-4 py-8 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-lg">
                <Image
                  src="/logo.png"
                  alt="Aloukik Axom Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[var(--foreground)]">
                  Aloukik Axom
                </h1>
                <p className="text-xs text-[var(--muted)]">
                  {t("appSubtitle") || "Discover Assam's rich cultural heritage"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ItineraryPlanner />
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* District Quick Select */}
        <div className="mb-6 flex flex-wrap justify-center gap-1">
          <button
            onClick={() => setDistrict(undefined)}
            className={`rounded-full border px-3 py-1 text-xs font-light transition ${
              district === undefined
                ? "border-[var(--accent-warm)] bg-[var(--accent-warm)] text-white"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent-warm)]"
            }`}
          >
            {t("allDistricts")}
          </button>
          {districts.map((d) => (
            <button
              key={d.slug}
              onClick={() => setDistrict(d.slug)}
              className={`rounded-full border px-3 py-1 text-xs font-light transition ${
                district === d.slug
                  ? "border-[var(--accent-warm)] bg-[var(--accent-warm)] text-white"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent-warm)]"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          {/* Left: Map */}
          <section className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-medium text-[var(--foreground)]">
                  Interactive Cultural Map
                </h2>
                <span className="text-[10px] text-[var(--muted)]">
                  Click markers to explore
                </span>
              </div>
              <div className="h-[500px] overflow-hidden rounded border border-[var(--border)]">
                <AssamMap
                  key="assam-map"
                  selectedDistrictSlug={district}
                  onSelectDistrict={(slug) => setDistrict(slug)}
                />
              </div>
            </div>
          </section>

          {/* Right: Experiences */}
          <section className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              {/* Header */}
              <div className="border-b border-[var(--border)] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-medium text-[var(--foreground)]">
                      {activeDistrictLabel}
                    </h2>
                    <p className="text-[10px] text-[var(--muted)]">
                      {experiences.length} {experiences.length === 1 ? "experience" : "experiences"}
                    </p>
                  </div>
                </div>

              {/* Category Filter */}
                <div className="flex flex-wrap gap-1">
                  {(
                    [
                      { id: "all", label: "All" },
                      { id: "festivals", label: "Festivals" },
                      { id: "cuisine", label: "Cuisine" },
                      { id: "crafts", label: "Crafts" },
                      { id: "heritage", label: "Heritage" },
                      { id: "folkArt", label: "Folk Art" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCategory(item.id)}
                      className={`rounded-full border px-2 py-1 text-[10px] font-light transition ${
                        category === item.id
                          ? "border-[var(--accent-warm)] bg-[var(--accent-warm)] text-white"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent-warm)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Grid */}
              <div className="max-h-[500px] overflow-y-auto p-4">
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--accent-warm)] border-t-transparent" />
                      <p className="text-xs text-[var(--muted)]">Loading experiences...</p>
                    </div>
                  </div>
                )}

                {!loading && experiences.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="mb-3 text-2xl">🎯</div>
                    <p className="text-xs text-[var(--muted)]">
                      No experiences found for this selection.
                    </p>
                    <p className="mt-1 text-[10px] text-[var(--muted)]">
                      Try selecting a different district or category.
                    </p>
                  </div>
                )}

                {!loading && experiences.length > 0 && (
                  <div className="space-y-3">
                    {experiences.map((exp) => (
                      <ExperienceCard key={exp.id} exp={exp} />
                    ))}
                  </div>
                )}
              </div>

              {/* Contribute CTA */}
              <div className="border-t border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h3 className="text-xs font-medium text-[var(--foreground)]">
                      Have something to share?
                    </h3>
                    <p className="text-[10px] text-[var(--muted)]">
                      Contribute your local cultural experience
                    </p>
                  </div>
                  <a
                    href="/contribute"
                    className="rounded-full bg-[var(--accent-warm)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[var(--accent-warm-hover)]"
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
