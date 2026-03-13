// Seed script to insert demo experiences into the database
// Run with: npm run seed

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("Error: NEON_DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const sql = neon(connectionString);

// Working Unsplash image URLs that are relevant to each experience
const demoExperiences = [
  // Guwahati experiences
  {
    district_slug: "guwahati",
    category: "festival",
    title: "Magh Bihu (Bhogali Bihu)",
    description: "Celebrate the harvest festival with traditional feasts, buffalo fights, and bonfires. Experience the community spirit as locals gather to share sweets and prayers for a bountiful year.",
    media_url: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800&q=80",
    tags: ["bihu", "harvest", "festival", "bonfire"],
    contributor_name: "Assam Tourism Board",
  },
  {
    district_slug: "guwahati",
    category: "cuisine",
    title: "Assamese Thali Experience",
    description: "Savor authentic Assamese cuisine with a traditional thali featuring khar, masor tenga, aloo pitika, and local rice varieties.",
    media_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    tags: ["food", "thali", "traditional", "cuisine"],
    contributor_name: "Local Food Guide",
  },
  {
    district_slug: "guwahati",
    category: "heritage",
    title: "Kamakhya Temple Pilgrimage",
    description: "Visit the sacred Shakti peeth on Nilachal Hill. Experience the spiritual ambiance of one of India's most important tantric temples.",
    media_url: "https://images.unsplash.com/photo-1561361058-54f9d7c0f74f?w=800&q=80",
    tags: ["temple", "spiritual", "shakti", "pilgrimage"],
    contributor_name: "Heritage Walks Guwahati",
  },
  {
    district_slug: "guwahati",
    category: "craft",
    title: "Assam Silk Weaving Workshop",
    description: "Learn the art of traditional Assam silk weaving from master weavers. Create your own piece using golden Muga silk.",
    media_url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80",
    tags: ["silk", "weaving", "muga", "handloom"],
    contributor_name: "Silk Weavers Association",
  },
  {
    district_slug: "guwahati",
    category: "festival",
    title: "Durga Puja Celebrations",
    description: "Witness grand Durga Puja celebrations with elaborately decorated pandals, cultural programs, and traditional rituals.",
    media_url: "https://images.unsplash.com/photo-1633612785551-953a612b7b23?w=800&q=80",
    tags: ["durga", "puja", "festival", "celebration"],
    contributor_name: "Guwahati Cultural Club",
  },

  // Majuli experiences
  {
    district_slug: "majuli",
    category: "heritage",
    title: "Satras of Majuli - Neo-Vaishnavite Culture",
    description: "Explore the unique satras that preserve the 500-year-old Neo-Vaishnavite tradition. Witness traditional mask-making and Sattriya dance.",
    media_url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    tags: ["satra", "vaishnavite", "culture", "island"],
    contributor_name: "Majuli Cultural Center",
  },
  {
    district_slug: "majuli",
    category: "folk_art",
    title: "Traditional Mask Making",
    description: "Learn the intricate art of mask-making from local artisans. These bamboo and clay masks are used in Sattriya performances.",
    media_url: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80",
    tags: ["masks", "craft", "sattriya", "art", "folk_art"],
    contributor_name: "Majuli Mask Artists",
  },
  {
    district_slug: "majuli",
    category: "festival",
    title: "Raas Leela Festival",
    description: "Experience the spectacular Raas Leela festival where the entire island comes alive with reenactments of Krishna's life.",
    media_url: "https://images.unsplash.com/photo-1605106702842-01a8430a7283?w=800&q=80",
    tags: ["raas", "krishna", "festival", "dance"],
    contributor_name: "Majuli Festival Committee",
  },
  {
    district_slug: "majuli",
    category: "cuisine",
    title: "River Island Culinary Journey",
    description: "Taste unique dishes made with locally grown produce and fresh river fish. Experience the simple yet flavorful Mishing cuisine.",
    media_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    tags: ["tribal", "fish", "local", "mishing"],
    contributor_name: "Island Home Stays",
  },

  // Sivasagar experiences
  {
    district_slug: "sivasagar",
    category: "heritage",
    title: "Ahom Dynasty Heritage Walk",
    description: "Walk through the ancient capital of the Ahom Kingdom. Visit Rang Ghar, Talatal Ghar, and Kareng Ghar.",
    media_url: "https://images.unsplash.com/photo-1545562083-c583d16dbcd1?w=800&q=80",
    tags: ["ahom", "history", "architecture", "palace"],
    contributor_name: "Heritage Society Sivasagar",
  },
  {
    district_slug: "sivasagar",
    category: "festival",
    title: "Me-Dam-Me-Phi - Ancestor Worship",
    description: "Participate in the unique Ahom festival honoring ancestors. Experience traditional rituals and cultural performances.",
    media_url: "https://images.unsplash.com/photo-1516450360452-9310f0e141a1?w=800&q=80",
    tags: ["ahom", "festival", "ancestors", "ritual"],
    contributor_name: "Ahom Cultural Association",
  },
  {
    district_slug: "sivasagar",
    category: "craft",
    title: "Traditional Pottery Making",
    description: "Learn ancient pottery techniques from local artisans. Create traditional vessels used in rituals and daily life.",
    media_url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
    tags: ["pottery", "clay", "traditional", "craft"],
    contributor_name: "Potters Guild Sivasagar",
  },
  {
    district_slug: "sivasagar",
    category: "folk_art",
    title: "Bihu Dance Performance Training",
    description: "Learn the energetic Bihu dance from local experts. Master the intricate footwork and traditional songs.",
    media_url: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=800&q=80",
    tags: ["dance", "bihu", "performance", "training", "folk_art"],
    contributor_name: "Sivasagar Dance Academy",
  },

  // Kaziranga experiences
  {
    district_slug: "kaziranga",
    category: "heritage",
    title: "Wildlife Safari - One-Horned Rhino",
    description: "Experience the thrill of spotting the endangered one-horned rhinoceros in its natural habitat.",
    media_url: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&q=80",
    tags: ["wildlife", "safari", "rhino", "nature"],
    contributor_name: "Kaziranga Wildlife Guides",
  },
  {
    district_slug: "kaziranga",
    category: "festival",
    title: "Kaziranga Elephant Festival",
    description: "Celebrate the majestic Asian elephant with cultural programs and awareness campaigns about wildlife conservation.",
    media_url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&q=80",
    tags: ["elephant", "festival", "wildlife", "conservation"],
    contributor_name: "Kaziranga Park Authority",
  },
  {
    district_slug: "kaziranga",
    category: "cuisine",
    title: "Tribal Cuisine of Karbi Anglong",
    description: "Discover the unique flavors of Karbi tribal cuisine. Taste bamboo shoot dishes and traditional rice beer.",
    media_url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
    tags: ["tribal", "karbi", "bamboo", "traditional"],
    contributor_name: "Karbi Cultural Society",
  },

  // Tezpur experiences
  {
    district_slug: "tezpur",
    category: "heritage",
    title: "Cole Park & Mahabhairab Temple",
    description: "Visit the historic Cole Park with its ancient sculptures and the Mahabhairab Temple.",
    media_url: "https://images.unsplash.com/photo-1561361058-54f9d7c0f74f?w=800&q=80",
    tags: ["temple", "park", "history", "sculpture"],
    contributor_name: "Tezpur Heritage Trust",
  },
  {
    district_slug: "tezpur",
    category: "craft",
    title: "Brass & Bell Metal Craft",
    description: "Learn the traditional art of brass and bell metal crafting from Sarthebari artisans.",
    media_url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
    tags: ["brass", "metal", "craft", "traditional"],
    contributor_name: "Sarthebari Craftsmen",
  },

  // Jorhat experiences
  {
    district_slug: "jorhat",
    category: "cuisine",
    title: "Tea Estate Experience",
    description: "Visit historic tea estates and learn about Assam tea production. Experience tea tasting sessions.",
    media_url: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80",
    tags: ["tea", "estate", "tasting", "plantation"],
    contributor_name: "Assam Tea Association",
  },
  {
    district_slug: "jorhat",
    category: "festival",
    title: "Ali-Aye-Ligang Festival",
    description: "Celebrate the spring sowing festival of the Mishing tribe with traditional dances and songs.",
    media_url: "https://images.unsplash.com/photo-1516450360452-9310f0e141a1?w=800&q=80",
    tags: ["festival", "mishing", "spring", "agriculture"],
    contributor_name: "Jorhat Cultural Center",
  },
  {
    district_slug: "jorhat",
    category: "heritage",
    title: "Lachit Borphukan Maidam",
    description: "Pay homage to the great Ahom general Lachit Borphukan at his memorial.",
    media_url: "https://images.unsplash.com/photo-1545562083-c583d16dbcd1?w=800&q=80",
    tags: ["history", "lachit", "memorial", "ahom"],
    contributor_name: "History Society Jorhat",
  },

  // Dibrugarh experiences
  {
    district_slug: "dibrugarh",
    category: "craft",
    title: "Traditional Weaving Workshop",
    description: "Master the traditional handloom weaving techniques of Upper Assam. Create beautiful gamosas.",
    media_url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80",
    tags: ["weaving", "handloom", "gamosha", "textile"],
    contributor_name: "Dibrugarh Weavers Co-op",
  },
  {
    district_slug: "dibrugarh",
    category: "festival",
    title: "Bhogali Bihu at Dibrugarh",
    description: "Experience the traditional Magh Bihu celebrations with community feasts and cultural programs.",
    media_url: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800&q=80",
    tags: ["bihu", "community", "feast", "celebration"],
    contributor_name: "Dibrugarh Cultural Forum",
  },

  // Tinsukia experiences
  {
    district_slug: "tinsukia",
    category: "heritage",
    title: "Digboi Oil Museum & Refinery",
    description: "Visit Asia's oldest oil refinery and museum. Learn about the history of oil exploration in Assam.",
    media_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    tags: ["oil", "museum", "history", "industry"],
    contributor_name: "Digboi Oil Heritage",
  },
  {
    district_slug: "tinsukia",
    category: "cuisine",
    title: "Singpho Tribal Cuisine",
    description: "Discover the unique cuisine of the Singpho tribe. Experience their traditional bamboo-cooked dishes.",
    media_url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
    tags: ["singpho", "tribal", "bamboo", "cuisine"],
    contributor_name: "Singpho Community Kitchen",
  },

  // Goalpara experiences
  {
    district_slug: "goalpara",
    category: "folk_art",
    title: "Rabha Tribe Music & Dance",
    description: "Experience the vibrant music and dance traditions of the Rabha tribe with unique instruments.",
    media_url: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=800&q=80",
    tags: ["rabha", "tribe", "music", "dance", "folk_art"],
    contributor_name: "Rabha Cultural Academy",
  },
  {
    district_slug: "goalpara",
    category: "heritage",
    title: "Sri Surya Pahar Archaeological Site",
    description: "Explore the ancient archaeological site featuring rock-cut caves and sculptures.",
    media_url: "https://images.unsplash.com/photo-1545562083-c583d16dbcd1?w=800&q=80",
    tags: ["archaeology", "sculpture", "history", "site"],
    contributor_name: "Archaeological Survey",
  },

  // Nalbari experiences
  {
    district_slug: "nalbari",
    category: "festival",
    title: "Bordowa Namghar - Sankardev Legacy",
    description: "Visit the birthplace of Srimanta Sankardev and experience the spiritual atmosphere of this historic satra.",
    media_url: "https://images.unsplash.com/photo-1561361058-54f9d7c0f74f?w=800&q=80",
    tags: ["sankardev", "namghar", "spiritual", "heritage"],
    contributor_name: "Bordowa Cultural Trust",
  },
  {
    district_slug: "nalbari",
    category: "craft",
    title: "Cane & Bamboo Craft Village",
    description: "Learn intricate cane and bamboo weaving from master craftspeople. Create baskets and furniture.",
    media_url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80",
    tags: ["cane", "bamboo", "craft", "sustainable"],
    contributor_name: "Nalbari Craft Council",
  },
];

async function seedExperiences() {
  console.log("Starting to seed demo experiences...");

  try {
    // Create schema first
    console.log("Creating database schema...");

    await sql`CREATE TABLE IF NOT EXISTS districts (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      latitude DOUBLE PRECISION NOT NULL,
      longitude DOUBLE PRECISION NOT NULL
    )`;

    await sql`DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_category') THEN
        CREATE TYPE experience_category AS ENUM (
          'festival', 'cuisine', 'craft', 'heritage', 'folk_art', 'other'
        );
      END IF;
    END$$`;

    await sql`DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_status') THEN
        CREATE TYPE experience_status AS ENUM (
          'pending', 'approved', 'rejected'
        );
      END IF;
    END$$`;

    await sql`CREATE TABLE IF NOT EXISTS experiences (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      district_slug TEXT NOT NULL REFERENCES districts(slug) ON DELETE CASCADE,
      category experience_category NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      media_url TEXT,
      tags TEXT[] DEFAULT '{}',
      contributor_name TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status experience_status NOT NULL DEFAULT 'pending'
    )`;

    console.log("Schema created.");

    // First, ensure all districts exist
    const districts = [
      { slug: "guwahati", name: "Guwahati", latitude: 26.1445, longitude: 91.7362 },
      { slug: "majuli", name: "Majuli", latitude: 27.0, longitude: 94.2 },
      { slug: "sivasagar", name: "Sivasagar", latitude: 26.9985, longitude: 94.6376 },
      { slug: "kaziranga", name: "Kaziranga", latitude: 26.5775, longitude: 93.1711 },
      { slug: "tezpur", name: "Tezpur", latitude: 26.6334, longitude: 92.8 },
      { slug: "jorhat", name: "Jorhat", latitude: 26.75, longitude: 94.2167 },
      { slug: "dibrugarh", name: "Dibrugarh", latitude: 27.4833, longitude: 95.0 },
      { slug: "tinsukia", name: "Tinsukia", latitude: 27.5, longitude: 95.3667 },
      { slug: "goalpara", name: "Goalpara", latitude: 26.1667, longitude: 90.6167 },
      { slug: "nalbari", name: "Nalbari", latitude: 26.45, longitude: 91.45 },
    ];

    for (const district of districts) {
      await sql`
        INSERT INTO districts (slug, name, latitude, longitude)
        VALUES (${district.slug}, ${district.name}, ${district.latitude}, ${district.longitude})
        ON CONFLICT (slug) DO NOTHING
      `;
    }
    console.log("Districts verified/inserted.");

    // Clear existing experiences to avoid duplicates
    await sql`DELETE FROM experiences`;
    console.log("Cleared existing experiences.");

    // Insert experiences
    for (const exp of demoExperiences) {
      await sql`
        INSERT INTO experiences (
          district_slug,
          category,
          title,
          description,
          media_url,
          tags,
          contributor_name,
          status
        )
        VALUES (
          ${exp.district_slug},
          ${exp.category},
          ${exp.title},
          ${exp.description},
          ${exp.media_url ?? null},
          ${exp.tags},
          ${exp.contributor_name ?? null},
          'approved'
        )
      `;
      console.log(`Inserted: ${exp.title} (${exp.district_slug})`);
    }

    console.log("\n✅ Demo experiences seeded successfully!");
    console.log(`Total experiences added: ${demoExperiences.length}`);

    // Verify count
    const [countResult] = await sql`SELECT COUNT(*) as count FROM experiences`;
    console.log(`Total experiences in database: ${countResult.count}`);
  } catch (error) {
    console.error("❌ Error seeding experiences:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedExperiences();
