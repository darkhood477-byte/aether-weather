import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { generateFallbackData } from "./src/mockWeather.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lazy initialization of Gemini client to prevent crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Define weather response schema structure
const weatherResponseSchema = {
  type: Type.OBJECT,
  properties: {
    city: { type: Type.STRING },
    country: { type: Type.STRING },
    temperatureC: { type: Type.NUMBER },
    temperatureF: { type: Type.NUMBER },
    condition: { type: Type.STRING },
    conditionIcon: { type: Type.STRING }, // 'sunny' | 'cloudy' | 'sunset' | 'moon' | 'rain' | 'thunderstorm' | 'fog'
    highC: { type: Type.NUMBER },
    lowC: { type: Type.NUMBER },
    highF: { type: Type.NUMBER },
    lowF: { type: Type.NUMBER },
    
    sunrise: { type: Type.STRING },
    sunset: { type: Type.STRING },
    sunsetTimeRemaining: { type: Type.STRING },
    solarCycleProgress: { type: Type.NUMBER }, // 0 to 1
    
    windSpeedKmh: { type: Type.NUMBER },
    windSpeedMph: { type: Type.NUMBER },
    windDirection: { type: Type.STRING },
    humidity: { type: Type.NUMBER },
    uvIndexValue: { type: Type.NUMBER },
    uvIndexLevel: { type: Type.STRING },
    airQualityValue: { type: Type.NUMBER },
    airQualityStatus: { type: Type.STRING },
    visibilityMi: { type: Type.NUMBER },
    visibilityKm: { type: Type.NUMBER },
    stargazingRating: { type: Type.STRING }, // "Optimal" | "Good" | "Fair" | "Poor"
    stargazingReason: { type: Type.STRING },

    moonPhaseName: { type: Type.STRING },
    moonIllumination: { type: Type.NUMBER }, // 0 to 100
    moonrise: { type: Type.STRING },
    moonset: { type: Type.STRING },

    hourlyForecast: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING },
          tempC: { type: Type.NUMBER },
          tempF: { type: Type.NUMBER },
          condition: { type: Type.STRING },
          icon: { type: Type.STRING } // 'sunny' | 'cloudy' | 'sunset' | 'moon' | 'rain' | 'thunderstorm' | 'fog'
        },
        required: ["time", "tempC", "tempF", "condition", "icon"]
      }
    },

    currentCelestialEvent: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        tag: { type: Type.STRING },
        countdown: { type: Type.STRING },
        bestTime: { type: Type.STRING },
        direction: { type: Type.STRING },
        rate: { type: Type.STRING },
        description: { type: Type.STRING }
      },
      required: ["name", "tag", "countdown", "bestTime", "direction", "rate", "description"]
    },

    upcomingEvents: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          date: { type: Type.STRING },
          type: { type: Type.STRING } // 'moon' | 'meteor' | 'planet' | 'eclipse'
        },
        required: ["name", "date", "type"]
      }
    }
  },
  required: [
    "city", "country", "temperatureC", "temperatureF", "condition", "conditionIcon",
    "highC", "lowC", "highF", "lowF", "sunrise", "sunset", "sunsetTimeRemaining", "solarCycleProgress",
    "windSpeedKmh", "windSpeedMph", "windDirection", "humidity", "uvIndexValue", "uvIndexLevel",
    "airQualityValue", "airQualityStatus", "visibilityMi", "visibilityKm", "stargazingRating", "stargazingReason",
    "moonPhaseName", "moonIllumination", "moonrise", "moonset", "hourlyForecast", "currentCelestialEvent", "upcomingEvents"
  ]
};

// API routes FIRST
app.get("/api/weather", async (req, res) => {
  const cityQuery = req.query.city?.toString() || "San Francisco";
  const client = getGeminiClient();

  if (!client) {
    console.log("No valid API Key detected. Falling back to structured mock data.");
    const fallback = generateFallbackData(cityQuery);
    return res.json(fallback);
  }

  try {
    const prompt = `You are Aether, an expert meteorologist and stellar astrophysicist. 
Generate a beautifully precise, fully complete dark-mode weather and astronomical forecast for the city of "${cityQuery}" on today's date (${new Date().toLocaleDateString()}). 
Calculate:
1. Current local temperature (Celsius/Fahrenheit), condition description (e.g. "Active Aurora Borealis", "Chilly Overcast", "Mostly Clear (Golden Hour)"), matching icon type (from 'sunny', 'cloudy', 'sunset', 'moon', 'rain', 'thunderstorm', 'fog').
2. Accurate sunset and sunrise times, calculated time remaining or elapsed for the sunset, and an estimated solarCycleProgress value from 0 to 1 representing the current position of the sun along its daylight arc.
3. Weather metrics (wind, humidity, visibility, air quality, UV index).
4. Stargazing index rating ("Optimal", "Good", "Fair", "Poor") with a poetic and scientifically accurate reason based on cloud cover, moon illumination, and light pollution.
5. Accurate current Moon phase details (phase name, exact percentage illumination, moonrise, moonset).
6. Hourly forecast (Now, +1h, +2h, +3h, +4h, +5h) with temps and conditions.
7. An active or upcoming cosmic spectacle (e.g. Perseid Meteor Shower, planetary opposition, lunar conjunction) with viewing parameters (best viewing time, compass direction to look at, zenith hourly rate, and description).
8. A list of 3 upcoming beautiful celestial events for this month.

Ensure all numerical calculations make perfect logical sense (e.g. low temp is lower than current and high, humidity is 0-100, air quality index is reasonable).`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: weatherResponseSchema,
        temperature: 0.2,
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text.trim());
      return res.json(data);
    } else {
      throw new Error("Empty response from Gemini API");
    }
  } catch (error) {
    console.error("Gemini API weather generation failed, falling back to mock data:", error);
    const fallback = generateFallbackData(cityQuery);
    return res.json(fallback);
  }
});

// Configure Vite or Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aether full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
