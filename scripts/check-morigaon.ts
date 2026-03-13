// Script to check Morigaon data
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.NEON_DATABASE_URL);

async function checkMorigaon() {
  try {
    console.log('Checking Morigaon experiences...');
    
    // Check if district exists
    const district = await sql`SELECT * FROM districts WHERE slug = 'morigaon'`;
    console.log('District:', district);
    
    // Check experiences
    const experiences = await sql`SELECT title, category, status FROM experiences WHERE district_slug = 'morigaon'`;
    console.log('Morigaon experiences:', experiences);
    
    // Check total count
    const [count] = await sql`SELECT COUNT(*) as count FROM experiences WHERE district_slug = 'morigaon'`;
    console.log('Total Morigaon experiences:', count.count);
    
    // Check if experiences are approved
    const approved = await sql`SELECT COUNT(*) as count FROM experiences WHERE district_slug = 'morigaon' AND status = 'approved'`;
    console.log('Approved Morigaon experiences:', approved.count);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

checkMorigaon();
