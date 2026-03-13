// Script to update Morigaon experiences with specific cultural items
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("Error: NEON_DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const sql = neon(connectionString);

const updatedMorigaonExperiences = [
  // Festivals
  {
    district_slug: "morigaon",
    category: "festival",
    title: "Jonbeel Mela",
    description: "Ancient fair where tribal communities gather for barter trade, cultural exchange, and traditional celebrations along the Jonbeel wetlands.",
    tags: ["festival", "tribal", "barter", "cultural", "wetlands"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Jonbeel_Mela"
  },
  {
    district_slug: "morigaon",
    category: "festival",
    title: "Bihu",
    description: "The vibrant agricultural festival celebrated with traditional Assamese folk dances, music, and cultural performances.",
    tags: ["festival", "agriculture", "dance", "music"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Bihu"
  },
  {
    district_slug: "morigaon",
    category: "festival",
    title: "Durga Puja",
    description: "Grand celebration of the goddess Durga with elaborate rituals, cultural programs, and community feasting.",
    tags: ["festival", "religious", "community", "celebration"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Durga_Puja"
  },
  
  // Cuisine
  {
    district_slug: "morigaon",
    category: "cuisine",
    title: "Assamese Thali",
    description: "Complete traditional meal with rice, dal, fish curry, vegetables, and local specialties served on banana leaves.",
    tags: ["cuisine", "traditional", "thali", "assamese"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Assamese_cuisine"
  },
  {
    district_slug: "morigaon",
    category: "cuisine",
    title: "Fish Tenga",
    description: "Tangy fish curry made with local river fish, tomatoes, and traditional Assamese spices.",
    tags: ["cuisine", "fish", "tangy", "traditional"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Fish_tenga"
  },
  {
    district_slug: "morigaon",
    category: "cuisine",
    title: "Pitha",
    description: "Traditional rice cakes prepared during festivals, both sweet and savory varieties using local ingredients.",
    tags: ["cuisine", "rice", "traditional", "festival"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Pitha"
  },
  {
    district_slug: "morigaon",
    category: "cuisine",
    title: "Til Laru",
    description: "Traditional sweet delicacy made from sesame seeds, jaggery, and ghee, prepared during festivals and special occasions.",
    tags: ["cuisine", "sweet", "sesame", "traditional", "festival"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Til_laddu"
  },
  {
    district_slug: "morigaon",
    category: "cuisine",
    title: "Bamboo Shoot Dishes",
    description: "Various traditional dishes made from tender bamboo shoots, including curries, pickles, and fermented preparations.",
    tags: ["cuisine", "bamboo", "traditional", "fermented"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Bamboo_shoot"
  },
  
  // Crafts
  {
    district_slug: "morigaon",
    category: "craft",
    title: "Bamboo and Cane Craft",
    description: "Traditional handicrafts using bamboo and cane including baskets, furniture, and decorative items by local artisans.",
    tags: ["craft", "bamboo", "cane", "handicraft", "traditional"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Bamboo_crafts_of_Assam"
  },
  {
    district_slug: "morigaon",
    category: "craft",
    title: "Handloom Weaving",
    description: "Traditional weaving of Assamese textiles including mekhela chadors and gamosas using natural dyes and traditional patterns.",
    tags: ["craft", "handloom", "textile", "traditional"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Handloom"
  },
  {
    district_slug: "morigaon",
    category: "craft",
    title: "Tribal Textiles",
    description: "Unique textile traditions of local tribal communities featuring distinctive patterns, colors, and weaving techniques.",
    tags: ["craft", "tribal", "textile", "traditional", "weaving"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Tribal_textile_arts"
  },
  
  // Heritage
  {
    district_slug: "morigaon",
    category: "heritage",
    title: "Pobitora Wildlife Sanctuary",
    description: "Famous wildlife sanctuary known for one-horned rhinoceros, diverse bird species, and rich biodiversity.",
    tags: ["heritage", "wildlife", "sanctuary", "rhinoceros", "birds"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Pobitora_Wildlife_Sanctuary"
  },
  {
    district_slug: "morigaon",
    category: "heritage",
    title: "Mayong Village",
    description: "Ancient village known for its rich traditions of black magic, tantric practices, and mystical folklore heritage.",
    tags: ["heritage", "village", "magic", "folklore", "ancient"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Mayong"
  },
  
  // Folk Art
  {
    district_slug: "morigaon",
    category: "folk_art",
    title: "Bihu Dance",
    description: "Traditional folk dance performed during Bihu festival with energetic movements, colorful costumes, and traditional music.",
    tags: ["folk_art", "dance", "bihu", "traditional", "festival"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Bihu_dance"
  },
  {
    district_slug: "morigaon",
    category: "folk_art",
    title: "Tiwa Tribal Dance",
    description: "Traditional dance form of the Tiwa tribal community featuring unique movements, costumes, and cultural expressions.",
    tags: ["folk_art", "dance", "tribal", "tiwa", "traditional"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Tiwa_people"
  },
  {
    district_slug: "morigaon",
    category: "folk_art",
    title: "Goalpariya Folk Songs",
    description: "Traditional folk songs from the Goalpara region depicting rural life, love stories, and seasonal celebrations.",
    tags: ["folk_art", "music", "songs", "traditional", "rural"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Goalpariya_folk_songs"
  }
];

async function updateMorigaonExperiences() {
  console.log("Updating Morigaon experiences with specific cultural items...");
  
  try {
    // First, delete existing Morigaon experiences to avoid duplicates
    await sql`
      DELETE FROM experiences 
      WHERE district_slug = 'morigaon'
    `;
    console.log("✅ Cleared existing Morigaon experiences");
    
    // Add updated experiences
    for (const experience of updatedMorigaonExperiences) {
      await sql`
        INSERT INTO experiences (
          district_slug, category, title, description, 
          tags, contributor_name, wikipedia_url, status
        )
        VALUES (
          ${experience.district_slug},
          ${experience.category},
          ${experience.title},
          ${experience.description},
          ${experience.tags},
          'System Generated',
          ${experience.wikipedia_url},
          'approved'
        )
      `;
      console.log(`✅ Added: ${experience.title}`);
    }
    
    console.log("✅ All updated Morigaon experiences added successfully!");
    console.log(`Total experiences added: ${updatedMorigaonExperiences.length}`);
    
    // Verify the count
    const [result] = await sql`
      SELECT COUNT(*) as count 
      FROM experiences 
      WHERE district_slug = 'morigaon'
    `;
    
    console.log(`Morigaon experiences in database: ${result.count}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating Morigaon experiences:", error);
    process.exit(1);
  }
}

updateMorigaonExperiences();
