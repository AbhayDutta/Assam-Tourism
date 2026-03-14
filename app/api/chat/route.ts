import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ASSAM_KNOWLEDGE_BASE = {
  festivals: {
    bihu: "Bihu is the most important festival of Assam, celebrated three times a year - Rongali Bihu in April, Kati Bihu in October, and Magh Bihu in January. It marks the Assamese New Year and celebrates the harvest season.",
    durga_puja: "Durga Puja is celebrated with great enthusiasm, especially in Guwahati and other urban areas. It's a five-day festival honoring Goddess Durga.",
    ambubachi: "Ambubachi Mela is held at Kamakhya Temple in Guwahati, celebrating the goddess's annual menstrual cycle. It's one of the largest religious gatherings in Northeast India.",
  },
  places: {
    guwahati: "Guwahati is the gateway to Northeast India. Key attractions include Kamakhya Temple, Umananda Island, Assam State Museum, and the Brahmaputra riverfront.",
    kaziranga: "Kaziranga National Park is a UNESCO World Heritage Site famous for its one-horned rhinoceros. It's also home to tigers, elephants, and various bird species.",
    majuli: "Majuli is the world's largest river island, known for its Vaishnavite satras (monasteries), mask-making, and vibrant cultural heritage.",
    sivasagar: "Sivasagar was the capital of the Ahom kingdom. Famous for Rang Ghar, Kareng Ghar, and Talatal Ghar - architectural marvels of the Ahom dynasty.",
  },
  culture: {
    cuisine: "Assamese cuisine is known for its subtle flavors. Must-try dishes include masor tenga (sour fish curry), aloo pitika, pitha, and various preparations of bamboo shoots.",
    crafts: "Assam is famous for silk weaving - Muga (golden silk), Eri, and Pat silk. Other crafts include bell metal work, bamboo crafts, and mask making from Majuli.",
    music: "Bihu geet, Borgeet, and folk songs are integral to Assamese culture. Traditional instruments include dhol, pepa, and gagana.",
  },
  tourism: {
    best_time: "The best time to visit Assam is from October to April when the weather is pleasant. For wildlife viewing, November to March is ideal.",
    transportation: "Guwahati has an international airport and is well-connected by rail and road. Major cities have good road connectivity.",
    contribution: "You can contribute your experiences by clicking the 'Contribute' button on our website. Share local cultural events, traditions, or hidden gems from your area.",
  }
};

function getContextualResponse(message: string, conversationHistory: ChatMessage[] = []): string {
  const lowerMessage = message.toLowerCase().trim();
  const lastBotResponse = conversationHistory.filter(m => m.role === 'assistant').pop();
  
  // Check for follow-up questions
  if (lastBotResponse && (
    lowerMessage.includes('tell me more') ||
    lowerMessage.includes('what about') ||
    lowerMessage.includes('explain') ||
    lowerMessage.includes('details') ||
    lowerMessage.includes('elaborate')
  )) {
    if (lastBotResponse.content.includes('Bihu')) {
      return "Bihu has three forms: Rongali Bihu (April) celebrates spring, Kati Bihu (October) is for crop protection, and Magh Bihu (January) marks harvest. Each has unique customs - people wear traditional muga silk, perform Bihu dance, and enjoy pitha (rice cakes). The dhol (drum) and pepa (buffalo horn pipe) are essential instruments.";
    }
    if (lastBotResponse.content.includes('Guwahati')) {
      return "Guwahati offers more! Visit Umananda Island (world's smallest river island), enjoy sunset cruises on Brahmaputra, explore Assam State Zoo, shop for traditional crafts at Fancy Bazaar, and try authentic Assamese food at Paradise Restaurant. The city blends modern amenities with ancient culture perfectly.";
    }
  }
  
  // Enhanced greeting with context awareness
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaskar') || lowerMessage === 'hi' || lowerMessage === 'hello') {
    if (conversationHistory.length > 2) {
      return "🙏 Welcome back! It's great to chat with you again about Assam. What would you like to explore today? I can help with festivals, destinations, culture, or travel tips.";
    }
    return "🙏 Namaskar! Welcome to Aloukik Axom! I'm your virtual guide to Assam's rich cultural heritage. I can help you discover festivals, tourist destinations, local cuisine, traditional crafts, and travel information. What interests you most about our beautiful state?";
  }
  
  // Festival queries with enhanced responses
  if (lowerMessage.includes('festival') || lowerMessage.includes('bihu') || lowerMessage.includes('celebration')) {
    if (lowerMessage.includes('bihu')) {
      return ASSAM_KNOWLEDGE_BASE.festivals.bihu;
    }
    if (lowerMessage.includes('durga') || lowerMessage.includes('puja')) {
      return ASSAM_KNOWLEDGE_BASE.festivals.durga_puja;
    }
    if (lowerMessage.includes('ambubachi') || lowerMessage.includes('kamakhya')) {
      return ASSAM_KNOWLEDGE_BASE.festivals.ambubachi;
    }
    return "Assam celebrates many vibrant festivals! 🎉 The most important is Bihu (celebrated 3 times yearly), followed by Durga Puja, Ambubachi Mela, and various tribal festivals. Each showcases unique traditions, music, and cuisine. Which specific festival would you like to know more about?";
  }
  
  // Place queries with travel tips
  if (lowerMessage.includes('guwahati') || lowerMessage.includes('place') || lowerMessage.includes('visit')) {
    if (lowerMessage.includes('guwahati')) {
      return ASSAM_KNOWLEDGE_BASE.places.guwahati;
    }
    if (lowerMessage.includes('kaziranga') || lowerMessage.includes('rhino')) {
      return ASSAM_KNOWLEDGE_BASE.places.kaziranga;
    }
    if (lowerMessage.includes('majuli') || lowerMessage.includes('island')) {
      return ASSAM_KNOWLEDGE_BASE.places.majuli;
    }
    if (lowerMessage.includes('sivasagar') || lowerMessage.includes('ahom')) {
      return ASSAM_KNOWLEDGE_BASE.places.sivasagar;
    }
    return "Assam has incredible destinations! 🌟 Top picks: Guwahati (cultural hub), Kaziranga (wildlife paradise), Majuli (cultural heartland), Sivasagar (historical treasures), and Tawang (spiritual gateway). Each offers unique experiences. What type of experience interests you - wildlife, culture, history, or spirituality?";
  }
  
  // Culture queries with practical details
  if (lowerMessage.includes('food') || lowerMessage.includes('cuisine') || lowerMessage.includes('eat')) {
    return ASSAM_KNOWLEDGE_BASE.culture.cuisine;
  }
  
  if (lowerMessage.includes('craft') || lowerMessage.includes('silk') || lowerMessage.includes('handloom')) {
    return ASSAM_KNOWLEDGE_BASE.culture.crafts;
  }
  
  if (lowerMessage.includes('music') || lowerMessage.includes('song') || lowerMessage.includes('dance')) {
    return ASSAM_KNOWLEDGE_BASE.culture.music;
  }
  
  // Tourism info with actionable advice
  if (lowerMessage.includes('best time') || lowerMessage.includes('when to visit') || lowerMessage.includes('weather')) {
    return ASSAM_KNOWLEDGE_BASE.tourism.best_time;
  }
  
  if (lowerMessage.includes('how to reach') || lowerMessage.includes('transport') || lowerMessage.includes('travel')) {
    return ASSAM_KNOWLEDGE_BASE.tourism.transportation;
  }
  
  if (lowerMessage.includes('contribute') || lowerMessage.includes('share') || lowerMessage.includes('add')) {
    return ASSAM_KNOWLEDGE_BASE.tourism.contribution;
  }
  
  // Enhanced general queries about Assam
  if (lowerMessage.includes('what is assam') || lowerMessage.includes('about assam') || lowerMessage.includes('famous for')) {
    return "🌍 Assam is Northeast India's gateway state, renowned for:\n\n🦏 One-horned rhinoceros at Kaziranga (UNESCO site)\n🍵 World-famous Assam tea gardens\n🎭 Rich cultural heritage (Ahom dynasty legacy)\n🌊 Mighty Brahmaputra River\n🧵 Muga silk (golden fabric unique to Assam)\n🎉 Bihu festival and vibrant traditions\n\nIt's a land where nature meets culture, offering everything from wildlife safaris to spiritual journeys. What aspect fascinates you most?";
  }
  
  // Enhanced help with specific examples
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return "I'm your Assam tourism expert! Here's how I can help:\n\n� **Festivals**: Bihu, Durga Puja, Ambubachi, tribal celebrations\n🏛️ **Destinations**: Guwahati, Kaziranga, Majuli, Sivasagar, Tawang\n🍽️ **Cuisine**: Traditional dishes, where to eat, local specialties\n🎨 **Culture**: Silk weaving, music, dance, handicrafts\n🗓️ **Planning**: Best time to visit, weather, transportation\n🤝 **Contribute**: Share your local experiences\n\nTry asking: 'What's special about Rongali Bihu?' or 'How do I reach Kaziranga?'";
  }
  
  // Smart fallback with suggestions
  return "I'd love to help you explore Assam! 🌟 Based on popular interests, you could ask about:\n\n• **Bihu festival** (Assam's most celebrated festival)\n• **Kaziranga National Park** (home of one-horned rhinos)\n• **Assamese cuisine** (try masor tenga or pitha)\n• **Muga silk** (Assam's golden treasure)\n• **Best travel season** (October to April)\n\nWhat specific aspect of Assam interests you most?";
}

function generateResponse(message: string, conversationHistory: ChatMessage[] = []): string {
  return getContextualResponse(message, conversationHistory);
}

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    const { message, conversationHistory } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Valid message is required' }, { status: 400 });
    }
    
    // Validate conversation history
    const validHistory = Array.isArray(conversationHistory) ? conversationHistory : [];
    
    const response = generateResponse(message.trim(), validHistory);
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json({ 
      response,
      processingTime: `${processingTime}ms`
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
