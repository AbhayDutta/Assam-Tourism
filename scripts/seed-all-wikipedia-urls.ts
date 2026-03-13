// Script to seed all Wikipedia URLs for cultural experiences
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import wikipediaLinks from "../data/wikipedia-links.json";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("Error: NEON_DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const sql = neon(connectionString);

async function seedAllWikipediaUrls() {
  console.log("Seeding all Wikipedia URLs for cultural experiences...");
  
  let totalUpdated = 0;
  
  for (const [district, categories] of Object.entries(wikipediaLinks.wikipedia_links)) {
    console.log(`\nProcessing ${district}...`);
    
    for (const [, items] of Object.entries(categories)) {
      for (const [itemName, wikipediaUrl] of Object.entries(items)) {
        try {
          await sql`
            UPDATE experiences 
            SET wikipedia_url = ${wikipediaUrl}
            WHERE title = ${itemName}
          `;
          
          console.log(`  ✓ Updated: ${itemName} -> ${wikipediaUrl}`);
          totalUpdated++;
        } catch {
          console.log(`  ✗ Failed to update: ${itemName}`);
        }
      }
    }
  }
  
  console.log(`\n✅ Wikipedia URL seeding completed!`);
  console.log(`Total experiences updated: ${totalUpdated}`);
  
  // Verify some updates
  const [result] = await sql`
    SELECT COUNT(*) as count 
    FROM experiences 
    WHERE wikipedia_url IS NOT NULL
  `;
  
  console.log(`Experiences with Wikipedia URLs: ${result.count}`);
  
  process.exit(0);
}

seedAllWikipediaUrls();
