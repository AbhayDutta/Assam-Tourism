import { neon } from "@neondatabase/serverless";

export type ExperienceCategory =
  | "festival"
  | "cuisine"
  | "craft"
  | "heritage"
  | "folk_art"
  | "other";

export type ExperienceStatus = "pending" | "approved" | "rejected";

export interface Experience {
  id: string;
  district_slug: string;
  category: ExperienceCategory;
  title: string;
  description: string;
  media_url?: string | null;
  tags: string[];
  contributor_name?: string | null;
  created_at: string;
  status: ExperienceStatus;
  wikipedia_url?: string | null;
}

const connectionString = process.env.NEON_DATABASE_URL;

const sql = connectionString ? neon(connectionString) : null;

export async function listExperiences(
  districtSlug?: string,
  category?: string,
): Promise<Experience[]> {
  if (!sql) {
    throw new Error("Something went wrong. Please try again later.");
  }

  if (districtSlug && category && category !== "all") {
    const rows = await sql`
      SELECT id, district_slug, category, title, description, media_url, tags, contributor_name, created_at, status, wikipedia_url
      FROM experiences
      WHERE district_slug = ${districtSlug} AND category = ${category}
      ORDER BY created_at DESC
    `;
    return rows as unknown as Experience[];
  }

  if (districtSlug) {
    const rows = await sql`
      SELECT id, district_slug, category, title, description, media_url, tags, contributor_name, created_at, status, wikipedia_url
      FROM experiences
      WHERE district_slug = ${districtSlug}
      ORDER BY created_at DESC
    `;
    return rows as unknown as Experience[];
  }

  if (category && category !== "all") {
    const rows = await sql`
      SELECT id, district_slug, category, title, description, media_url, tags, contributor_name, created_at, status, wikipedia_url
      FROM experiences
      WHERE category = ${category}
      ORDER BY created_at DESC
    `;
    return rows as unknown as Experience[];
  }

  const rows = await sql`
    SELECT id, district_slug, category, title, description, media_url, tags, contributor_name, created_at, status, wikipedia_url
    FROM experiences
    ORDER BY created_at DESC
  `;
  return rows as unknown as Experience[];
}

export interface CreateExperienceInput {
  district_slug: string;
  category: ExperienceCategory;
  title: string;
  description: string;
  media_url?: string;
  tags?: string[];
  contributor_name?: string;
  wikipedia_url?: string;
}

export async function createExperience(
  input: CreateExperienceInput,
): Promise<Experience> {
  if (!sql) {
    throw new Error("Something went wrong. Please try again later.");
  }

  const {
    district_slug,
    category,
    title,
    description,
    media_url,
    tags = [],
    contributor_name,
    wikipedia_url,
  } = input;

  const [row] = await sql`
    INSERT INTO experiences (
      district_slug,
      category,
      title,
      description,
      media_url,
      tags,
      contributor_name,
      wikipedia_url
    )
    VALUES (
      ${district_slug},
      ${category},
      ${title},
      ${description},
      ${media_url ?? null},
      ${tags},
      ${contributor_name ?? null},
      ${wikipedia_url ?? null}
    )
    RETURNING id, district_slug, category, title, description, media_url, tags, contributor_name, created_at, status, wikipedia_url
  `;

  return row as unknown as Experience;
}
