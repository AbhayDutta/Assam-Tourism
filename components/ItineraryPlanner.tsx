"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Experience {
  id: string;
  title: string;
  description: string;
  district: string;
  category: string;
  estimatedCost: number;
  duration: string;
  bestTime: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  experiences: Experience[];
  travelCost: number;
  accommodationCost: number;
  foodCost: number;
  estimatedCost: number;
  notes: string;
}

interface ItineraryPlan {
  days: ItineraryDay[];
  totalCost: number;
  budget: number;
  budgetUsed: number;
  recommendations: string[];
}

// Real Assam experiences with realistic costs
const assamExperiences: Experience[] = [
  {
    id: "kamakhya",
    title: "Kamakhya Temple",
    description: "Ancient Shakti temple on Nilachal Hill",
    district: "Guwahati",
    category: "Heritage",
    estimatedCost: 500,
    duration: "3 hours",
    bestTime: "Morning"
  },
  {
    id: "kaziranga",
    title: "Kaziranga National Park",
    description: "UNESCO World Heritage Site - One-horned rhinos",
    district: "Golaghat",
    category: "Wildlife",
    estimatedCost: 2000,
    duration: "6 hours",
    bestTime: "Early morning"
  },
  {
    id: "brahmaputra",
    title: "Brahmaputra River Cruise",
    description: "Sunset cruise on the mighty Brahmaputra",
    district: "Guwahati",
    category: "Nature",
    estimatedCost: 1500,
    duration: "2 hours",
    bestTime: "Evening"
  },
  {
    id: "majuli",
    title: "Majuli Island",
    description: "World's largest river island and Vaishnavite culture",
    district: "Jorhat",
    category: "Cultural",
    estimatedCost: 3000,
    duration: "Full day",
    bestTime: "Full day"
  },
  {
    id: "sualkuchi",
    title: "Sualkuchi Silk Village",
    description: "Traditional Assamese silk weaving center",
    district: "Kamrup",
    category: "Crafts",
    estimatedCost: 800,
    duration: "4 hours",
    bestTime: "Afternoon"
  },
  {
    id: "manas",
    title: "Manas National Park",
    description: "Tiger reserve and biodiversity hotspot",
    district: "Barpeta",
    category: "Wildlife",
    estimatedCost: 2500,
    duration: "5 hours",
    bestTime: "Morning"
  },
  {
    id: "tea-garden",
    title: "Assam Tea Garden Tour",
    description: "Visit traditional tea gardens and tea processing",
    district: "Jorhat",
    category: "Nature",
    estimatedCost: 1200,
    duration: "3 hours",
    bestTime: "Morning"
  },
  {
    id: "tawang",
    title: "Tawang Monastery",
    description: "Largest Buddhist monastery in India",
    district: "Tawang",
    category: "Heritage",
    estimatedCost: 4000,
    duration: "Full day",
    bestTime: "Full day"
  },
  {
    id: "shillong",
    title: "Shillong Day Trip",
    description: "Scotland of the East - beautiful hill station",
    district: "Shillong",
    category: "Nature",
    estimatedCost: 3500,
    duration: "Full day",
    bestTime: "Full day"
  },
  {
    id: "hajo",
    title: "Hajo Pilgrimage",
    description: "Multi-religious pilgrimage site",
    district: "Kamrup",
    category: "Heritage",
    estimatedCost: 600,
    duration: "4 hours",
    bestTime: "Morning"
  },
  {
    id: "pobitora",
    title: "Pobitora Wildlife Sanctuary",
    description: "Closest rhino habitat to Guwahati",
    district: "Morigaon",
    category: "Wildlife",
    estimatedCost: 2000,
    duration: "5 hours",
    bestTime: "Morning"
  },
  {
    id: "sibsagar",
    title: "Sibsagar Historical Sites",
    description: "Ahom dynasty monuments and temples",
    district: "Sibsagar",
    category: "Heritage",
    estimatedCost: 1000,
    duration: "4 hours",
    bestTime: "Afternoon"
  }
];

// Travel costs between locations (simplified)
const travelCosts: { [key: string]: number } = {
  "Guwahati-Golaghat": 2000,
  "Guwahati-Jorhat": 2500,
  "Guwahati-Barpeta": 1500,
  "Guwahati-Tawang": 5000,
  "Guwahati-Shillong": 3000,
  "Guwahati-Kamrup": 800,
  "Guwahati-Morigaon": 1200,
  "Guwahati-Sibsagar": 3000,
  "Golaghat-Jorhat": 1000,
  "Jorhat-Sibsagar": 800,
  "Kamrup-Morigaon": 600
};

// Accommodation costs per night
const accommodationCosts: { [key: string]: number } = {
  "Guwahati": 2000,
  "Golaghat": 1500,
  "Jorhat": 1800,
  "Barpeta": 1200,
  "Tawang": 2500,
  "Shillong": 2200,
  "Kamrup": 1000,
  "Morigaon": 1000,
  "Sibsagar": 1400
};

// Food costs per day
const foodCosts: { [key: string]: number } = {
  budget: 800,
  medium: 1200,
  premium: 2000
};

export function ItineraryPlanner() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("3");
  const [nights, setNights] = useState("2");
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryPlan | null>(null);

  const generateItinerary = async () => {
    if (!budget || !days || !nights) return;
    
    setIsGenerating(true);
    
    // Simulate API call to generate itinerary
    setTimeout(() => {
      const budgetNum = parseInt(budget);
      const daysNum = parseInt(days);
      
      const generatedItinerary = createRealisticItinerary(budgetNum, daysNum);
      setItinerary(generatedItinerary);
      setIsGenerating(false);
    }, 2000);
  };

  const createRealisticItinerary = (budget: number, days: number): ItineraryPlan => {
    const itineraryDays: ItineraryDay[] = [];
    let remainingBudget = budget;
    let currentLocation = "Guwahati";
    
    // Day 1: Arrival and Guwahati exploration
    const day1Experiences = [assamExperiences[0]]; // Kamakhya Temple
    const day1FoodCost = foodCosts.budget;
    const day1AccommodationCost = accommodationCosts[currentLocation];
    const day1Cost = day1Experiences.reduce((sum, exp) => sum + exp.estimatedCost, 0) + day1FoodCost + day1AccommodationCost;
    
    itineraryDays.push({
      day: 1,
      title: t("day1") || "Day 1: Arrival & Guwahati Exploration",
      location: currentLocation,
      experiences: day1Experiences,
      travelCost: 0,
      accommodationCost: day1AccommodationCost,
      foodCost: day1FoodCost,
      estimatedCost: day1Cost,
      notes: "Arrive in Guwahati, check into hotel, visit Kamakhya Temple"
    });
    
    remainingBudget -= day1Cost;
    
    // Day 2: Major attraction based on budget
    if (days >= 2) {
      let day2Experiences: Experience[] = [];
      let day2Location = "Golaghat";
      let day2TravelCost = travelCosts["Guwahati-Golaghat"] || 2000;
      
      if (budget >= 15000) {
        // High budget: Kaziranga
        day2Experiences = [assamExperiences[1]]; // Kaziranga
        day2Location = "Golaghat";
        day2TravelCost = travelCosts["Guwahati-Golaghat"] || 2000;
      } else if (budget >= 10000) {
        // Medium budget: Pobitora (closer, cheaper)
        day2Experiences = [assamExperiences[10]]; // Pobitora
        day2Location = "Morigaon";
        day2TravelCost = travelCosts["Guwahati-Morigaon"] || 1200;
      } else {
        // Low budget: Sualkuchi
        day2Experiences = [assamExperiences[4]]; // Sualkuchi
        day2Location = "Kamrup";
        day2TravelCost = travelCosts["Guwahati-Kamrup"] || 800;
      }
      
      const day2FoodCost = foodCosts.budget;
      const day2AccommodationCost = accommodationCosts[day2Location] || 1500;
      const day2Cost = day2Experiences.reduce((sum, exp) => sum + exp.estimatedCost, 0) + day2FoodCost + day2AccommodationCost + day2TravelCost;
      
      itineraryDays.push({
        day: 2,
        title: t("day2") || `Day 2: ${day2Experiences[0].title} Adventure`,
        location: day2Location,
        experiences: day2Experiences,
        travelCost: day2TravelCost,
        accommodationCost: day2AccommodationCost,
        foodCost: day2FoodCost,
        estimatedCost: day2Cost,
        notes: `Travel to ${day2Location} for ${day2Experiences[0].title.toLowerCase()}`
      });
      
      remainingBudget -= day2Cost;
      currentLocation = day2Location;
    }
    
    // Day 3: Cultural experience and departure
    if (days >= 3) {
      let day3Experiences: Experience[] = [];
      let day3Location = "Jorhat";
      let day3TravelCost = 0;
      
      if (budget >= 20000) {
        // High budget: Majuli Island
        day3Experiences = [assamExperiences[3]]; // Majuli
        day3Location = "Jorhat";
        day3TravelCost = travelCosts[`${currentLocation}-Jorhat`] || 1000;
      } else {
        // Medium/Low budget: Tea garden or local experience
        day3Experiences = [assamExperiences[6]]; // Tea Garden
        day3Location = "Jorhat";
        day3TravelCost = travelCosts[`${currentLocation}-Jorhat`] || 1000;
      }
      
      const day3FoodCost = foodCosts.budget;
      const day3Cost = day3Experiences.reduce((sum, exp) => sum + exp.estimatedCost, 0) + day3FoodCost + day3TravelCost;
      
      itineraryDays.push({
        day: 3,
        title: t("day3") || `Day 3: Cultural Immersion & Departure`,
        location: day3Location,
        experiences: day3Experiences,
        travelCost: day3TravelCost,
        accommodationCost: 0, // No accommodation on last day
        foodCost: day3FoodCost,
        estimatedCost: day3Cost,
        notes: `Experience ${day3Experiences[0].title.toLowerCase()} before departure`
      });
      
      remainingBudget -= day3Cost;
    }
    
    // Additional days
    for (let i = 4; i <= days; i++) {
      const additionalExperiences = [assamExperiences[i % assamExperiences.length]];
      const dayCost = additionalExperiences.reduce((sum, exp) => sum + exp.estimatedCost, 0) + foodCosts.budget + (accommodationCosts[currentLocation] || 1500);
      
      itineraryDays.push({
        day: i,
        title: `Day ${i}: Additional Exploration`,
        location: currentLocation,
        experiences: additionalExperiences,
        travelCost: 0,
        accommodationCost: accommodationCosts[currentLocation] || 1500,
        foodCost: foodCosts.budget,
        estimatedCost: dayCost,
        notes: "Explore more local attractions"
      });
      
      remainingBudget -= dayCost;
    }
    
    const totalCost = budget - remainingBudget;
    const budgetUsed = (totalCost / budget) * 100;
    
    const recommendations = [
      remainingBudget > 2000 ? "Consider upgrading to premium dining experiences" : "Budget is well utilized",
      budget >= 15000 ? "You can afford additional cultural experiences" : "Focus on must-see attractions",
      "Book accommodations in advance for better rates",
      "Carry cash for rural areas and small vendors"
    ];
    
    return {
      days: itineraryDays,
      totalCost,
      budget,
      budgetUsed,
      recommendations
    };
  };

  const resetPlanner = () => {
    setBudget("");
    setDays("3");
    setNights("2");
    setItinerary(null);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-elevated)] hover:border-[var(--muted)]"
        aria-label="Plan itinerary"
        title="Create your travel itinerary"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="fixed right-4 top-20 z-50 w-[450px] max-h-[80vh] rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl overflow-hidden">
          <div className="p-4 max-h-[80vh] overflow-y-auto">
            <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
              {t("planItinerary") || "Plan Your Assam Itinerary"}
            </h3>
            
            {!itinerary ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                    {t("budget") || "Budget (₹)"}
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="10000"
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-warm)]"
                  />
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Recommended: ₹8,000-₹25,000 for 3 days
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                      {t("days") || "Days"}
                    </label>
                    <select
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-warm)]"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                      {t("nights") || "Nights"}
                    </label>
                    <select
                      value={nights}
                      onChange={(e) => setNights(e.target.value)}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-warm)]"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={generateItinerary}
                  disabled={!budget || isGenerating}
                  className="w-full rounded-lg bg-[var(--accent-warm)] px-4 py-2 text-white transition-colors hover:bg-[var(--accent-warm)]/90 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {t("generating") || "Generating..."}
                    </span>
                  ) : (
                    t("generatePlan") || "Generate Itinerary"
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-[var(--foreground)]">
                      {t("yourItinerary") || "Your Assam Itinerary"}
                    </h4>
                    <p className="text-sm text-[var(--muted)]">
                      {t("totalCost") || "Total Cost"}: ₹{itinerary.totalCost.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={resetPlanner}
                    className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    {t("newPlan") || "New Plan"}
                  </button>
                </div>
                
                <div className="max-h-[50vh] overflow-y-auto space-y-3">
                  {itinerary.days.map((day) => (
                    <div key={day.day} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                      <h5 className="mb-2 font-medium text-[var(--foreground)]">
                        {day.title}
                      </h5>
                      <p className="mb-2 text-xs text-[var(--muted)]">
                        📍 {day.location} • {day.notes}
                      </p>
                      <div className="space-y-2">
                        {day.experiences.map((exp, index) => (
                          <div key={index} className="flex items-start justify-between text-sm">
                            <div className="flex-1">
                              <p className="font-medium text-[var(--foreground)]">{exp.title}</p>
                              <p className="text-xs text-[var(--muted)]">{exp.description}</p>
                              <p className="text-xs text-[var(--muted)]">⏰ {exp.duration} • 🕐 {exp.bestTime}</p>
                            </div>
                            <div className="ml-2 text-right">
                              <p className="font-medium text-[var(--accent-warm)]">₹{exp.estimatedCost}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-[var(--border)]">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[var(--muted)]">Travel:</span>
                            <span className="ml-1 font-medium">₹{day.travelCost}</span>
                          </div>
                          <div>
                            <span className="text-[var(--muted)]">Food:</span>
                            <span className="ml-1 font-medium">₹{day.foodCost}</span>
                          </div>
                          {day.accommodationCost > 0 && (
                            <div>
                              <span className="text-[var(--muted)]">Stay:</span>
                              <span className="ml-1 font-medium">₹{day.accommodationCost}</span>
                            </div>
                          )}
                          <div className="col-span-2">
                            <span className="text-[var(--muted)]">{t("dayCost") || "Day Total"}:</span>
                            <span className="ml-1 font-bold text-[var(--accent-warm)]">₹{day.estimatedCost.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="rounded-lg bg-[var(--surface-elevated)] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[var(--foreground)]">
                      {t("budgetUsed") || "Budget Used"}
                    </span>
                    <span className="font-bold text-[var(--accent-warm)]">
                      {itinerary.budgetUsed.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--border)]">
                    <div
                      className="h-2 rounded-full bg-[var(--accent-warm)]"
                      style={{ width: `${Math.min(itinerary.budgetUsed, 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-[var(--muted)]">
                    <p>💡 {itinerary.recommendations[0]}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
