import { Button } from "./ui/button";
import { GraduationCap, Building2, Map, School, TrendingUp, Zap, Target, Award, Video } from "lucide-react";
import { Comets } from "./Comets";
import { FloatingSquares } from "./FloatingSquares";
import { Stars } from "./Stars";
import { useApi } from "../hooks/useApi";
import { statsApi } from "../services/api";
import { useEffect, useState } from "react";
import type { Statistics } from "../types";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const { data: statsData, loading: statsLoading } = useApi<Statistics>(
    statsApi.getOverview
  );

  useEffect(() => {
    if (statsData) {
      setStatistics(statsData);
    }
  }, [statsData]);

  const quickLinks = [
    {
      icon: GraduationCap,
      title: "Вузы",
      description: "Высшее образование",
      action: "universities",
      color: "#598EBC"
    },
    {
      icon: School,
      title: "Ссузы",
      description: "Среднее профессиональное",
      action: "colleges",
      color: "#392B7D"
    },
    {
      icon: Building2,
      title: "Предприятия",
      description: "Стажировки и карьера",
      action: "companies",
      color: "#EF3443"
    },
    {
      icon: Video,
      title: "Видео",
      description: "Мотивационные истории",
      action: "videos",
      color: "#92A8B4"
    },
    {
      icon: Map,
      title: "Roadmap",
      description: "Построить траекторию",
      action: "roadmap",
      color: "#598EBC"
    }
  ];

  // Функция для форматирования числа в формат "45+"
  const formatCount = (count: number): string => {
    if (count === 0) return "0";
    if (count >= 100) {
      return `${Math.floor(count / 10) * 10}+`;
    }
    return `${count}+`;
  };

  const stats = [
    { 
      label: "Вузов", 
      value: statistics ? formatCount(statistics.universities_count) : "...", 
      icon: GraduationCap, 
      color: "#598EBC" 
    },
    { 
      label: "Ссузов", 
      value: statistics ? formatCount(statistics.colleges_count) : "...", 
      icon: School, 
      color: "#392B7D" 
    },
    { 
      label: "Предприятий", 
      value: statistics ? formatCount(statistics.companies_count) : "...", 
      icon: Building2, 
      color: "#EF3443" 
    },
    { 
      label: "Видео", 
      value: statistics ? formatCount(statistics.videos_count) : "...", 
      icon: Video, 
      color: "#92A8B4" 
    },
    { 
      label: "Направлений", 
      value: statistics ? formatCount(statistics.directions_count) : "...", 
      icon: Map, 
      color: "#598EBC" 
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#031429] via-[#051b3a] to-[#031429]">
      {/* Реалистичные звезды */}
      <Stars />

      {/* Кометы */}
      <Comets />

      {/* Паттерны */}
      <div className="absolute inset-0 circuit-pattern opacity-10" />
      <div className="absolute inset-0 dots-pattern opacity-5" />
      
      {/* Темные цветные элементы */}
      <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-[#598EBC]/10 blur-3xl color-orb-1" />
      <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-[#392B7D]/15 blur-3xl color-orb-3" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#EF3443]/5 blur-3xl color-orb-2" />
      
      {/* Рандомные плавающие рамки */}
      <FloatingSquares />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-3 md:mb-4 text-[0.6rem] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase text-[#92A8B4]">
              Государственная корпорация «Роскосмос»
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6 text-white tracking-wide uppercase leading-tight px-4">
              <span className="drop-shadow-[0_0_20px_rgba(89,142,188,0.8)]">Космический</span> <span className="block sm:inline">Roadmap</span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl mb-8 md:mb-12 text-[#92A8B4] max-w-3xl mx-auto leading-relaxed px-4">
              Ваш путь к звёздам начинается здесь
            </p>

            {/* Stats with animation */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="border-3 p-6 bg-[#031429]/90 backdrop-blur-sm hover-lift transition-all duration-300 group relative overflow-hidden corner-accent"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    borderColor: `${stat.color}60`,
                    boxShadow: `0 0 20px ${stat.color}40`
                  }}
                >
                  <stat.icon className="w-6 h-6 mx-auto mb-2 group-hover:scale-125 transition-transform relative z-10" style={{ color: stat.color }} />
                  <div className="text-3xl mb-1 relative z-10 group-hover:scale-110 transition-transform" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-[#92A8B4] relative z-10">{stat.label}</div>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="text-base px-12 py-6 bg-[#EF3443] hover:bg-[#EF3443]/90 text-white uppercase tracking-wide relative group overflow-hidden border-2 border-[#EF3443] btn-cosmic shadow-[0_0_30px_rgba(239,52,67,0.5)] hover:shadow-[0_0_40px_rgba(239,52,67,0.7)]"
              onClick={() => onNavigate("roadmap")}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Построить траекторию
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 border-y-2 border-[#598EBC]/50 relative energy-lines">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => onNavigate(link.action)}
                className="group p-8 border-3 bg-[#031429]/90 backdrop-blur-sm transition-all duration-300 text-left relative overflow-hidden hover-lift corner-accent"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  borderColor: `${link.color}50`,
                  boxShadow: `0 0 20px ${link.color}30`
                }}
              >
                <div className="relative z-10">
                  <div 
                    className="w-14 h-14 border-2 flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"
                    style={{ 
                      borderColor: `${link.color}80`,
                      background: `${link.color}10`
                    }}
                  >
                    <link.icon className="w-7 h-7 transition-all group-hover:scale-110" style={{ color: link.color }} />
                  </div>
                  
                  <h3 className="text-lg uppercase tracking-wide mb-2 transition-all group-hover:scale-105 text-white" style={{ textShadow: `0 0 15px ${link.color}80` }}>
                    {link.title}
                  </h3>
                  
                  <p className="text-sm text-[#92A8B4] group-hover:text-white transition-colors">{link.description}</p>
                  
                  <div className="mt-4 flex items-center gap-2 transition-all" style={{ color: link.color }}>
                    <span className="text-xs uppercase tracking-wide">Открыть</span>
                    <div className="w-4 h-0.5 bg-current transform group-hover:w-10 transition-all duration-300" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="border-l-4 border-[#598EBC] pl-6 mb-12 relative bg-[#031429]/90 backdrop-blur-sm p-6 shadow-[0_0_30px_rgba(89,142,188,0.4)]">
              <h2 className="text-3xl md:text-4xl uppercase tracking-wide text-white mb-4 flex items-center gap-3">
                <Target className="w-8 h-8 text-[#EF3443]" />
                <span className="drop-shadow-[0_0_20px_rgba(89,142,188,0.8)]">О платформе</span>
              </h2>
              <p className="text-[#92A8B4] leading-relaxed mb-4">
                Космический Roadmap — твой личный навигатор в мир ракетно-космической отрасли. 
                Мы поможем выбрать правильный путь от школы до карьеры космического специалиста.
              </p>
              <p className="text-[#92A8B4] leading-relaxed">
                Здесь ты найдёшь всё: от выбора вуза до стажировки на передовых предприятиях отрасли.
              </p>
            </div>

            {/* Journey Steps */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { num: "01", title: "Школа", subtitle: "Выбор пути", color: "#6D6E71", icon: School },
                { num: "02", title: "Образование", subtitle: "Вуз / Ссуз", color: "#392B7D", icon: GraduationCap },
                { num: "03", title: "Практика", subtitle: "Стажировка", color: "#598EBC", icon: Building2 },
                { num: "04", title: "Карьера", subtitle: "Специалист", color: "#EF3443", icon: Award }
              ].map((step, index) => (
                <div 
                  key={index} 
                  className="border-3 p-6 relative overflow-hidden group hover-lift transition-all duration-300 bg-[#031429]/90 backdrop-blur-sm corner-accent"
                  style={{ 
                    animationDelay: `${index * 0.15}s`,
                    borderColor: `${step.color}50`,
                    boxShadow: `0 0 20px ${step.color}40`
                  }}
                >
                  <div className="relative z-10">
                    <step.icon className="w-8 h-8 mb-3 opacity-70 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12 transition-all" style={{ color: step.color }} />
                    <div className="text-5xl opacity-30 mb-2 group-hover:opacity-70 group-hover:scale-110 transition-all" style={{ color: step.color, textShadow: `0 0 20px ${step.color}80` }}>
                      {step.num}
                    </div>
                    <div className="text-sm uppercase tracking-wide mb-1 group-hover:scale-105 transition-transform text-white" style={{ textShadow: `0 0 10px ${step.color}60` }}>
                      {step.title}
                    </div>
                    <div className="text-xs text-[#92A8B4]">
                      {step.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t-2 border-[#598EBC]/50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center text-[#92A8B4]">
            <span className="uppercase tracking-wide text-sm">© 2025 Государственная корпорация «Роскосмос»</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
