// Approve the test Majuli experience
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error("NEON_DATABASE_URL not set");
  process.exit(1);
}

const sql = neon(connectionString);

async function approveTest() {
  console.log("Approving test experience...\n");
  
  await sql`
    UPDATE experiences 
    SET status = 'approved' 
    WHERE district_slug = 'majuli' AND title = 'test'
  `;
  
  console.log("✅ Test experience approved!");
  console.log("Refresh your browser to see it in the cards.");
}

approveTest().catch(console.error).finally(() => process.exit(0));
