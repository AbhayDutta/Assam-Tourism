import fs from 'fs';
import path from 'path';

interface Guide {
  id: string;
  name: string;
  email: string;
  phone: string;
  languages: string[];
  districts: string[];
  specialties: string[];
  experience: string;
  price_per_day: number;
  rating: number;
  reviews: number;
  verified: boolean;
  available: boolean;
  description: string;
  profile_image?: string;
}

const GUIDES_FILE = path.join(process.cwd(), 'data', 'guides.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(GUIDES_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load guides from file
function loadGuides(): Guide[] {
  ensureDataDir();
  
  try {
    if (fs.existsSync(GUIDES_FILE)) {
      const data = fs.readFileSync(GUIDES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading guides:', error);
  }
  
  // Return default guides if file doesn't exist or has errors
  return [
    {
      id: 'guide-1',
      name: 'Rajib Sharma',
      email: 'rajib.guide@assamtourism.com',
      phone: '+91-9876543210',
      languages: ['Assamese', 'English', 'Hindi', 'Bengali'],
      districts: ['Guwahati', 'Kaziranga', 'Shillong'],
      specialties: ['Wildlife Tours', 'Cultural Heritage', 'Tea Gardens'],
      experience: '8+ years',
      price_per_day: 2500,
      rating: 4.8,
      reviews: 127,
      verified: true,
      available: true,
      description: 'Experienced guide specializing in wildlife and cultural tours. Deep knowledge of Assamese heritage and local traditions.',
      profile_image: '/guides/rajib.jpg'
    },
    {
      id: 'guide-2',
      name: 'Priya Das',
      email: 'priya.guide@assamtourism.com',
      phone: '+91-9876543211',
      languages: ['Assamese', 'English', 'Hindi'],
      districts: ['Guwahati', 'Majuli', 'Sivasagar'],
      specialties: ['River Cruises', 'Temple Tours', 'Handicrafts'],
      experience: '5+ years',
      price_per_day: 2000,
      rating: 4.6,
      reviews: 89,
      verified: true,
      available: true,
      description: 'Specialized in cultural and spiritual tours. Expert in Assamese temple architecture and traditional crafts.',
      profile_image: '/guides/priya.jpg'
    },
    {
      id: 'guide-3',
      name: 'Amit Baruah',
      email: 'amit.guide@assamtourism.com',
      phone: '+91-9876543212',
      languages: ['Assamese', 'English', 'Hindi', 'Japanese'],
      districts: ['Kaziranga', 'Manas', 'Nameri'],
      specialties: ['Wildlife Photography', 'Bird Watching', 'Adventure'],
      experience: '10+ years',
      price_per_day: 3000,
      rating: 4.9,
      reviews: 203,
      verified: true,
      available: true,
      description: 'Wildlife expert and photographer. Best guide for Kaziranga and Manas wildlife sanctuaries.',
      profile_image: '/guides/amit.jpg'
    },
    {
      id: 'guide-4',
      name: 'Anita Pathak',
      email: 'anita.guide@assamtourism.com',
      phone: '+91-9876543213',
      languages: ['Assamese', 'English', 'Hindi', 'French'],
      districts: ['Guwahati', 'Tezpur', 'Bhalukpong'],
      specialties: ['Tea Garden Tours', 'Tribal Culture', 'Nature Walks'],
      experience: '6+ years',
      price_per_day: 2200,
      rating: 4.7,
      reviews: 156,
      verified: true,
      available: true,
      description: 'Expert in tea garden tours and tribal culture. Fluent in French for international tourists.',
      profile_image: '/guides/anita.jpg'
    },
    {
      id: 'guide-5',
      name: 'Bikram Gogoi',
      email: 'bikram.guide@assamtourism.com',
      phone: '+91-9876543214',
      languages: ['Assamese', 'English', 'Hindi', 'Gujarati'],
      districts: ['Tawang', 'Bhalukpong', 'Dirang'],
      specialties: ['Adventure Tours', 'Monastery Tours', 'Trekking'],
      experience: '7+ years',
      price_per_day: 2800,
      rating: 4.5,
      reviews: 98,
      verified: true,
      available: true,
      description: 'Adventure specialist with expertise in Himalayan treks and monastery tours in Arunachal Pradesh.',
      profile_image: '/guides/bikram.jpg'
    }
  ];
}

// Save guides to file
function saveGuides(guides: Guide[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(GUIDES_FILE, JSON.stringify(guides, null, 2));
  } catch (error) {
    console.error('Error saving guides:', error);
  }
}

// Get guides (load from file)
export function getGuides(): Guide[] {
  return loadGuides();
}

export function findGuideById(id: string): Guide | undefined {
  const guides = getGuides();
  return guides.find(g => g.id === id);
}

export function findGuidesByDistrict(district: string): Guide[] {
  const guides = getGuides();
  return guides.filter(g => g.districts.includes(district));
}

export function findGuidesBySpecialty(specialty: string): Guide[] {
  const guides = getGuides();
  return guides.filter(g => g.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase())));
}

export function addGuide(guide: Omit<Guide, 'id'>) {
  const guides = getGuides();
  const newGuide = {
    ...guide,
    id: `guide-${Date.now()}`
  };
  guides.push(newGuide);
  saveGuides(guides);
  return newGuide;
}
