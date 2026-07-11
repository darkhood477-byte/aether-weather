export interface CelestialEvent {
  name: string;
  tag: string;
  countdown: string;
  bestTime: string;
  direction: string;
  rate: string;
  description: string;
}

export interface HourlyForecastItem {
  time: string;
  tempC: number;
  tempF: number;
  condition: string;
  icon: string; // 'sunny' | 'cloudy' | 'sunset' | 'moon' | 'rain' | 'thunderstorm' | 'fog'
}

export interface UpcomingEvent {
  name: string;
  date: string;
  type: 'moon' | 'meteor' | 'planet' | 'eclipse';
}

export interface WeatherData {
  city: string;
  country: string;
  temperatureC: number;
  temperatureF: number;
  condition: string;
  conditionIcon: string; // 'sunny' | 'cloudy' | 'sunset' | 'moon' | 'rain' | 'thunderstorm' | 'fog'
  highC: number;
  lowC: number;
  highF: number;
  lowF: number;
  
  // Sunset & Sunrise
  sunrise: string;
  sunset: string;
  sunsetTimeRemaining: string;
  solarCycleProgress: number; // 0 to 1
  
  // Secondary metrics
  windSpeedKmh: number;
  windSpeedMph: number;
  windDirection: string;
  humidity: number;
  uvIndexValue: number;
  uvIndexLevel: string;
  airQualityValue: number;
  airQualityStatus: string;
  visibilityMi: number;
  visibilityKm: number;
  stargazingRating: 'Optimal' | 'Good' | 'Fair' | 'Poor';
  stargazingReason: string;

  // Lunar details
  moonPhaseName: string;
  moonIllumination: number; // 0 to 100
  moonrise: string;
  moonset: string;

  // Forecasts & Events
  hourlyForecast: HourlyForecastItem[];
  currentCelestialEvent: CelestialEvent;
  upcomingEvents: UpcomingEvent[];
}

export interface UserProfile {
  name: string;
  location: string;
  bio: string;
  avatarUrl: string;
  observationsCount: number;
  loggedEventsCount: number;
}
