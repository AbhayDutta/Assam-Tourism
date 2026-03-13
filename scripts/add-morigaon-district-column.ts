// Script to add Morigaon district to the districts table
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("Error: NEON_DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const sql = neon(connectionString);

async function addMorigaonDistrict() {
  console.log("Adding Morigaon district to districts table...");

  try {
    // Add Morigaon district to the districts table
    await sql`
      INSERT INTO districts (slug, name, latitude, longitude)
      VALUES ('morigaon', 'Morigaon', 26.25, 92.35)
      ON CONFLICT (slug) DO NOTHING
    `;
    
    console.log("✅ Morigaon district added successfully!");

    // Verify the district was added
    const [result] = await sql`
      SELECT name, slug, latitude, longitude 
      FROM districts 
      WHERE slug = 'morigaon'
    `;

    if (result) {
      console.log("✅ District verification successful!");
      console.log(`Name: ${result.name}`);
      console.log(`Slug: ${result.slug}`);
      console.log(`Coordinates: [${result.latitude}, ${result.longitude}]`);
    } else {
      console.log("❌ District verification failed!");
    }

    // Show all districts
    const allDistricts = await sql`
      SELECT slug, name, latitude, longitude 
      FROM districts 
      ORDER BY name
    `;

    console.log("\n📍 All districts in database:");
    allDistricts.forEach((district) => {
      console.log(`  - ${district.name} (${district.slug}) [${district.latitude}, ${district.longitude}]`);
    });

  } catch (error) {
    console.error("❌ Error adding Morigaon district:", error);
    process.exit(1);
  }

  process.exit(0);
}

addMorigaonDistrict();
