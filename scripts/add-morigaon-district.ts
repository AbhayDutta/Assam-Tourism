// Script to add Morigaon district and seed its cultural experiences
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("Error: NEON_DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const sql = neon(connectionString);

const morigaonExperiences = [
  // Festivals
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
  {
    district_slug: "morigaon",
    category: "festival",
    title: "Holi",
    description: "Festival of colors celebrated with traditional Assamese customs, folk songs, and community gatherings.",
    tags: ["festival", "colors", "celebration", "spring"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Holi"
  },
  {
    district_slug: "morigaon",
    category: "festival",
    title: "Janmashtami",
    description: "Celebration of Lord Krishna's birth with devotional songs, dances, and traditional rituals.",
    tags: ["festival", "religious", "krishna", "devotional"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Janmashtami"
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
    title: "Bamboo Shoot Curry",
    description: "Spicy and flavorful curry made with tender bamboo shoots, a local delicacy of the region.",
    tags: ["cuisine", "bamboo", "curry", "local"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Bamboo_shoot"
  },
  
  // Crafts
  {
    district_slug: "morigaon",
    category: "craft",
    title: "Bamboo Craft",
    description: "Traditional bamboo products including baskets, furniture, and decorative items made by local artisans.",
    tags: ["craft", "bamboo", "handicraft", "traditional"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Bamboo_crafts_of_Assam"
  },
  {
    district_slug: "morigaon",
    category: "craft",
    title: "Handloom Weaving",
    description: "Traditional weaving of Assamese textiles including mekhela chadors and gamosas using natural dyes.",
    tags: ["craft", "handloom", "textile", "traditional"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Handloom"
  },
  {
    district_slug: "morigaon",
    category: "craft",
    title: "Cane Furniture",
    description: "Eco-friendly furniture made from locally sourced cane, showcasing traditional craftsmanship.",
    tags: ["craft", "cane", "furniture", "eco-friendly"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Cane_furniture"
  },
  {
    district_slug: "morigaon",
    category: "craft",
    title: "Pottery",
    description: "Traditional pottery making using local clay, creating both utilitarian and decorative items.",
    tags: ["craft", "pottery", "clay", "traditional"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Pottery"
  },
  
  // Heritage
  {
    district_slug: "morigaon",
    category: "heritage",
    title: "Pobitora Wildlife Sanctuary",
    description: "Famous wildlife sanctuary known for one-horned rhinoceros and diverse bird species.",
    tags: ["heritage", "wildlife", "sanctuary", "rhinoceros"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Pobitora_Wildlife_Sanctuary"
  },
  {
    district_slug: "morigaon",
    category: "heritage",
    title: "Morigaon Town",
    description: "Historic town with ancient temples, traditional architecture, and rich cultural heritage.",
    tags: ["heritage", "town", "history", "temples"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Morigaon_district"
  },
  {
    district_slug: "morigaon",
    category: "heritage",
    title: "Ancient Temples",
    description: "Centuries-old temples showcasing unique Assamese architecture and religious traditions.",
    tags: ["heritage", "temples", "architecture", "religious"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Morigaon_district"
  },
  
  // Folk Art
  {
    district_slug: "morigaon",
    category: "folk_art",
    title: "Bihu Dance",
    description: "Traditional folk dance performed during Bihu festival with energetic movements and colorful costumes.",
    tags: ["folk_art", "dance", "bihu", "traditional"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Bihu_dance"
  },
  {
    district_slug: "morigaon",
    category: "folk_art",
    title: "Folk Songs",
    description: "Traditional Assamese folk songs depicting rural life, love, and seasonal celebrations.",
    tags: ["folk_art", "music", "songs", "traditional"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Assamese_folk_music"
  },
  {
    district_slug: "morigaon",
    category: "folk_art",
    title: "Traditional Theatre",
    description: "Folk theatre performances including Bhaona depicting mythological stories and local legends.",
    tags: ["folk_art", "theatre", "bhaona", "mythology"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Bhaona"
  },
  {
    district_slug: "morigaon",
    category: "folk_art",
    title: "Ojapali",
    description: "Traditional narrative performance combining music, dance, and storytelling by local artists.",
    tags: ["folk_art", "performance", "storytelling", "traditional"],
    wikipedia_url: "https://en.wikipedia.org/wiki/Ojapali"
  }
];

async function addMorigaonDistrict() {
  console.log("Adding Morigaon district and cultural experiences...");
  
  try {
    // Add the district
    await sql`
      INSERT INTO districts (slug, name, latitude, longitude)
      VALUES ('morigaon', 'Morigaon', 26.25, 92.35)
      ON CONFLICT (slug) DO NOTHING
    `;
    console.log("✅ Morigaon district added successfully!");
    
    // Add experiences
    for (const experience of morigaonExperiences) {
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
    
    console.log("✅ All Morigaon experiences added successfully!");
    console.log(`Total experiences added: ${morigaonExperiences.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding Morigaon:", error);
    process.exit(1);
  }
}

addMorigaonDistrict();
