// Script to add Wikipedia URLs to existing experiences
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("Error: NEON_DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const sql = neon(connectionString);

const wikipediaUrls: { [key: string]: string } = {
  "Kamakhya Temple": "https://en.wikipedia.org/wiki/Kamakhya_Temple",
  "Kaziranga National Park": "https://en.wikipedia.org/wiki/Kaziranga_National_Park",
  "Rang Ghar": "https://en.wikipedia.org/wiki/Rang_Ghar",
  "Talatal Ghar": "https://en.wikipedia.org/wiki/Talatal_Ghar",
  "Bihu": "https://en.wikipedia.org/wiki/Bihu",
  "Majuli": "https://en.wikipedia.org/wiki/Majuli",
  "Sattriya dance": "https://en.wikipedia.org/wiki/Sattriya",
  "Durga Puja": "https://en.wikipedia.org/wiki/Durga_Puja",
  "Tea": "https://en.wikipedia.org/wiki/Tea",
  "Bamboo": "https://en.wikipedia.org/wiki/Bamboo"
};

async function seedWikipediaUrls() {
  console.log("Adding Wikipedia URLs to experiences...");
  
  for (const [title, url] of Object.entries(wikipediaUrls)) {
    await sql`
      UPDATE experiences 
      SET wikipedia_url = ${url}
      WHERE title = ${title}
    `;
    console.log(`Added Wikipedia URL for: ${title}`);
  }
  
  console.log("✅ Wikipedia URLs added successfully!");
  process.exit(0);
}

seedWikipediaUrls();
