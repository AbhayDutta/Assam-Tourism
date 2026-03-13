// Check Majuli experiences in database
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error("NEON_DATABASE_URL not set");
  process.exit(1);
}

const sql = neon(connectionString);

async function checkMajuli() {
  console.log("Checking Majuli experiences...\n");
  
  const experiences = await sql`
    SELECT id, title, category, status, district_slug, media_url 
    FROM experiences 
    WHERE district_slug = 'majuli'
  `;
  
  console.log(`Found ${experiences.length} Majuli experiences:\n`);
  
  for (const exp of experiences) {
    console.log(`- ${exp.title}`);
    console.log(`  Category: ${exp.category}`);
    console.log(`  Status: ${exp.status}`);
    console.log(`  Has image: ${exp.media_url ? 'Yes' : 'No'}`);
    console.log("");
  }
  
  // Also check all approved experiences count
  const [approvedCount] = await sql`SELECT COUNT(*) as count FROM experiences WHERE status = 'approved'`;
  console.log(`Total approved experiences: ${approvedCount.count}`);
}

checkMajuli().catch(console.error).finally(() => process.exit(0));
