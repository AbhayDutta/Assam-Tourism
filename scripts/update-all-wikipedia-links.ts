// Update all experiences with Wikipedia links
// Run with: tsx scripts/update-all-wikipedia-links.ts

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import culturalData from "../data/cultural-dataset.json";
import wikipediaLinks from "../data/wikipedia-links.json";

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

// Map frontend category names to database enum values
const categoryMap: { [key: string]: string } = {
  "festivals": "festival",
  "cuisine": "cuisine", 
  "crafts": "craft",
  "heritage": "heritage",
  "folk_art": "folk_art"
};

async function updateWikipediaLinks() {
  console.log("Updating Wikipedia links for all experiences...");

  try {
    let totalUpdated = 0;

    // Process each district
    for (const districtData of culturalData.districts) {
      const districtSlug = districtSlugMap[districtData.district];
      
      if (!districtSlug) {
        console.warn(`Warning: No slug found for district "${districtData.district}"`);
        continue;
      }

      console.log(`Processing ${districtData.district}...`);

      // Get Wikipedia links for this district
      const districtWikiLinks = wikipediaLinks.wikipedia_links[districtData.district as keyof typeof wikipediaLinks.wikipedia_links];
      
      if (!districtWikiLinks) {
        console.warn(`Warning: No Wikipedia links found for district "${districtData.district}"`);
        continue;
      }

      // Update festivals
      for (const festival of districtData.festivals) {
        const wikiUrl = districtWikiLinks.festivals?.[festival as keyof typeof districtWikiLinks.festivals];
        if (wikiUrl) {
          await sql`
            UPDATE experiences 
            SET wikipedia_url = ${wikiUrl}
            WHERE district_slug = ${districtSlug} AND category = ${categoryMap.festivals} AND title = ${festival}
          `;
          totalUpdated++;
          console.log(`  ✓ Updated Wikipedia link for: ${festival}`);
        }
      }

      // Update cuisine
      for (const cuisine of districtData.cuisine) {
        const wikiUrl = districtWikiLinks.cuisine?.[cuisine as keyof typeof districtWikiLinks.cuisine];
        if (wikiUrl) {
          await sql`
            UPDATE experiences 
            SET wikipedia_url = ${wikiUrl}
            WHERE district_slug = ${districtSlug} AND category = ${categoryMap.cuisine} AND title = ${cuisine}
          `;
          totalUpdated++;
          console.log(`  ✓ Updated Wikipedia link for: ${cuisine}`);
        }
      }

      // Update crafts
      for (const craft of districtData.crafts) {
        const wikiUrl = districtWikiLinks.crafts?.[craft as keyof typeof districtWikiLinks.crafts];
        if (wikiUrl) {
          await sql`
            UPDATE experiences 
            SET wikipedia_url = ${wikiUrl}
            WHERE district_slug = ${districtSlug} AND category = ${categoryMap.crafts} AND title = ${craft}
          `;
          totalUpdated++;
          console.log(`  ✓ Updated Wikipedia link for: ${craft}`);
        }
      }

      // Update heritage
      for (const heritage of districtData.heritage) {
        const wikiUrl = districtWikiLinks.heritage?.[heritage as keyof typeof districtWikiLinks.heritage];
        if (wikiUrl) {
          await sql`
            UPDATE experiences 
            SET wikipedia_url = ${wikiUrl}
            WHERE district_slug = ${districtSlug} AND category = ${categoryMap.heritage} AND title = ${heritage}
          `;
          totalUpdated++;
          console.log(`  ✓ Updated Wikipedia link for: ${heritage}`);
        }
      }

      // Update folk art
      for (const folkArt of districtData.folk_art) {
        const wikiUrl = districtWikiLinks.folk_art?.[folkArt as keyof typeof districtWikiLinks.folk_art];
        if (wikiUrl) {
          await sql`
            UPDATE experiences 
            SET wikipedia_url = ${wikiUrl}
            WHERE district_slug = ${districtSlug} AND category = ${categoryMap.folk_art} AND title = ${folkArt}
          `;
          totalUpdated++;
          console.log(`  ✓ Updated Wikipedia link for: ${folkArt}`);
        }
      }
    }

    console.log(`\n✅ Wikipedia links updated successfully!`);
    console.log(`Total experiences updated: ${totalUpdated}`);

    // Verify count
    const [countResult] = await sql`SELECT COUNT(*) as count FROM experiences WHERE wikipedia_url IS NOT NULL`;
    console.log(`Total experiences with Wikipedia links: ${countResult.count}`);

  } catch (error) {
    console.error("❌ Error updating Wikipedia links:", error);
    process.exit(1);
  }

  process.exit(0);
}

updateWikipediaLinks();
