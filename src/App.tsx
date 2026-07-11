import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Settings,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Eye,
  Compass,
  Calendar,
  User,
  MapPin,
  Activity,
  Bell,
  ArrowLeft,
  Info,
  ChevronRight,
  Star,
  Zap,
  Sparkles,
  Clock,
  ArrowRight
} from "lucide-react";
import { WeatherData, UserProfile } from "./types";

// --- DYNAMIC CANVAS ATMOSPHERIC ANIMATOR ---
interface CanvasBackgroundProps {
  conditionType: string; // 'sunset' | 'aurora' | 'clear' | 'rain' | 'cloudy' | 'thunderstorm' | 'fog'
  isActive: boolean;
}

const AtmosphericCanvas: React.FC<CanvasBackgroundProps> = ({ conditionType, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle Classes
    class AmberParticle {
      x: number = Math.random() * width;
      y: number = height + Math.random() * 100;
      size: number = Math.random() * 3 + 1;
      speedY: number = -(Math.random() * 0.8 + 0.3);
      speedX: number = Math.sin(Math.random() * Math.PI * 2) * 0.3;
      opacity: number = Math.random() * 0.7 + 0.3;

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(Date.now() * 0.001 + this.size) * 0.1;
        if (this.y < -20) {
          this.y = height + 20;
          this.x = Math.random() * width;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = `rgba(249, 115, 22, ${this.opacity})`;
        c.shadowColor = "rgb(249, 115, 22)";
        c.shadowBlur = 10;
        c.fill();
        c.shadowBlur = 0;
      }
    }

    class AuroraCurtain {
      points: { x: number; y: number }[] = [];
      hue: number = 140; // Greenish-cyan
      amplitude: number = Math.random() * 40 + 30;
      frequency: number = Math.random() * 0.003 + 0.001;
      speed: number = Math.random() * 0.01 + 0.005;

      constructor(index: number) {
        this.hue = index % 2 === 0 ? 130 : 170; // alternate green and teal
        for (let x = 0; x <= width; x += 40) {
          this.points.push({ x, y: height * 0.3 + Math.sin(x * 0.005) * 50 });
        }
      }

      update() {
        const t = Date.now() * this.speed;
        this.points.forEach((p, idx) => {
          p.y = height * 0.25 + Math.sin(p.x * 0.002 + t) * this.amplitude + Math.cos(p.x * 0.001 - t * 0.5) * 20;
        });
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
          const xc = (this.points[i - 1].x + this.points[i].x) / 2;
          const yc = (this.points[i - 1].y + this.points[i].y) / 2;
          c.quadraticCurveTo(this.points[i - 1].x, this.points[i - 1].y, xc, yc);
        }

        // Draw deep glowing vertical strokes using linear gradient
        const grad = c.createLinearGradient(0, height * 0.1, 0, height * 0.55);
        grad.addColorStop(0, `rgba(${this.hue === 130 ? '34, 197, 94' : '6, 182, 212'}, 0)`);
        grad.addColorStop(0.3, `rgba(${this.hue === 130 ? '34, 197, 94' : '6, 182, 212'}, 0.15)`);
        grad.addColorStop(0.6, `rgba(${this.hue === 130 ? '34, 197, 94' : '6, 182, 212'}, 0.05)`);
        grad.addColorStop(1, `rgba(${this.hue === 130 ? '34, 197, 94' : '6, 182, 212'}, 0)`);

        c.lineTo(width, height);
        c.lineTo(0, height);
        c.fillStyle = grad;
        c.fill();
      }
    }

    class RainStreak {
      x: number = Math.random() * width;
      y: number = Math.random() * -height;
      length: number = Math.random() * 20 + 10;
      speed: number = Math.random() * 12 + 8;
      opacity: number = Math.random() * 0.3 + 0.1;

      update() {
        this.y += this.speed;
        this.x += 1; // slight slant
        if (this.y > height) {
          this.y = -50;
          this.x = Math.random() * width;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x + 1, this.y + this.length);
        c.strokeStyle = `rgba(123, 208, 255, ${this.opacity})`;
        c.lineWidth = 1;
        c.stroke();
      }
    }

    class Star {
      x: number = Math.random() * width;
      y: number = Math.random() * (height * 0.6);
      size: number = Math.random() * 1.5 + 0.5;
      alpha: number = Math.random();
      speed: number = Math.random() * 0.02 + 0.005;

      update() {
        this.alpha += this.speed;
        if (this.alpha > 1 || this.alpha < 0) {
          this.speed = -this.speed;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, this.alpha))})`;
        c.fill();
      }
    }

    class ShootingStar {
      x: number = 0;
      y: number = 0;
      length: number = 0;
      speedX: number = 0;
      speedY: number = 0;
      active: boolean = false;
      timer: number = 0;

      trigger() {
        this.x = Math.random() * (width * 0.6);
        this.y = Math.random() * (height * 0.3);
        this.length = Math.random() * 80 + 40;
        this.speedX = Math.random() * 5 + 4;
        this.speedY = Math.random() * 2 + 1.5;
        this.active = true;
        this.timer = 0;
      }

      update() {
        if (!this.active) {
          if (Math.random() < 0.003) this.trigger();
          return;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        this.timer++;
        if (this.timer > 35 || this.x > width || this.y > height) {
          this.active = false;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        if (!this.active) return;
        const grad = c.createLinearGradient(this.x, this.y, this.x - this.length, this.y - this.length * 0.3);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x - this.length, this.y - this.length * 0.3);
        c.strokeStyle = grad;
        c.lineWidth = 1.5;
        c.stroke();
      }
    }

    class FogDrift {
      x: number = Math.random() * width;
      y: number = Math.random() * height;
      radius: number = Math.random() * 100 + 100;
      dx: number = Math.random() * 0.3 - 0.15;
      opacity: number = Math.random() * 0.04 + 0.01;

      update() {
        this.x += this.dx;
        if (this.x - this.radius > width) this.x = -this.radius;
        if (this.x + this.radius < 0) this.x = width + this.radius;
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        const grad = c.createRadialGradient(this.x, this.y, 10, this.x, this.y, this.radius);
        grad.addColorStop(0, `rgba(203, 195, 215, ${this.opacity})`);
        grad.addColorStop(1, "rgba(203, 195, 215, 0)");
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = grad;
        c.fill();
      }
    }

    // Initialize appropriate particle arrays
    const ambers: AmberParticle[] = Array.from({ length: 40 }).map(() => new AmberParticle());
    const auroras: AuroraCurtain[] = Array.from({ length: 3 }).map((_, i) => new AuroraCurtain(i));
    const rain: RainStreak[] = Array.from({ length: 80 }).map(() => new RainStreak());
    const stars: Star[] = Array.from({ length: 60 }).map(() => new Star());
    const shootingStar = new ShootingStar();
    const fogClusters: FogDrift[] = Array.from({ length: 15 }).map(() => new FogDrift());

    // Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (conditionType === "sunset") {
        ambers.forEach((p) => {
          p.update();
          p.draw(ctx);
        });
      } else if (conditionType === "aurora") {
        auroras.forEach((c) => {
          c.update();
          c.draw(ctx);
        });
      } else if (conditionType === "rain" || conditionType === "thunderstorm") {
        rain.forEach((r) => {
          r.update();
          r.draw(ctx);
        });
      } else if (conditionType === "clear" || conditionType === "moon" || conditionType === "sunny") {
        stars.forEach((s) => {
          s.update();
          s.draw(ctx);
        });
        shootingStar.update();
        shootingStar.draw(ctx);
      } else if (conditionType === "cloudy" || conditionType === "fog") {
        fogClusters.forEach((f) => {
          f.update();
          f.draw(ctx);
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [conditionType, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen opacity-75"
    />
  );
};

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState<"weather" | "astronomy" | "events" | "profile">("weather");
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [isAtmosphericGlow, setIsAtmosphericGlow] = useState<boolean>(true);
  
  // Search parameters
  const [cityInput, setCityInput] = useState<string>("");
  const [currentCity, setCurrentCity] = useState<string>("San Francisco");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Toast Alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile data
  const [profile, setProfile] = useState<UserProfile>({
    name: "Dr. Elena Rostova",
    location: "Reykjavík, Iceland",
    bio: "Meteorologist & Aurora Chaser. Observing the intersection of atmospheric phenomena and cosmic events.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
    observationsCount: 1204,
    loggedEventsCount: 42
  });

  // Fetch Weather Data
  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
      if (!response.ok) {
        throw new Error("Failed to capture meteorology stream");
      }
      const data: WeatherData = await response.json();
      setWeatherData(data);
      setCurrentCity(data.city);
    } catch (err: any) {
      console.error(err);
      setError("Failed to synchronize with astronomical satellite");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(currentCity);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      fetchWeatherData(cityInput.trim());
      setCityInput("");
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Determine standard background type from weather condition icon
  const getAtmosphereType = () => {
    if (!weatherData) return "clear";
    const icon = weatherData.conditionIcon.toLowerCase();
    if (icon.includes("sunset") || weatherData.condition.toLowerCase().includes("golden hour")) return "sunset";
    if (weatherData.condition.toLowerCase().includes("aurora") || weatherData.condition.toLowerCase().includes("northern lights")) return "aurora";
    if (icon.includes("rain") || icon.includes("drizzle")) return "rain";
    if (icon.includes("thunder")) return "thunderstorm";
    if (icon.includes("cloud") || icon.includes("overcast")) return "cloudy";
    if (icon.includes("fog") || icon.includes("mist")) return "fog";
    return "moon";
  };

  const getBackgroundClass = () => {
    const type = getAtmosphereType();
    if (type === "sunset") return "bg-golden-hour";
    if (type === "aurora") return "bg-aurora-glow";
    if (type === "cloudy" || type === "fog") return "bg-overcast-gloom";
    return "bg-cosmic-night";
  };

  // SVG Custom Moon Phase drawing
  const renderMoonPhase = (illumination: number, phaseName: string) => {
    // Elegant SVG moon crescent drawing based on phase name and illumination
    const radius = 50;
    const isWaning = phaseName.toLowerCase().includes("waning") || phaseName.toLowerCase().includes("third");
    const isCrescent = phaseName.toLowerCase().includes("crescent");
    const isGibbous = phaseName.toLowerCase().includes("gibbous");

    return (
      <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-[0_0_25px_rgba(208,188,255,0.45)]">
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="70%" stopColor="#e9ddff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d0bcff" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        {/* Full Moon Base structure */}
        <circle cx="60" cy="60" r={radius} fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        
        {/* Glowing Illuminated part */}
        <path
          d={
            isWaning
              ? `M 60 ${60 - radius} A ${radius} ${radius} 0 0 0 60 ${60 + radius} A ${isCrescent ? radius * (1 - (illumination/50)) : radius * ((illumination/50) - 1)} ${radius} 0 0 ${isGibbous ? '0' : '1'} 60 ${60 - radius}`
              : `M 60 ${60 - radius} A ${radius} ${radius} 0 0 1 60 ${60 + radius} A ${isCrescent ? radius * (1 - (illumination/50)) : radius * ((illumination/50) - 1)} ${radius} 0 0 ${isGibbous ? '1' : '0'} 60 ${60 - radius}`
          }
          fill="url(#moonGlow)"
        />
        {/* Subtle Moon details/craters */}
        <circle cx="45" cy="45" r="5" fill="rgba(0,0,0,0.12)" />
        <circle cx="75" cy="55" r="7" fill="rgba(0,0,0,0.08)" />
        <circle cx="50" cy="75" r="4" fill="rgba(0,0,0,0.1)" />
      </svg>
    );
  };

  return (
    <div className={`min-h-screen text-on-surface font-sans flex flex-col md:flex-row relative overflow-x-hidden select-none transition-colors duration-1000 ${getBackgroundClass()}`}>
      
      {/* BACKGROUND PARTICLES EFFECT */}
      <AtmosphericCanvas conditionType={getAtmosphereType()} isActive={isAtmosphericGlow} />

      {/* STATIC STARS LAYOUT OVERLAY */}
      <div className="absolute inset-0 opacity-45 stars-layer pointer-events-none z-0" />

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass-panel rounded-full px-6 py-3 border border-primary/30 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary-fixed">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDE BAR NAVIGATION */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-[100px] z-40 flex-col items-center justify-between py-8 backdrop-blur-xl bg-surface-container-lowest/20 border-r border-white/10 shadow-2xl">
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-lg font-bold tracking-widest text-primary uppercase neon-text-purple">Aether</span>
          <div className="w-6 h-0.5 bg-gradient-to-r from-primary to-transparent rounded" />
        </div>

        <div className="flex flex-col gap-8 items-center">
          {[
            { id: "weather", icon: Sun, label: "Weather" },
            { id: "astronomy", icon: Moon, label: "Cosmos" },
            { id: "events", icon: Calendar, label: "Events" },
            { id: "profile", icon: User, label: "Profile" }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group flex flex-col items-center justify-center w-14 h-14 rounded-xl text-on-surface-variant transition-colors"
              >
                {active && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl shadow-[0_0_15px_rgba(208,188,255,0.15)] z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <Icon className={`w-6 h-6 transition-transform group-hover:scale-110 duration-300 ${active ? "text-primary stroke-[2px]" : "stroke-[1.5px]"}`} />
                  <span className={`font-mono text-[9px] font-bold uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${active ? "text-primary" : ""}`}>{tab.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-6">
          <motion.button 
            onClick={() => {
              setTempUnit(tempUnit === "C" ? "F" : "C");
              triggerToast(`Metrics configured to °${tempUnit === "C" ? "F" : "C"}`);
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="glass-button w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold text-secondary"
          >
            °{tempUnit}
          </motion.button>
          <div className="text-[10px] font-mono text-on-surface-variant/40 uppercase tracking-widest vertical-rl">Aether 2.4</div>
        </div>
      </nav>

      {/* MOBILE TOP NAVIGATION BAR */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 fixed top-0 left-0 w-full z-40 backdrop-blur-xl bg-surface-container-lowest/20 border-b border-white/10">
        <h1 className="font-display text-2xl font-bold text-primary tracking-widest uppercase neon-text-purple">Aether</h1>
        <div className="flex items-center gap-3">
          <motion.button 
            onClick={() => setTempUnit(tempUnit === "C" ? "F" : "C")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="glass-button w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-secondary"
          >
            °{tempUnit}
          </motion.button>
          <motion.button 
            onClick={() => setActiveTab("profile")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-8 h-8 rounded-full overflow-hidden border ${activeTab === "profile" ? "border-primary" : "border-white/20"}`}
          >
            <img src={profile.avatarUrl} alt="Explorer" className="w-full h-full object-cover" />
          </motion.button>
        </div>
      </header>

      {/* MAIN MAIN CANVAS CONTAINER */}
      <main className="flex-grow z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-28 md:pt-10 md:pb-10 md:pl-32 flex flex-col gap-6 md:gap-8">
        
        {/* HEADER SEARCH BAR (WEATHER & COSMIC NAVIGATION) */}
        {activeTab !== "profile" && (
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Probe atmospheric conditions (e.g. Reykjavik)..."
                className="w-full glass-panel pl-12 pr-4 py-3 rounded-xl font-sans text-sm focus:outline-none focus:border-primary/50 text-white placeholder-on-surface-variant/50 transition-colors"
              />
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            </form>

            {/* PRESET CHIPS */}
            <div className="flex gap-2 self-start md:self-auto overflow-x-auto hide-scrollbar w-full md:w-auto">
              {["San Francisco", "Reykjavík", "Tokyo"].map((city) => {
                const active = currentCity.toLowerCase() === city.toLowerCase();
                return (
                  <motion.button
                    key={city}
                    onClick={() => fetchWeatherData(city)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-4 py-1.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant"
                  >
                    {active && (
                      <motion.div
                        layoutId="activePresetIndicator"
                        className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-full shadow-[0_0_10px_rgba(208,188,255,0.1)] z-0"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}
                    <span className={`relative z-10 ${active ? "text-primary font-bold" : "hover:text-white"}`}>
                      {city}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* LOADING & ERROR BOUNDARIES */}
        {loading && (
          <div className="flex-grow flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-secondary/25 border-b-secondary animate-reverse-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">Syncing solar satellite feed...</p>
          </div>
        )}

        {!loading && error && (
          <div className="glass-panel rounded-2xl p-8 text-center max-w-md mx-auto my-12 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-error/10 border border-error/20 flex items-center justify-center text-error">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Observer Out of Range</h3>
            <p className="text-sm text-on-surface-variant">{error}</p>
            <button onClick={() => fetchWeatherData("San Francisco")} className="glass-button px-6 py-2 rounded-xl font-mono text-xs font-bold text-primary">
              RE-SYNC TO DEFAULT BASES
            </button>
          </div>
        )}

        {/* CORE VIEWS */}
        {!loading && weatherData && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-grow flex flex-col gap-6"
            >
              
              {/* --- VIEW: WEATHER HUB --- */}
              {activeTab === "weather" && (
                <div className="flex flex-col gap-6">
                  
                  {/* SLEEK INTERFACE HEADER */}
                  <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white flex items-center gap-2">
                        {weatherData.city}, <span className="text-slate-400 font-extralight">{weatherData.country}</span>
                      </h1>
                      <p className="text-slate-400 text-base md:text-lg mt-1">
                        {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-6xl md:text-7xl font-extralight tracking-tighter text-white">
                        {tempUnit === "C" ? `${weatherData.temperatureC}°C` : `${weatherData.temperatureF}°F`}
                      </div>
                      <p className="text-slate-400 text-sm md:text-base mt-1 flex items-center gap-2 md:justify-end">
                        <span className="font-semibold text-white">{weatherData.condition}</span>
                        <span>&bull;</span>
                        <span>Feels like {tempUnit === "C" ? `${Math.round(weatherData.temperatureC - 2)}°C` : `${Math.round(weatherData.temperatureF - 4)}°F`}</span>
                      </p>
                    </div>
                  </header>

                  {/* THREE-COLUMN BENTO GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Column 1 & 2 (Span 2): Daylight and Hourly */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                      
                      {/* Card A: Daylight & Solar Semicircular Arc */}
                      <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[340px]">
                        <div>
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-light text-slate-200 tracking-tight flex items-center gap-2">
                              <Sun className="w-5 h-5 text-amber-400" /> Daylight & Solar Arc
                            </h2>
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest text-slate-300">
                              {weatherData.sunsetTimeRemaining} remaining
                            </span>
                          </div>

                          {/* CSS Semicircular Dotted Sun Arc */}
                          <div className="relative w-full h-32 border-t border-l border-r border-dashed border-white/20 rounded-t-full mt-6 flex items-end justify-between px-6 pb-2">
                            <div className="flex flex-col items-start translate-y-2">
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Sunrise</span>
                              <span className="text-xs text-white font-medium font-mono">{weatherData.sunrise}</span>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 text-center">
                              <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-mono">Solar Apex</span>
                              <span className="text-xs text-indigo-300 font-semibold font-mono">11:58 AM</span>
                            </div>
                            <div className="flex flex-col items-end translate-y-2">
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Sunset</span>
                              <span className="text-xs text-white font-medium font-mono">{weatherData.sunset}</span>
                            </div>

                            {/* Dynamically positioned glowing yellow Sun-dot */}
                            {(() => {
                              const p = weatherData.solarCycleProgress; // Float 0.0 to 1.0
                              const x = p * 100;
                              const dx = x - 50;
                              const y = 100 - Math.sqrt(Math.max(0, 2500 - dx * dx));
                              return (
                                <div 
                                  className="absolute w-4.5 h-4.5 bg-amber-400 rounded-full shadow-[0_0_20px_#f59e0b] -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
                                  style={{ 
                                    left: `${Math.min(95, Math.max(5, x))}%`, 
                                    top: `${Math.min(95, Math.max(5, y))}%` 
                                  }}
                                />
                              );
                            })()}
                          </div>
                        </div>

                        {/* Three bottom metric grids */}
                        <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6 mt-6">
                          <div className="text-center md:text-left">
                            <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1">UV INDEX</span>
                            <span className="text-lg font-light text-white">{weatherData.uvIndexValue}</span>
                            <span className="text-[10px] text-emerald-400 ml-1.5 font-medium font-mono">{weatherData.uvIndexLevel}</span>
                          </div>
                          <div className="text-center md:text-left border-l border-white/5 pl-4">
                            <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1">HUMIDITY</span>
                            <span className="text-lg font-light text-white">{weatherData.humidity}%</span>
                            <span className="text-[10px] text-indigo-300 ml-1.5 font-medium font-mono">Optimal</span>
                          </div>
                          <div className="text-center md:text-left border-l border-white/5 pl-4">
                            <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1">WIND SPEED</span>
                            <span className="text-lg font-light text-white">
                              {tempUnit === "C" ? `${weatherData.windSpeedKmh} km/h` : `${weatherData.windSpeedMph} mph`}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-1.5 font-mono">{weatherData.windDirection}</span>
                          </div>
                        </div>

                      </div>

                      {/* Card B: Hourly Outlook with beautiful dynamic vertical line bars */}
                      <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-light text-slate-200 tracking-tight flex items-center gap-2">
                              <Clock className="w-5 h-5 text-indigo-400" /> Hourly Atmospheric Forecast
                            </h2>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">6-Hour Horizon</span>
                          </div>

                          <div className="flex justify-between items-end gap-2 md:gap-4 overflow-x-auto hide-scrollbar pt-6 pb-2">
                            {weatherData.hourlyForecast.map((hour, idx) => {
                              // Dynamic height calculations to mimic the chart
                              const minTemp = -10;
                              const maxTemp = 35;
                              const currentTemp = hour.tempC;
                              const heightPercent = Math.max(15, Math.min(95, ((currentTemp - minTemp) / (maxTemp - minTemp)) * 100));

                              return (
                                <div key={idx} className="flex flex-col items-center gap-3 flex-1 min-w-[50px] group">
                                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">
                                    {hour.time}
                                  </span>

                                  {/* Sleek Vertical bar chart item */}
                                  <div className="w-2.5 bg-white/5 rounded-full h-24 relative overflow-hidden flex items-end">
                                    <div 
                                      className="w-full bg-gradient-to-t from-blue-600 via-indigo-500 to-amber-400 rounded-full transition-all duration-1000"
                                      style={{ height: `${heightPercent}%` }}
                                    />
                                  </div>

                                  <span className="text-sm font-light text-white font-mono">
                                    {tempUnit === "C" ? `${hour.tempC}°` : `${hour.tempF}°`}
                                  </span>
                                  
                                  <span className="text-[9px] text-slate-500 font-mono uppercase max-w-[60px] text-ellipsis overflow-hidden whitespace-nowrap text-center">
                                    {hour.condition}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Column 3: Astronomy, Space and Stargazing Conditions */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                      
                      {/* Card C: Astronomy Details */}
                      <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between min-h-[300px]">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-2">Lunar Station</span>
                          <h3 className="text-xl font-light text-white tracking-tight mb-4 flex items-center gap-2">
                            <Moon className="w-5 h-5 text-indigo-300" /> {weatherData.moonPhaseName}
                          </h3>
                          <div className="flex justify-center items-center py-4">
                            {renderMoonPhase(weatherData.moonIllumination, weatherData.moonPhaseName)}
                          </div>
                        </div>

                        <div className="border-t border-white/5 pt-4 mt-4">
                          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                            <span>Illumination</span>
                            <span className="text-white font-bold">{weatherData.moonIllumination}%</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-slate-400 font-mono mt-2">
                            <span>Moonrise</span>
                            <span className="text-slate-300">{weatherData.moonrise}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card D: Stargazing Condition Status Box */}
                      <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-lg flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-2 font-mono flex items-center gap-1.5">
                            <Compass className="w-4 h-4 text-indigo-400 animate-pulse" /> Stargazing Index
                          </p>
                          <p className="text-2xl font-light text-white tracking-tight">
                            {weatherData.stargazingRating === "Optimal" ? "Excellent" : weatherData.stargazingRating}
                          </p>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                            {weatherData.stargazingReason}
                          </p>
                        </div>
                      </div>

                      {/* Card E: Current Event Banner / Preview */}
                      <div 
                        onClick={() => setActiveTab("events")}
                        className="glass-panel rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-primary/30 transition-all duration-300 relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-10 h-10 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary">
                            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                          </div>
                          <div>
                            <h4 className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">{weatherData.currentCelestialEvent.tag}</h4>
                            <h3 className="text-xs font-bold text-white group-hover:text-primary transition-colors">{weatherData.currentCelestialEvent.name}</h3>
                            <p className="font-mono text-[9px] text-primary-fixed mt-0.5">Peak {weatherData.currentCelestialEvent.countdown}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* --- VIEW: ASTRONOMY & LUNAR CENTER --- */}
              {activeTab === "astronomy" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Moon phase visualizer and details */}
                  <div className="lg:col-span-8 glass-panel rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[400px]">
                    <div className="flex justify-between items-start z-10 relative">
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-tertiary block mb-1">Lunar Cycle Position</span>
                        <h3 className="font-display text-2xl font-bold text-white">{weatherData.moonPhaseName}</h3>
                      </div>
                      <div className="glass-panel px-4 py-2 rounded-full border border-white/10 text-xs font-mono font-semibold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-tertiary animate-pulse" />
                        <span>{weatherData.moonIllumination}% Illuminated</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center my-8 z-10 relative">
                      {renderMoonPhase(weatherData.moonIllumination, weatherData.moonPhaseName)}
                      
                      <div className="mt-6 text-center">
                        <p className="font-mono text-xs text-on-surface-variant max-w-sm">
                          Moonrise: <span className="text-white font-medium">{weatherData.moonrise}</span> &bull; Moonset: <span className="text-white font-medium">{weatherData.moonset}</span>
                        </p>
                      </div>
                    </div>

                    <p className="font-mono text-[11px] text-on-surface-variant/70 text-center uppercase tracking-widest z-10">
                      Calculated using geodesic astronomical formulas
                    </p>
                  </div>

                  {/* Right Column: Solar arc and upcoming celestial logs */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Stargazing card (Repeated from weather for visual continuity of astronomy panel) */}
                    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-secondary font-mono text-[10px] font-bold uppercase tracking-widest">
                        <Compass className="w-4 h-4" /> Stargazing Observatory Index
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-display text-3xl font-bold text-white">{weatherData.stargazingRating}</span>
                        <span className="font-mono text-xs text-on-surface-variant">Optimal Zone</span>
                      </div>
                      <p className="text-sm text-on-surface-variant/90 leading-relaxed">{weatherData.stargazingReason}</p>
                    </div>

                    {/* Solar Cycle coordinates card */}
                    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-tertiary font-mono text-[10px] font-bold uppercase tracking-widest">
                        <Sun className="w-4 h-4" /> Solar Arc Tracking
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                          <span className="block font-mono text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Sunrise time</span>
                          <span className="font-mono text-xs font-bold text-white">{weatherData.sunrise}</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                          <span className="block font-mono text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Sunset time</span>
                          <span className="font-mono text-xs font-bold text-white">{weatherData.sunset}</span>
                        </div>
                      </div>
                      <div className="relative w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-tertiary to-secondary"
                          style={{ width: `${weatherData.solarCycleProgress * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Upcoming short logs block */}
                    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary block">Upcoming Cosmic Events</span>
                      <ul className="flex flex-col gap-3">
                        {weatherData.upcomingEvents.map((evt, idx) => (
                          <li key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0 text-xs font-mono">
                            <span className="text-white font-medium">{evt.name}</span>
                            <span className="text-on-surface-variant bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">{evt.date}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              )}

              {/* --- VIEW: CELESTIAL EVENTS & GUIDES --- */}
              {activeTab === "events" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Hero Event Card (e.g. Perseid Meteor Shower details) */}
                  <div className="lg:col-span-8 flex flex-col justify-end p-6 md:p-8 rounded-3xl glass-panel relative overflow-hidden min-h-[480px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.15),transparent_60%)] pointer-events-none" />

                    <div className="relative z-20 space-y-4">
                      <div className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md shadow-[0_0_15px_rgba(208,188,255,0.1)]">
                        <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-primary">{weatherData.currentCelestialEvent.tag}</span>
                      </div>

                      <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-2xl">
                        {weatherData.currentCelestialEvent.name}
                      </h1>

                      <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed">
                        {weatherData.currentCelestialEvent.description}
                      </p>

                      {/* Countdown clocks */}
                      <div className="pt-4 border-t border-white/10 flex items-center gap-6">
                        <div className="flex flex-col">
                          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Observation Peak In</span>
                          <span className="font-mono text-lg font-bold text-primary-fixed">{weatherData.currentCelestialEvent.countdown}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Viewing Guidelines and Alerts Column */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                      <Compass className="w-5 h-5 text-primary" /> Viewing Guide Coordinates
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      
                      <div className="glass-panel rounded-2xl p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-secondary/15 border border-secondary/20 flex items-center justify-center text-secondary">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider block">Best Peak Time</span>
                            <span className="font-sans text-sm font-semibold text-white">{weatherData.currentCelestialEvent.bestTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="glass-panel rounded-2xl p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-tertiary/15 border border-tertiary/20 flex items-center justify-center text-tertiary">
                            <Compass className="w-5 h-5 animate-spin-slow" />
                          </div>
                          <div>
                            <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider block">Observer Direction</span>
                            <span className="font-sans text-sm font-semibold text-white">{weatherData.currentCelestialEvent.direction}</span>
                          </div>
                        </div>
                      </div>

                      <div className="glass-panel rounded-2xl p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary">
                            <Star className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider block">Hourly Zenith Rate</span>
                            <span className="font-sans text-sm font-semibold text-white">{weatherData.currentCelestialEvent.rate}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Set Reminder Button */}
                    <button 
                      onClick={() => triggerToast("Celestial reminder set on solar array")}
                      className="w-full relative overflow-hidden rounded-full py-4 bg-primary text-on-primary font-mono text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 group mt-auto"
                    >
                      <Bell className="w-4 h-4 transition-transform group-hover:rotate-12" />
                      SET REMINDER
                    </button>

                  </div>
                </div>
              )}

              {/* --- VIEW: OBSERVATORY LEADER / USER SETTINGS --- */}
              {activeTab === "profile" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Explorer Details Card */}
                  <div className="lg:col-span-8 glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl flex-shrink-0">
                      <img src={profile.avatarUrl} alt="Dr. Elena" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 z-10 w-full">
                      <h1 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">{profile.name}</h1>
                      <div className="flex items-center gap-1.5 text-secondary">
                        <MapPin className="w-4 h-4" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest">{profile.location}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">{profile.bio}</p>

                      <div className="flex gap-4 mt-4 w-full md:w-auto">
                        <button 
                          onClick={() => triggerToast("Observatory details synchronized")}
                          className="glass-button flex-grow md:flex-none px-6 py-2 rounded-xl font-mono text-[10px] font-bold text-primary uppercase tracking-wider"
                        >
                          SYNC OBSERVATORY
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Cards */}
                  <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                    <div className="glass-panel rounded-3xl p-6 flex flex-col justify-center items-center text-center">
                      <Star className="w-8 h-8 text-tertiary mb-3 fill-tertiary/20" />
                      <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest mb-1">Observations</span>
                      <span className="font-display text-3xl font-bold text-white">{profile.observationsCount}</span>
                    </div>
                    <div className="glass-panel rounded-3xl p-6 flex flex-col justify-center items-center text-center">
                      <Zap className="w-8 h-8 text-secondary mb-3 fill-secondary/20" />
                      <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest mb-1">Storm Alerts</span>
                      <span className="font-display text-3xl font-bold text-white">{profile.loggedEventsCount}</span>
                    </div>
                  </div>

                  {/* Lower full width: System preferences */}
                  <div className="lg:col-span-12 flex flex-col gap-6 mt-4">
                    <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">Preferences Configuration</h2>
                    
                    <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5">
                      
                      {/* Metric toggles */}
                      <div className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                            <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white block">Unit Metrics Scale</span>
                            <span className="text-xs text-on-surface-variant">Switch temperature system models</span>
                          </div>
                        </div>
                        <div className="flex bg-surface-container-high rounded-xl p-1 border border-white/10">
                          <button 
                            onClick={() => setTempUnit("C")}
                            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all uppercase ${
                              tempUnit === "C" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-white"
                            }`}
                          >
                            Celsius
                          </button>
                          <button 
                            onClick={() => setTempUnit("F")}
                            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all uppercase ${
                              tempUnit === "F" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-white"
                            }`}
                          >
                            Fahrenheit
                          </button>
                        </div>
                      </div>

                      {/* Canvas effect */}
                      <div className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-secondary">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white block">Atmospheric Canvas Glow</span>
                            <span className="text-xs text-on-surface-variant">Render interactive particles along gravity nodes</span>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={isAtmosphericGlow} 
                            onChange={(e) => setIsAtmosphericGlow(e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-white/10 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                        </label>
                      </div>

                      {/* Sync triggers */}
                      <div className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-tertiary">
                            <Bell className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white block">Satellite Transceiver Alerts</span>
                            <span className="text-xs text-on-surface-variant">Receive active coronal warnings and aurora peaks</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => triggerToast("Geomagnetic alerts configured")}
                          className="glass-button px-4 py-1.5 rounded-xl font-mono text-[9px] font-bold text-white uppercase tracking-wider"
                        >
                          CONFIGURE
                        </button>
                      </div>

                    </div>

                    <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                          <Info className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-white block">About Aether Core</span>
                          <span className="text-xs text-on-surface-variant">Version 2.4.1 (Ethereal Build) &bull; CC-009</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-on-surface-variant" />
                    </div>

                  </div>
                </div>
              )}

              {/* --- END OF ACTIVE VIEWS --- */}

            </motion.div>
          </AnimatePresence>
        )}

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center py-2.5 bg-surface-container-lowest/40 backdrop-blur-md border-t border-white/10 shadow-xl rounded-t-2xl">
        {[
          { id: "weather", icon: Sun, label: "Weather" },
          { id: "astronomy", icon: Moon, label: "Cosmos" },
          { id: "events", icon: Calendar, label: "Events" },
          { id: "profile", icon: User, label: "Observatory" }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              whileTap={{ scale: 0.92 }}
              className="relative flex flex-col items-center justify-center py-2 px-3 rounded-xl text-on-surface-variant focus:outline-none min-w-[70px]"
            >
              {active && (
                <motion.div
                  layoutId="activeTabIndicatorMobile"
                  className="absolute inset-0 bg-primary/10 border border-primary/25 rounded-xl z-0 shadow-[0_0_12px_rgba(208,188,255,0.08)]"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <Icon className={`w-5 h-5 transition-transform ${active ? "text-primary stroke-[2px] scale-110" : "stroke-[1.5px]"}`} />
                <span className={`font-mono text-[8px] font-bold uppercase tracking-widest mt-1 ${active ? "text-primary" : "opacity-75"}`}>
                  {tab.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </nav>

    </div>
  );
}
