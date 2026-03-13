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
  onlyApproved: boolean = true,
): Promise<Experience[]> {
  if (!sql) {
    // Fallback sample data so the UI still works without Neon configured.
    return [
      {
        id: "sample-1",
        district_slug: "guwahati",
        category: "festival",
        title: "Bihu Celebrations in Guwahati",
        description:
          "Experience vibrant Rongali Bihu celebrations with traditional dance, music, and local cuisine in Guwahati.",
        media_url:
          "https://res.cloudinary.com/demo/image/upload/v1710000000/assam-bihu.jpg",
        tags: ["bihu", "festival", "dance"],
        contributor_name: "Sample Community Contributor",
        created_at: new Date().toISOString(),
        status: "approved",
      },
    ];
  }

  // Build query based on filters
  if (districtSlug && onlyApproved) {
    const rows = await sql`
      SELECT id, district_slug, category, title, description, media_url, tags, contributor_name, created_at, status
      FROM experiences
      WHERE district_slug = ${districtSlug} AND status = 'approved'
      ORDER BY created_at DESC
    `;
    return rows as unknown as Experience[];
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

  if (onlyApproved) {
    const rows = await sql`
      SELECT id, district_slug, category, title, description, media_url, tags, contributor_name, created_at, status
      FROM experiences
      WHERE status = 'approved'
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
    throw new Error(
      "NEON_DATABASE_URL is not set. Configure Neon to enable contributions.",
    );
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
      ${contributor_name ?? null}
    )
    RETURNING id, district_slug, category, title, description, media_url, tags, contributor_name, created_at, status
  `;

  return row as unknown as Experience;
}

