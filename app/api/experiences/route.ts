
import { NextRequest, NextResponse } from "next/server";
import {
  createExperience,
  listExperiences,
  ExperienceCategory,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district") || undefined;
  const category = searchParams.get("category") || undefined;

  // Map frontend category names to database enum values
  const categoryMap: { [key: string]: string } = {
    "festivals": "festival",
    "cuisine": "cuisine", 
    "crafts": "craft",
    "heritage": "heritage",
    "folkArt": "folk_art"
  };

  const dbCategory = category ? categoryMap[category] || category : undefined;

  try {
    const experiences = await listExperiences(district, dbCategory);
    return NextResponse.json({ experiences });
  } catch (error) {
    console.error("Error fetching experiences", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      district_slug,
      category,
      title,
      description,
      media_url,
      tags,
      contributor_name,
      wikipedia_url,
    } = body;

    if (!district_slug || !category || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const allowedCategories: ExperienceCategory[] = [
      "festival",
      "cuisine",
      "craft",
      "heritage",
      "folk_art",
      "other",
    ];

    if (!allowedCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 },
      );
    }

    const experience = await createExperience({
      district_slug,
      category,
      title,
      description,
      media_url,
      tags: Array.isArray(tags) ? tags : [],
      contributor_name,
      wikipedia_url,
    });

    return NextResponse.json({ experience }, { status: 201 });
  } catch (error) {
    console.error("Error creating experience", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 },
    );
  }
}
