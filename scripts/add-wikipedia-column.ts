// Migration script to add Wikipedia URL column to experiences table
// Run with: tsx scripts/add-wikipedia-column.ts

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("Error: NEON_DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const sql = neon(connectionString);

async function addWikipediaColumn() {
  console.log("Adding Wikipedia URL column to experiences table...");

  try {
    // Add the wikipedia_url column to the experiences table
    await sql`
      ALTER TABLE experiences 
      ADD COLUMN IF NOT EXISTS wikipedia_url TEXT
    `;
    
    console.log("✅ Wikipedia URL column added successfully!");

    // Verify the column was added
    const [result] = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'experiences' 
      AND column_name = 'wikipedia_url'
    `;

    if (result) {
      console.log("✅ Column verification successful!");
    } else {
      console.log("❌ Column verification failed!");
    }

  } catch (error) {
    console.error("❌ Error adding Wikipedia URL column:", error);
    process.exit(1);
  }

  process.exit(0);
}

addWikipediaColumn();
