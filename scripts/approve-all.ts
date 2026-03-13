// Approve all pending experiences
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error("NEON_DATABASE_URL not set");
  process.exit(1);
}

const sql = neon(connectionString);

async function approveAll() {
  console.log("Checking for pending experiences...\n");
  
  const pending = await sql`
    SELECT id, title, district_slug, status 
    FROM experiences 
    WHERE status != 'approved'
  `;
  
  console.log(`Found ${pending.length} non-approved experiences`);
  
  if (pending.length > 0) {
    console.log("\nApproving all...");
    await sql`UPDATE experiences SET status = 'approved' WHERE status != 'approved'`;
    console.log("✅ All experiences approved!");
  }
  
  const [count] = await sql`SELECT COUNT(*) as count FROM experiences`;
  console.log(`\nTotal experiences: ${count.count}`);
}

approveAll().catch(console.error).finally(() => process.exit(0));
