import { WeatherData } from "./types";

export const mockCities: Record<string, WeatherData> = {
  "san francisco": {
    city: "San Francisco",
    country: "United States",
    temperatureC: 22,
    temperatureF: 72,
    condition: "Mostly Clear (Golden Hour)",
    conditionIcon: "sunset",
    highC: 24,
    lowC: 14,
    highF: 75,
    lowF: 57,
    sunrise: "06:12 AM",
    sunset: "07:42 PM",
    sunsetTimeRemaining: "in 2h 15m",
    solarCycleProgress: 0.65,
    windSpeedKmh: 12,
    windSpeedMph: 7.5,
    windDirection: "WNW",
    humidity: 45,
    uvIndexValue: 2,
    uvIndexLevel: "Low",
    airQualityValue: 42,
    airQualityStatus: "Good",
    visibilityMi: 10,
    visibilityKm: 16,
    stargazingRating: "Good",
    stargazingReason: "Clear horizon with a minor coastal mist arriving around midnight.",
    moonPhaseName: "Waning Gibbous",
    moonIllumination: 85,
    moonrise: "09:44 PM",
    moonset: "08:12 AM",
    hourlyForecast: [
      { time: "Now", tempC: 22, tempF: 72, condition: "Mostly Clear", icon: "sunset" },
      { time: "8 PM", tempC: 18, tempF: 64, condition: "Clear", icon: "moon" },
      { time: "9 PM", tempC: 16, tempF: 61, condition: "Clear", icon: "moon" },
      { time: "10 PM", tempC: 15, tempF: 59, condition: "Foggy Mist", icon: "fog" },
      { time: "11 PM", tempC: 14, tempF: 57, condition: "Overcast Mist", icon: "cloudy" },
      { time: "12 AM", tempC: 14, tempF: 57, condition: "Foggy", icon: "fog" }
    ],
    currentCelestialEvent: {
      name: "Perseid Meteor Shower",
      tag: "Celestial Event",
      countdown: "04d : 12h : 45m",
      bestTime: "2:00 AM - 4:00 AM",
      direction: "Northeast",
      rate: "60-100 / hr",
      description: "One of the brightest and most spectacular meteor showers of the year, peaking with bright fireballs in the northeastern sky."
    },
    upcomingEvents: [
      { name: "Full Moon (Supermoon)", date: "Aug 19", type: "moon" },
      { name: "Saturn at Opposition", date: "Sep 08", type: "planet" },
      { name: "Partial Lunar Eclipse", date: "Sep 18", type: "eclipse" }
    ]
  },
  "reykjavik": {
    city: "Reykjavík",
    country: "Iceland",
    temperatureC: 8,
    temperatureF: 46,
    condition: "Active Aurora Borealis",
    conditionIcon: "moon",
    highC: 10,
    lowC: 4,
    highF: 50,
    lowF: 39,
    sunrise: "04:15 AM",
    sunset: "11:24 PM",
    sunsetTimeRemaining: "in 5h 15m",
    solarCycleProgress: 0.85,
    windSpeedKmh: 18,
    windSpeedMph: 11.2,
    windDirection: "N",
    humidity: 62,
    uvIndexValue: 1,
    uvIndexLevel: "Low",
    airQualityValue: 15,
    airQualityStatus: "Optimal",
    visibilityMi: 15,
    visibilityKm: 24,
    stargazingRating: "Optimal",
    stargazingReason: "High aurora activity index (KP 5) combined with crisp arctic air and clear polar skies.",
    moonPhaseName: "Waning Crescent",
    moonIllumination: 18,
    moonrise: "01:22 AM",
    moonset: "04:10 PM",
    hourlyForecast: [
      { time: "Now", tempC: 8, tempF: 46, condition: "Aurora Activity", icon: "moon" },
      { time: "8 PM", tempC: 7, tempF: 45, condition: "Clear Sky", icon: "moon" },
      { time: "9 PM", tempC: 6, tempF: 43, condition: "Active Aurora", icon: "moon" },
      { time: "10 PM", tempC: 5, tempF: 41, condition: "Vibrant Northern Lights", icon: "moon" },
      { time: "11 PM", tempC: 4, tempF: 39, condition: "Northern Lights", icon: "moon" },
      { time: "12 AM", tempC: 4, tempF: 39, condition: "Clear Cold", icon: "moon" }
    ],
    currentCelestialEvent: {
      name: "Aurora Borealis Surge",
      tag: "Geomagnetic Storm",
      countdown: "KP 5.4 Active Now",
      bestTime: "11:00 PM - 2:00 AM",
      direction: "North-Northwest",
      rate: "KP 5.4 Index",
      description: "A coronal mass ejection has triggered a strong geomagnetic storm, bringing mesmerizing green and purple curtains across the high latitudes."
    },
    upcomingEvents: [
      { name: "Orionid Meteor Shower", date: "Oct 21", type: "meteor" },
      { name: "Leonid Meteor Shower", date: "Nov 17", type: "meteor" },
      { name: "Geminid Meteor Shower", date: "Dec 14", type: "meteor" }
    ]
  },
  "tokyo": {
    city: "Tokyo",
    country: "Japan",
    temperatureC: 15,
    temperatureF: 59,
    condition: "Clear Night Sky",
    conditionIcon: "moon",
    highC: 18,
    lowC: 11,
    highF: 64,
    lowF: 52,
    sunrise: "04:52 AM",
    sunset: "06:38 PM",
    sunsetTimeRemaining: "3h ago",
    solarCycleProgress: 0.95,
    windSpeedKmh: 6,
    windSpeedMph: 3.7,
    windDirection: "E",
    humidity: 50,
    uvIndexValue: 0,
    uvIndexLevel: "Low",
    airQualityValue: 55,
    airQualityStatus: "Moderate",
    visibilityMi: 8,
    visibilityKm: 13,
    stargazingRating: "Fair",
    stargazingReason: "Clear atmospheric conditions, but urban light pollution decreases stellar visibility. Focus on bright planets.",
    moonPhaseName: "Waxing Gibbous",
    moonIllumination: 72,
    moonrise: "02:15 PM",
    moonset: "01:30 AM",
    hourlyForecast: [
      { time: "Now", tempC: 15, tempF: 59, condition: "Clear Night", icon: "moon" },
      { time: "8 PM", tempC: 14, tempF: 57, condition: "Clear Night", icon: "moon" },
      { time: "9 PM", tempC: 13, tempF: 55, condition: "Clear Night", icon: "moon" },
      { time: "10 PM", tempC: 12, tempF: 54, condition: "Mostly Clear", icon: "moon" },
      { time: "11 PM", tempC: 11, tempF: 52, condition: "Mostly Clear", icon: "moon" },
      { time: "12 AM", tempC: 11, tempF: 52, condition: "Clear Night", icon: "moon" }
    ],
    currentCelestialEvent: {
      name: "Conjunction of Moon & Jupiter",
      tag: "Conjunction",
      countdown: "Ongoing Tonight",
      bestTime: "8:00 PM - 11:00 PM",
      direction: "South-Southeast",
      rate: "Angle 2.4°",
      description: "Jupiter appears exceptionally close to the Waxing Gibbous Moon tonight, forming a brilliant cosmic duo visible to the naked eye."
    },
    upcomingEvents: [
      { name: "Supermoon Phase", date: "Sep 18", type: "moon" },
      { name: "Hunter's Moon", date: "Oct 17", type: "moon" },
      { name: "Uranus at Opposition", date: "Nov 17", type: "planet" }
    ]
  }
};

export function generateFallbackData(cityQuery: string): WeatherData {
  const query = cityQuery.toLowerCase().trim();
  const matchedKey = Object.keys(mockCities).find(key => query.includes(key) || key.includes(query));
  
  if (matchedKey) {
    return mockCities[matchedKey];
  }

  // Synthesize realistic data for an unknown city based on string hashing
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    hash = query.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const formattedCity = cityQuery.charAt(0).toUpperCase() + cityQuery.slice(1);
  const isCold = hash % 3 === 0;
  const isHot = hash % 5 === 0;
  
  let temperatureC = 18 + (hash % 12);
  let condition = "Mostly Clear";
  let conditionIcon = "sunny";
  let stargazingRating: "Optimal" | "Good" | "Fair" | "Poor" = "Good";

  if (isCold) {
    temperatureC = 2 + (hash % 8);
    condition = "Chilly Overcast";
    conditionIcon = "cloudy";
    stargazingRating = "Fair";
  } else if (isHot) {
    temperatureC = 28 + (hash % 10);
    condition = "Warm Desert Clear";
    conditionIcon = "sunny";
    stargazingRating = "Optimal";
  }

  const temperatureF = Math.round((temperatureC * 9/5) + 32);
  const highC = temperatureC + 3;
  const lowC = temperatureC - 4;
  const highF = Math.round((highC * 9/5) + 32);
  const lowF = Math.round((lowC * 9/5) + 32);

  const hourProgress = (hash % 12) / 12;
  const sunsetHour = 6 + (hash % 3); // 6 PM to 8 PM
  const sunsetMinute = hash % 60;
  const sunsetStr = `${sunsetHour}:${sunsetMinute.toString().padStart(2, "0")} PM`;

  return {
    city: formattedCity,
    country: hash % 2 === 0 ? "Global Region" : "International Territory",
    temperatureC,
    temperatureF,
    condition,
    conditionIcon,
    highC,
    lowC,
    highF,
    lowF,
    sunrise: "05:48 AM",
    sunset: sunsetStr,
    sunsetTimeRemaining: `in ${Math.floor(hourProgress * 4) + 1}h ${hash % 60}m`,
    solarCycleProgress: 0.5 + (hourProgress * 0.4),
    windSpeedKmh: 8 + (hash % 20),
    windSpeedMph: Math.round((8 + (hash % 20)) * 0.621371),
    windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][hash % 8],
    humidity: 30 + (hash % 50),
    uvIndexValue: hash % 10,
    uvIndexLevel: (hash % 10) < 3 ? "Low" : (hash % 10) < 6 ? "Moderate" : "High",
    airQualityValue: 25 + (hash % 80),
    airQualityStatus: (25 + (hash % 80)) < 50 ? "Good" : "Moderate",
    visibilityMi: 8 + (hash % 5),
    visibilityKm: Math.round((8 + (hash % 5)) * 1.60934),
    stargazingRating,
    stargazingReason: stargazingRating === "Optimal" 
      ? "Exceptional atmospheric transparency with negligible light pollution."
      : "Average night sky visibility, suitable for observing bright constellations and passing satellites.",
    moonPhaseName: ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Third Quarter", "Waning Crescent"][hash % 8],
    moonIllumination: hash % 100,
    moonrise: "07:15 PM",
    moonset: "06:30 AM",
    hourlyForecast: Array.from({ length: 6 }).map((_, index) => {
      const forecastHour = (8 + index) % 12 || 12;
      const ampm = (8 + index) >= 12 ? "PM" : "AM";
      const fcTempC = temperatureC - index;
      return {
        time: index === 0 ? "Now" : `${forecastHour} ${ampm}`,
        tempC: fcTempC,
        tempF: Math.round((fcTempC * 9/5) + 32),
        condition: index % 2 === 0 ? condition : "Clear",
        icon: index % 2 === 0 ? conditionIcon : "moon"
      };
    }),
    currentCelestialEvent: {
      name: "Cosmic Satellite Transit",
      tag: "Orbital Transit",
      countdown: "Passing Soon",
      bestTime: "9:30 PM - 10:15 PM",
      direction: "Southwest to Northeast",
      rate: "Magnitude -1.8",
      description: "A beautiful, visible bright pass of the orbital space habitat, shining like a steady star sliding quietly through the constellations."
    },
    upcomingEvents: [
      { name: "Meteor Rain", date: "Next Week", type: "meteor" },
      { name: "Supermoon", date: "In 12 Days", type: "moon" },
      { name: "Planetary Alignment", date: "In 3 Weeks", type: "planet" }
    ]
  };
}
