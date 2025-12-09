import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserPreferences, TripPlan } from "../types";

// Relaxed Schema to prevent validation errors and improve speed
const tripPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    destinationInfo: { type: Type.STRING },
    suggestedFlights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          airline: { type: Type.STRING },
          departureTime: { type: Type.STRING },
          arrivalTime: { type: Type.STRING },
          duration: { type: Type.STRING },
          price: { type: Type.STRING },
          bookingUrl: { type: Type.STRING },
        },
        // Reduced required fields to allow partial data
        required: ["airline", "price"]
      }
    },
    suggestedHotels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          location: { type: Type.STRING },
          rating: { type: Type.STRING },
          pricePerNight: { type: Type.STRING },
          features: { type: Type.ARRAY, items: { type: Type.STRING } },
          bookingUrl: { type: Type.STRING }
        },
        required: ["name", "rating", "pricePerNight"]
      }
    },
    transitOptions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          // Removed Enum to prevent validation strictness errors
          mode: { type: Type.STRING }, 
          provider: { type: Type.STRING },
          duration: { type: Type.STRING },
          cost: { type: Type.STRING },
          bookingLink: { type: Type.STRING },
          mapLink: { type: Type.STRING },
          description: { type: Type.STRING },
          tag: { type: Type.STRING }
        },
        required: ["mode", "duration", "cost"]
      }
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          theme: { type: Type.STRING },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                activity: { type: Type.STRING },
                description: { type: Type.STRING },
                location: { type: Type.STRING },
                timeSpent: { type: Type.STRING },
                costEstimate: { type: Type.STRING },
                bookingLink: { type: Type.STRING }
              },
              required: ["time", "activity"]
            },
          },
        },
      },
    },
    budget: {
      type: Type.OBJECT,
      properties: {
        transport: { type: Type.NUMBER },
        accommodation: { type: Type.NUMBER },
        food: { type: Type.NUMBER },
        activities: { type: Type.NUMBER },
        miscellaneous: { type: Type.NUMBER },
        total: { type: Type.NUMBER },
        currency: { type: Type.STRING },
      },
    },
    safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  // Removed strict top-level required fields to allow flexible generation
};

export const generateTripPlan = async (prefs: UserPreferences): Promise<TripPlan> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Optimized Logic:
  // 1. If user wants specific search (Flight/Hotel), fill ONLY that array.
  // 2. If 'trip', fill all.
  // 3. Keep counts reasonable (3-5 items) for speed.
  
  let instructions = "Provide a complete travel plan.";
  
  // OPTIMIZATION: Reduced counts to 3 for specific, 2 for mixed to speed up generation.
  if (prefs.searchType === 'flight') {
    instructions = "User wants FLIGHTS only. Populate 'suggestedFlights' (top 3). Leave other arrays empty.";
  } else if (prefs.searchType === 'hotel') {
    instructions = "User wants HOTELS only. Populate 'suggestedHotels' (top 3). Leave other arrays empty.";
  } else if (prefs.searchType === 'train') {
    instructions = "User wants TRAINS/BUS only. Populate 'transitOptions' (top 3). Leave others empty.";
  } else {
    // Full Trip
    if (prefs.transportMode === 'any') {
      instructions = "Full trip plan. Include 2 best flights, 2 best hotels, 2 best transit options, and day-wise itinerary.";
    } else {
       instructions = `Full trip plan focusing on ${prefs.transportMode} travel. In 'transitOptions', provide 2 ${prefs.transportMode} routes. Include 2 hotels and day-wise itinerary.`;
    }
  }

  const systemInstruction = `
    You are a smart, fast Travel Agent. 
    Generate a JSON response following the schema strictly.
    
    CONTEXT:
    Origin: ${prefs.origin || 'User Location'} -> Destination: ${prefs.destination}
    Mode: ${prefs.transportMode}
    Budget: ${prefs.budget}
    
    RULES:
    1. **Speed**: Keep descriptions very concise (max 10-15 words).
    2. **Booking Links**: Use real-looking URLs (e.g., https://www.google.com/travel/flights?q=...).
    3. **Currency**: INR (₹).
    4. **Safety**: Ensure JSON validity. Do not include markdown formatting like \`\`\`json.
    5. **Empty Data**: If a section isn't requested, return an empty array [].
    6. **Itinerary**: Limit to 2 main activities per day to save time.
    
    ${instructions}
  `;

  const userPrompt = `Generate plan for ${prefs.searchType} trip to ${prefs.destination}.`;

  const parts: any[] = [{ text: userPrompt }];

  if (prefs.image) {
    const base64Data = prefs.image.split(',')[1];
    const mimeType = prefs.image.split(';')[0].split(':')[1];
    parts.push({ inlineData: { mimeType, data: base64Data } });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: tripPlanSchema,
      },
    });

    let responseText = response.text;
    if (!responseText) throw new Error("AI returned empty response");

    // Clean up markdown if present (Flash sometimes adds it despite config)
    if (responseText.startsWith("```json")) {
        responseText = responseText.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (responseText.startsWith("```")) {
        responseText = responseText.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    const plan = JSON.parse(responseText) as TripPlan;
    
    // Client-side defaults to prevent crashes
    return {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        summary: plan.summary || `Trip to ${prefs.destination}`,
        destinationInfo: plan.destinationInfo || "",
        suggestedFlights: plan.suggestedFlights || [],
        suggestedHotels: plan.suggestedHotels || [],
        transitOptions: plan.transitOptions || [],
        itinerary: plan.itinerary || [],
        budget: plan.budget || { transport: 0, accommodation: 0, food: 0, activities: 0, miscellaneous: 0, total: 0, currency: "₹" },
        safetyTips: plan.safetyTips || ["Stay safe!", "Keep emergency numbers handy."],
        packingList: plan.packingList || [],
        alternatives: plan.alternatives || ""
    };

  } catch (error) {
    console.error("Trip Generation Error:", error);
    // Provide a fallback mock plan if AI fails completely, so user sees SOMETHING
    if (process.env.NODE_ENV === 'development') {
        console.warn("Returning fallback data due to error");
        return {
             id: "error-fallback",
             createdAt: Date.now(),
             summary: "We encountered a hiccup connecting to the AI, but here is a template for your trip to " + prefs.destination,
             destinationInfo: "Beautiful destination",
             suggestedFlights: [],
             suggestedHotels: [],
             transitOptions: [],
             itinerary: [],
             budget: { transport: 0, accommodation: 0, food: 0, activities: 0, miscellaneous: 0, total: 0, currency: "₹" },
             safetyTips: ["Please try searching again in a moment."],
             packingList: [],
             alternatives: ""
        };
    }
    throw new Error("Failed to generate plan. Please try again.");
  }
};