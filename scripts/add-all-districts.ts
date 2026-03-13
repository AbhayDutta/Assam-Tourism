// Add all districts to the database
// Run with: tsx scripts/add-all-districts.ts

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("Error: NEON_DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const sql = neon(connectionString);

const districts = [
  { slug: "guwahati", name: "Guwahati", latitude: 26.1445, longitude: 91.7362 },
  { slug: "majuli", name: "Majuli", latitude: 27.0, longitude: 94.2 },
  { slug: "sivasagar", name: "Sivasagar", latitude: 26.9985, longitude: 94.6376 },
  { slug: "kaziranga", name: "Kaziranga", latitude: 26.6617, longitude: 93.4296 },
  { slug: "tezpur", name: "Tezpur", latitude: 26.6280, longitude: 92.7916 },
  { slug: "jorhat", name: "Jorhat", latitude: 26.7471, longitude: 94.2012 },
  { slug: "dibrugarh", name: "Dibrugarh", latitude: 27.4785, longitude: 94.9043 },
  { slug: "tinsukia", name: "Tinsukia", latitude: 27.4888, longitude: 95.8565 },
  { slug: "goalpara", name: "Goalpara", latitude: 26.1773, longitude: 90.6171 },
  { slug: "nalbari", name: "Nalbari", latitude: 26.4496, longitude: 91.4331 },
  { slug: "morigaon", name: "Morigaon", latitude: 26.2497, longitude: 92.3574 }
];

async function addDistricts() {
  console.log("Adding districts to database...");

  try {
    for (const district of districts) {
      await sql`
        INSERT INTO districts (slug, name, latitude, longitude)
        VALUES (${district.slug}, ${district.name}, ${district.latitude}, ${district.longitude})
        ON CONFLICT (slug) DO NOTHING
      `;
      console.log(`✓ Added/updated district: ${district.name}`);
    }

    console.log("\n✅ All districts added successfully!");

    // Verify count
    const [countResult] = await sql`SELECT COUNT(*) as count FROM districts`;
    console.log(`Total districts in database: ${countResult.count}`);

  } catch (error) {
    console.error("❌ Error adding districts:", error);
    process.exit(1);
  }

  process.exit(0);
}

addDistricts();
