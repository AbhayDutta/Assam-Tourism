"use client";

import React, { createContext, useContext, useState } from "react";

export type Language = "en" | "hi" | "as" | "ta";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    appTitle: "Aloukik Axom",
    appSubtitle: "Discover Assam's rich cultural heritage",
    appDescription: "Explore festivals, cuisine, crafts, and heritage sites across districts. Each experience is a window into Assam's rich cultural tapestry.",
    allDistricts: "All Districts",
    discover: "Discover",
    loading: "Loading...",
    error: "Something went wrong. Please try again later.",
    festivals: "Festivals",
    cuisine: "Cuisine", 
    crafts: "Crafts",
    heritage: "Heritage",
    folkArt: "Folk Art",
    learnMore: "Learn More",
    contribute: "Contribute Experience",
    backToMap: "Back to Map",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    language: "Language",
    planItinerary: "Plan Your Itinerary",
    budget: "Budget (₹)",
    days: "Days",
    nights: "Nights",
    generatePlan: "Generate Itinerary",
    generating: "Generating...",
    yourItinerary: "Your Itinerary",
    totalCost: "Total Cost",
    newPlan: "New Plan",
    day1: "Day 1: Arrival & Guwahati Exploration",
    day2: "Day 2: Cultural Immersion",
    day3: "Day 3: Nature & Departure",
    dayCost: "Day Cost",
    budgetUsed: "Budget Used"
  },
  hi: {
    appTitle: "आलोकिक असम",
    appSubtitle: "असम की समृद्ध सांस्कृतिक विरासा की खोज करें",
    appDescription: "जिलों में त्योहार, व्यंजन, शिल्प और विरासा स्थलों का अन्वेषण करें। प्रत्येक अनुभव असम की समृद्ध सांस्कृतिक टेपेस्ट्री की एक खिड़की है।",
    allDistricts: "सभी जिले",
    discover: "खोजें",
    loading: "लोड हो रहा है...",
    error: "कुछ गलत हुई। कृपया बाद में फिर से कोशिश करें।",
    festivals: "त्योहार",
    cuisine: "व्यंजन",
    crafts: "शिल्प", 
    heritage: "विरासा",
    folkArt: "लोक कला",
    learnMore: "और जानें",
    contribute: "अनुभव जोड़ें",
    backToMap: "नक्शे पर वापस",
    darkMode: "डार्क मोड",
    lightMode: "लाइट मोड",
    language: "भाषा",
    planItinerary: "अपनी यात्रा योजना बनाएं",
    budget: "बजट (₹)",
    days: "दिन",
    nights: "रातें",
    generatePlan: "यात्रा योजना बनाएं",
    generating: "बना रहे हैं...",
    yourItinerary: "आपकी यात्रा योजना",
    totalCost: "कुल लागत",
    newPlan: "नई योजना",
    day1: "दिन 1: आगमन और गुवाहाटी अन्वेषण",
    day2: "दिन 2: सांस्कृतिक निमज्जन",
    day3: "दिन 3: प्रकृति और प्रस्थान",
    dayCost: "दिन की लागत",
    budgetUsed: "उपयोग किया गया बजट"
  },
  as: {
    appTitle: "আলোকিক অসম",
    appSubtitle: "অসমৰ সমৃদ্ধ সাংস্কৃতিক ঐতিহ্যাস আৱিস্কোষণ কৰক",
    appDescription: "জিলাসমূহে উৎসৱ, খাদ্য, কাৰুকী আৰু বিৰাসাস্থল স্থানসমূহে অন্বেষণ কৰক। প্ৰত্যেক অনুভৱ অসমৰ সমৃদ্ধ সাংস্কৃতিক টেপেষ্ট্ৰীৰ এটা খিড়কী হয়।",
    allDistricts: "সকলো জিলা",
    discover: "আৱিস্কোষণ কৰক",
    loading: "ল'ড হৈ আছে...",
    error: "কিবা এটা ভুল হ'ল। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।",
    festivals: "উৎসৱ",
    cuisine: "খাদ্য",
    crafts: "কাৰুকী",
    heritage: "বিৰাসাস্থল",
    folkArt: "লোক কলা",
    learnMore: "অধিক জানক",
    contribute: "অনুভৱ যোগ কৰক",
    backToMap: "নক্সাল ভৰূপ যাওক",
    darkMode: "ডাক ম'ড",
    lightMode: "লাইট ম'ড",
    language: "ভাষা",
    planItinerary: "আপোনাৰ ভ্ৰমণ পৰিকল্পনা তৈয়াৰ কৰক",
    budget: "বাজেট (₹)",
    days: "দিন",
    nights: "ৰাতি",
    generatePlan: "ভ্ৰমণ পৰিকল্পনা তৈয়াৰ কৰক",
    generating: "তৈয়াৰ কৰি আছে...",
    yourItinerary: "আপোনাৰ ভ্ৰমণ পৰিকল্পনা",
    totalCost: "মুঠ খৰচ",
    newPlan: "নতুন পৰিকল্পনা",
    day1: "দিন ১: আগমন আৰু গুৱাহাটী অন্বেষণ",
    day2: "দিন ২: সাংস্কৃতিক নিমজ্জন",
    day3: "দিন ৩: প্ৰকৃতি আৰু প্ৰস্থান",
    dayCost: "দিনৰ খৰচ",
    budgetUsed: "ব্যৱহাৰ কৰা বাজেট"
  },
  ta: {
    appTitle: "அலௌகிக் அஸம்",
    appSubtitle: "அஸமின் வளமையான பண்பாட்டு கலாச்சால் மரமபிக்களைக் கண்டுபிடிக்கள்",
    appDescription: "மாவட்டுகளில் திருவிழாக்கள், உணவு, கைவினைலை மற்றும் பாரம்பரியல் இடங்களை ஆராய்வுங்கள். ஒவ்வொரு அனுபவம் அஸமின் வளமையான பண்பாட்டு கலாச்சால் டேப்பஸ்ட்ரியின் ஒரு ஜன்னலாகும்.",
    allDistricts: "அனைத்து மாவட்டுகள்",
    discover: "கண்டுபிடிக்கள்",
    loading: "ஏற்றுகிறது கொண்டுகிறது...",
    error: "ஏதோ தவறு நேர்ந்தது. தயவு செய்து மீண்டும் முயற்சுங்கள்.",
    festivals: "திருவிழாக்கள்",
    cuisine: "உணவு",
    crafts: "கைவினைலை",
    heritage: "பாரம்பரியல் இடங்கள்",
    folkArt: "நாட்டுக் கலை",
    learnMore: "மேலும் அறிந்து கொள்ளுங்கள்",
    contribute: "அனுபவத்தை சேர்க்கள்",
    backToMap: "வரைப்படத்திற்கு செல்லுங்கள்",
    darkMode: "இருண்டு நிலை",
    lightMode: "வெளிளி நிலை",
    language: "மொழி",
    planItinerary: "உங்கள் பயண திட்டமிடல்",
    budget: "பட்ஜெட் (₹)",
    days: "நாட்கள்",
    nights: "இரவுகள்",
    generatePlan: "பயண திட்டம் உருவாக்கு",
    generating: "உருவாக்குகிறது...",
    yourItinerary: "உங்கள் பயண திட்டம்",
    totalCost: "மொத்த செலவு",
    newPlan: "புதிய திட்டம்",
    day1: "நாள் 1: வருகை மற்றும் குவாஹாட்டி ஆய்வு",
    day2: "நாள் 2: பண்பாட்டு அமிர்பணம்",
    day3: "நாள் 3: இயற்கை மற்றும் புறப்பாடு",
    dayCost: "நாள் செலவு",
    budgetUsed: "பயன்படுத்தப்பட்ட பட்ஜெட்"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("language") as Language;
      return (saved && ["en", "hi", "as", "ta"].includes(saved)) ? saved : "en";
    }
    return "en";
  });

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const value = {
    language,
    setLanguage: handleLanguageChange,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
