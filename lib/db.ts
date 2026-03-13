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
}

const connectionString = process.env.NEON_DATABASE_URL;

const sql = connectionString ? neon(connectionString) : null;

export async function listExperiences(
  districtSlug?: string,
): Promise<Experience[]> {
  if (!sql) {
    throw new Error("Something went wrong. Please try again later.");
  }

  if (districtSlug) {
    const rows = await sql`
      SELECT id, district_slug, category, title, description, media_url, tags, contributor_name, created_at, status
      FROM experiences
      WHERE district_slug = ${districtSlug}
      ORDER BY created_at DESC
    `;
    return rows as unknown as Experience[];
  }

  const rows = await sql`
    SELECT id, district_slug, category, title, description, media_url, tags, contributor_name, created_at, status
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
  } = input;

  const [row] = await sql`
    INSERT INTO experiences (
      district_slug,
      category,
      title,
      description,
      media_url,
      tags,
      contributor_name
    )
    VALUES (
      ${district_slug},
      ${category},
      ${title},
      ${description},
      ${media_url ?? null},
      ${tags},
      ${contributor_name ?? null},
      'approved'
    )
    RETURNING id, district_slug, category, title, description, media_url, tags, contributor_name, created_at, status
  `;

  return row as unknown as Experience;
}
