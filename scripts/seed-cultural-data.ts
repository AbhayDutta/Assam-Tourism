// Seed script to insert cultural dataset into the database
// Run with: tsx scripts/seed-cultural-data.ts

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import culturalData from "../data/cultural-dataset.json";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("Error: NEON_DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const sql = neon(connectionString);

// Map district names to slugs
const districtSlugMap: { [key: string]: string } = {
  "Guwahati": "guwahati",
  "Majuli": "majuli",
  "Sivasagar": "sivasagar",
  "Kaziranga": "kaziranga",
  "Tezpur": "tezpur",
  "Jorhat": "jorhat",
  "Dibrugarh": "dibrugarh",
  "Tinsukia": "tinsukia",
  "Goalpara": "goalpara",
  "Nalbari": "nalbari",
  "Morigaon": "morigaon"
};

async function seedCulturalData() {
  console.log("Starting to seed cultural dataset...");

  try {
    let totalInserted = 0;

    // Process each district
    for (const districtData of culturalData.districts) {
      const districtSlug = districtSlugMap[districtData.district];
      
      if (!districtSlug) {
        console.warn(`Warning: No slug found for district "${districtData.district}"`);
        continue;
      }

      console.log(`Processing ${districtData.district}...`);

      // Insert festivals
      for (const festival of districtData.festivals) {
        await sql`
          INSERT INTO experiences (
            district_slug,
            category,
            title,
            description,
            tags,
            contributor_name,
            status
          )
          VALUES (
            ${districtSlug},
            'festival',
            ${festival},
            ${`Experience the vibrant ${festival} in ${districtData.district}, a celebration of local culture and traditions.`},
            ${['festival', districtData.district.toLowerCase(), 'culture']},
            'Cultural Heritage Database',
            'approved'
          )
        `;
        totalInserted++;
      }

      // Insert cuisine
      for (const cuisine of districtData.cuisine) {
        await sql`
          INSERT INTO experiences (
            district_slug,
            category,
            title,
            description,
            tags,
            contributor_name,
            status
          )
          VALUES (
            ${districtSlug},
            'cuisine',
            ${cuisine},
            ${`Taste the authentic ${cuisine}, a traditional delicacy from ${districtData.district} showcasing local flavors and cooking techniques.`},
            ${['cuisine', districtData.district.toLowerCase(), 'food', 'traditional']},
            'Cultural Heritage Database',
            'approved'
          )
        `;
        totalInserted++;
      }

      // Insert crafts
      for (const craft of districtData.crafts) {
        await sql`
          INSERT INTO experiences (
            district_slug,
            category,
            title,
            description,
            tags,
            contributor_name,
            status
          )
          VALUES (
            ${districtSlug},
            'craft',
            ${craft},
            ${`Discover the traditional ${craft} of ${districtData.district}, an ancient art form passed down through generations.`},
            ${['craft', districtData.district.toLowerCase(), 'handicraft', 'traditional']},
            'Cultural Heritage Database',
            'approved'
          )
        `;
        totalInserted++;
      }

      // Insert heritage sites
      for (const heritage of districtData.heritage) {
        await sql`
          INSERT INTO experiences (
            district_slug,
            category,
            title,
            description,
            tags,
            contributor_name,
            status
          )
          VALUES (
            ${districtSlug},
            'heritage',
            ${heritage},
            ${`Visit the historic ${heritage} in ${districtData.district}, a significant cultural and historical landmark.`},
            ${['heritage', districtData.district.toLowerCase(), 'historical', 'landmark']},
            'Cultural Heritage Database',
            'approved'
          )
        `;
        totalInserted++;
      }

      // Insert folk art
      for (const folkArt of districtData.folk_art) {
        await sql`
          INSERT INTO experiences (
            district_slug,
            category,
            title,
            description,
            tags,
            contributor_name,
            status
          )
          VALUES (
            ${districtSlug},
            'folk_art',
            ${folkArt},
            ${`Experience the traditional ${folkArt} of ${districtData.district}, a vibrant expression of local cultural identity.`},
            ${['folk_art', districtData.district.toLowerCase(), 'traditional', 'performance']},
            'Cultural Heritage Database',
            'approved'
          )
        `;
        totalInserted++;
      }
    }

    console.log(`\n✅ Cultural dataset seeded successfully!`);
    console.log(`Total experiences added: ${totalInserted}`);

    // Verify count
    const [countResult] = await sql`SELECT COUNT(*) as count FROM experiences`;
    console.log(`Total experiences in database: ${countResult.count}`);

  } catch (error) {
    console.error("❌ Error seeding cultural data:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedCulturalData();
