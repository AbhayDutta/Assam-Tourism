import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.NEON_DATABASE_URL;

const sql = connectionString ? neon(connectionString) : null;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!sql) {
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Experience ID is required" },
        { status: 400 }
      );
    }

    // Get user authentication info
    const token = request.cookies.get('auth-token')?.value;
    let currentUser = null;

    if (token) {
      try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
        currentUser = {
          id: decoded.userId,
          role: decoded.role,
          name: decoded.name
        };
      } catch (error) {
        // Invalid token, continue as unauthenticated
      }
    }

    // First check if the experience exists
    const [experience] = await sql`
      SELECT id, title, district_slug, contributor_name 
      FROM experiences 
      WHERE id = ${id}
    `;

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    // Check permissions
    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required to delete experiences" },
        { status: 401 }
      );
    }

    const isAdmin = currentUser.role === 'admin';
    const isOwner = currentUser.name === experience.contributor_name;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "You can only delete your own experiences" },
        { status: 403 }
      );
    }

    // Delete the experience
    await sql`
      DELETE FROM experiences 
      WHERE id = ${id}
    `;

    return NextResponse.json({ 
      message: "Experience deleted successfully",
      deletedExperience: experience 
    });

  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}
