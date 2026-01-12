import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "./ui/button";
import { School, GraduationCap, Building, Briefcase, Trophy, ArrowRight, CheckCircle, Target, Lightbulb, Trash2, Calendar, User, Loader2, AlertCircle } from "lucide-react";
import type { CareerPath, SavedTrajectory, Direction, Profession } from "../types";
import { Comets } from "./Comets";
import { FloatingSquares } from "./FloatingSquares";
import { Stars } from "./Stars";
import { analytics } from "../services/analytics";
import { directionsApi, professionsApi, roadmapApi } from "../services/api";
import { DetailedRoadmapDialog } from "./DetailedRoadmapDialog";
import { DirectionDetailsDialog } from "./DirectionDetailsDialog";
import { ProfessionDetailsDialog } from "./ProfessionDetailsDialog";
import { CustomPathDetailsDialog } from "./CustomPathDetailsDialog";

/**
 * RoadmapPage - Страница построения карьерных траекторий
 * 
 * Все направления и профессии загружаются из Django backend через API.
 * Для работы необходимо:
 * 1. Настроить VITE_API_URL в .env
 * 2. Создать модели Direction и Profession в Django
 * 3. Заполнить данные через django-admin
 * 
 * См. BACKEND_GUIDE.md для подробных инструкций
 */

interface PathStep {
  id: string;
  title: string;
  icon: any;
  description: string | ((selections: Record<string, string>) => string);
  recommendation?: string | ((selections: Record<string, string>) => string);
}

// Базовые шаги конструктора (не зависят от API)
const baseSteps: PathStep[] = [
  {
    id: "education-level",
    title: "Школа",
    icon: School,
    description: "Выберите, после какого класса планируете продолжить образование",
    recommendation: "Рекомендуем сосредоточиться на профильных предметах: математика, физика, информатика"
  },
  {
    id: "institution",
    title: "Учебное заведение",
    icon: GraduationCap,
    description: (selections) => {
      if (selections["education-level"] === "9 классов") {
        return "После 9 класса рекомендуем колледж. Возможен дальнейший переход в вуз";
      }
      return "Выберите тип образовательного учреждения";
    },
    recommendation: (selections) => {
      if (selections["education-level"] === "9 классов") {
        return "Ссуз даст практические навыки и возможность поступить в вуз без ЕГЭ";
      }
      return "Высшее образование открывает больше карьерных возможностей в космической отрасли";
    }
  },
  {
    id: "direction",
    title: "Направление",
    icon: Building,
    description: "Выберите специализацию в космической отрасли",
  },
  {
    id: "internship",
    title: "Стажировка",
    icon: Briefcase,
    description: "Стажировка на предприятии даст практический опыт",
    recommendation: "Стажировка значительно увеличивает шансы на трудоустройство после обучения"
  },
  {
    id: "career",
    title: "Карьера",
    icon: Trophy,
    description: "Выберите карьерный путь",
  }
];

export function RoadmapPage() {
  const [activeTab, setActiveTab] = useState<"constructor" | "predefined" | "my-paths">("constructor");
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  
  // Данные из API
  const [directions, setDirections] = useState<Direction[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [predefinedPaths, setPredefinedPaths] = useState<CareerPath[]>([]);
  const [savedTrajectories, setSavedTrajectories] = useState<SavedTrajectory[]>([]);
  
  // UI состояния
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [selectedSavedPath, setSelectedSavedPath] = useState<SavedTrajectory | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<Profession | null>(null);
  
  // Loading/Error состояния
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MAX_SAVED_PATHS = 10;

  // Загрузка всех данных при монтировании
  useEffect(() => {
    loadAllData();
    loadSavedTrajectories();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Параллельная загрузка всех данных
      const [directionsRes, professionsRes, pathsRes] = await Promise.all([
        directionsApi.getAll(),
        professionsApi.getAll(),
        roadmapApi.getPredefinedPaths()
      ]);

      if (directionsRes.error) {
        console.error('Directions error:', directionsRes.error);
      } else if (directionsRes.data) {
        setDirections(Array.isArray(directionsRes.data) ? directionsRes.data : []);
      }

      if (professionsRes.error) {
        console.error('Professions error:', professionsRes.error);
      } else if (professionsRes.data) {
        setProfessions(Array.isArray(professionsRes.data) ? professionsRes.data : []);
      }

      if (pathsRes.error) {
        console.error('Paths error:', pathsRes.error);
      } else if (pathsRes.data) {
        setPredefinedPaths(Array.isArray(pathsRes.data) ? pathsRes.data : []);
      }

    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Не удалось загрузить данные. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedTrajectories = () => {
    try {
      const saved = localStorage.getItem('savedTrajectories');
      if (saved) {
        const trajectories = JSON.parse(saved);
        setSavedTrajectories(trajectories);
      }
    } catch (error) {
      console.error('Failed to load saved trajectories:', error);
    }
  };

  // Оптимизированные обработчики с useCallback
  const handleSelection = useCallback((stepId: string, option: string) => {
    setSelections(prev => ({ ...prev, [stepId]: option }));
    setCurrentStep(prev => {
      if (prev < baseSteps.length - 1) {
        return prev + 1;
      } else {
        setIsComplete(true);
        return prev;
      }
    });
  }, []);

  const handleReset = useCallback(() => {
    setSelections({});
    setCurrentStep(0);
    setIsComplete(false);
  }, []);

  const handleSaveTrajectory = useCallback(() => {
    // Проверка лимита
    if (savedTrajectories.length >= MAX_SAVED_PATHS) {
      const event = new CustomEvent('show-toast', {
        detail: {
          title: 'Достигнут лимит',
          description: `Максимум ${MAX_SAVED_PATHS} сохраненных путей. Удалите старые, чтобы добавить новые.`,
          type: 'error'
        }
      });
      window.dispatchEvent(event);
      return;
    }

    const trajectory: SavedTrajectory = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      selections: selections,
      type: 'custom',
      pathTitle: `${selections["direction"]} → ${selections["career"]}`
    };
    
    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('savedTrajectories') || '[]');
    saved.push(trajectory);
    localStorage.setItem('savedTrajectories', JSON.stringify(saved));
    
    setSavedTrajectories(saved);
    
    // Аналитика
    analytics.trackTrajectoryCreated({
      direction: selections["direction"] || "",
      educationLevel: selections["institution"] || "",
      institution: selections["direction"] || "",
      company: selections["internship"] || "",
      career: selections["career"] || ""
    });
    
    const event = new CustomEvent('show-toast', {
      detail: {
        title: 'Траектория сохранена',
        description: 'Ваш карьерный путь успешно сохранен',
        type: 'success'
      }
    });
    window.dispatchEvent(event);
  }, [savedTrajectories.length, selections]);

  const handleDeleteTrajectory = useCallback((id: string) => {
    const updated = savedTrajectories.filter(t => t.id !== id);
    localStorage.setItem('savedTrajectories', JSON.stringify(updated));
    setSavedTrajectories(updated);
    
    analytics.trackTrajectoryDeleted(id);
    
    const event = new CustomEvent('show-toast', {
      detail: {
        title: 'Траектория удалена',
        description: 'Путь успешно удален',
        type: 'success'
      }
    });
    window.dispatchEvent(event);
  }, [savedTrajectories]);

  const handleSelectPredefinedPath = useCallback((path: CareerPath) => {
    if (savedTrajectories.length >= MAX_SAVED_PATHS) {
      const event = new CustomEvent('show-toast', {
        detail: {
          title: 'Достигнут лимит',
          description: `Максимум ${MAX_SAVED_PATHS} сохраненных путей. Удалите старые, чтобы добавить новые.`,
          type: 'error'
        }
      });
      window.dispatchEvent(event);
      return;
    }

    const trajectory: SavedTrajectory = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'predefined',
      path: path,
      pathTitle: path.title
    };
    
    const saved = JSON.parse(localStorage.getItem('savedTrajectories') || '[]');
    saved.push(trajectory);
    localStorage.setItem('savedTrajectories', JSON.stringify(saved));
    
    setSavedTrajectories(saved);
    setSelectedPath(null);
    
    analytics.trackTrajectoryCreated({
      direction: path.direction || "",
      educationLevel: path.institutionType || "",
      institution: path.university?.name || "",
      company: path.internship?.[0]?.company || "",
      career: path.careerGoal || ""
    });
    
    const event = new CustomEvent('show-toast', {
      detail: {
        title: 'Путь выбран',
        description: `Траектория "${path.title}" добавлена в ваш план`,
        type: 'success'
      }
    });
    window.dispatchEvent(event);
  }, [savedTrajectories.length]);

  const handleBackStep = useCallback(() => {
    setCurrentStep(prev => {
      const newStep = prev - 1;
      const stepId = baseSteps[newStep + 1]?.id; // Получаем id текущего шага, который будет удален
      if (stepId) {
        setSelections(prevSelections => {
          const newSelections = { ...prevSelections };
          delete newSelections[stepId];
          return newSelections;
        });
      }
      return newStep;
    });
  }, []);

  const handleDirectionDetails = useCallback((option: string) => {
    const dir = directions.find(d => d.name === option);
    if (dir) setSelectedDirection(dir);
  }, [directions]);

  const handleProfessionDetails = useCallback((option: string) => {
    const prof = professions.find(p => p.name === option);
    if (prof) setSelectedProfession(prof);
  }, [professions]);

  const handleTabChange = useCallback((tab: "constructor" | "predefined" | "my-paths") => {
    setActiveTab(tab);
  }, []);

  // Получить опции для текущего шага
  const getCurrentStepOptions = (): string[] => {
    const currentStepData = baseSteps[currentStep];
    
    switch (currentStepData.id) {
      case "education-level":
        return ["9 классов", "11 классов"];
      
      case "institution":
        if (selections["education-level"] === "9 классов") {
          return ["Ссуз", "Ссуз с переходом в Вуз"];
        }
        return ["Вуз", "Ссуз"];
      
      case "direction":
        // Возвращаем направления из API
        return directions.map(d => d.name);
      
      case "internship":
        return ["Пройти стажировку", "Пропустить"];
      
      case "career":
        // Возвращаем профессии для выбранного направления
        const selectedDirection = directions.find(d => d.name === selections["direction"]);
        if (selectedDirection) {
          const directionProfessions = professions.filter(p => p.direction_id === selectedDirection.id);
          return directionProfessions.map(p => p.name);
        }
        return [];
      
      default:
        return [];
    }
  };

  const currentStepData = baseSteps[currentStep];
  const currentOptions = getCurrentStepOptions();
  const currentDescription = typeof currentStepData.description === 'function'
    ? currentStepData.description(selections)
    : currentStepData.description;
  const currentRecommendation = currentStepData.recommendation
    ? (typeof currentStepData.recommendation === 'function'
        ? currentStepData.recommendation(selections)
        : currentStepData.recommendation)
    : null;

  // Получить предметы для текущего шага
  const getCurrentSubjects = (): string[] => {
    if (currentStepData.id === "direction" && selections["direction"]) {
      const selectedDirection = directions.find(d => d.name === selections["direction"]);
      return selectedDirection?.subjects || [];
    }
    return [];
  };

  const currentSubjects = getCurrentSubjects();

  // Получить детальную информацию о выбранных опциях
  const getSelectedDirectionInfo = () => {
    if (selections["direction"]) {
      return directions.find(d => d.name === selections["direction"]);
    }
    return null;
  };

  const getSelectedProfessionInfo = () => {
    if (selections["career"]) {
      return professions.find(p => p.name === selections["career"]);
    }
    return null;
  };

  const selectedDirectionInfo = getSelectedDirectionInfo();
  const selectedProfessionInfo = getSelectedProfessionInfo();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#031429] via-[#051b3a] to-[#031429]">
        <Stars />
        <Comets />
        <div className="absolute inset-0 circuit-pattern opacity-10" />
        <div className="absolute inset-0 dots-pattern opacity-5" />
        <FloatingSquares />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-[#598EBC] animate-spin mx-auto mb-4" />
              <p className="text-[#92A8B4]">Загрузка данных...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#031429] via-[#051b3a] to-[#031429]">
        <Stars />
        <Comets />
        <div className="absolute inset-0 circuit-pattern opacity-10" />
        <div className="absolute inset-0 dots-pattern opacity-5" />
        <FloatingSquares />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-[#EF3443] mx-auto mb-4" />
              <p className="text-white mb-2">Ошибка загрузки данных</p>
              <p className="text-[#92A8B4] text-sm mb-4">{error}</p>
              <Button onClick={loadAllData} className="bg-[#598EBC] hover:bg-[#598EBC]/80">
                Попробовать снова
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-[#598EBC]/15 blur-3xl color-orb-1" />
      <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-[#EF3443]/10 blur-3xl color-orb-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#392B7D]/10 blur-3xl color-orb-3" />
      
      {/* Рандомные плавающие рамки */}
      <FloatingSquares />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 border-b-2 border-[#598EBC] pb-6 energy-lines">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 border-3 border-[#598EBC] flex items-center justify-center bg-[#031429] shadow-[0_0_30px_rgba(89,142,188,0.6)] relative corner-accent text-[#598EBC]">
              <Target className="w-7 h-7 text-[#598EBC]" />
            </div>
            <h1 className="text-5xl uppercase tracking-[0.2em] text-[#598EBC] drop-shadow-[0_0_20px_rgba(89,142,188,0.8)]">Roadmap</h1>
          </div>
          <p className="text-base text-[#92A8B4]">
            Постройте свою уникальную карьерную траекторию
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 md:gap-4 mb-8 border-b-2 border-[#598EBC]/50 overflow-x-auto">
          <button
            onClick={() => handleTabChange("constructor")}
            className={`pb-3 md:pb-4 px-3 md:px-6 uppercase tracking-wide text-xs md:text-sm transition-all relative whitespace-nowrap ${
              activeTab === "constructor"
                ? "text-white"
                : "text-[#92A8B4] hover:text-white"
            }`}
          >
            {activeTab === "constructor" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#598EBC] shadow-[0_0_10px_rgba(89,142,188,0.8)]" />
            )}
            Конструктор
          </button>
          <button
            onClick={() => handleTabChange("predefined")}
            className={`pb-3 md:pb-4 px-3 md:px-6 uppercase tracking-wide text-xs md:text-sm transition-all relative whitespace-nowrap ${
              activeTab === "predefined"
                ? "text-white"
                : "text-[#92A8B4] hover:text-white"
            }`}
          >
            {activeTab === "predefined" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#598EBC] shadow-[0_0_10px_rgba(89,142,188,0.8)]" />
            )}
            Готовые пути
          </button>
          <button
            onClick={() => handleTabChange("my-paths")}
            className={`pb-3 md:pb-4 px-3 md:px-6 uppercase tracking-wide text-xs md:text-sm transition-all relative whitespace-nowrap ${
              activeTab === "my-paths"
                ? "text-white"
                : "text-[#92A8B4] hover:text-white"
            }`}
          >
            {activeTab === "my-paths" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#EF3443] shadow-[0_0_10px_rgba(239,52,67,0.8)]" />
            )}
            <div className="flex items-center gap-1 md:gap-2">
              <User className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Мои пути</span>
              <span className="sm:hidden">Мои</span>
              {savedTrajectories.length > 0 && (
                <span className="bg-[#EF3443] text-white text-xs px-1.5 md:px-2 py-0.5 rounded-full">
                  {savedTrajectories.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Constructor Tab */}
        {activeTab === "constructor" && (
          <div className="max-w-4xl mx-auto">
            {!isComplete ? (
              <>
                {/* Progress */}
                <div className="mb-8 md:mb-12">
                  <div className="hidden md:flex items-center justify-between mb-4">
                    {baseSteps.map((step, index) => (
                      <div key={step.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`w-12 h-12 border-3 flex items-center justify-center transition-all relative bg-[#031429] ${
                              index <= currentStep
                                ? "border-[#598EBC] shadow-[0_0_20px_rgba(89,142,188,0.6)]"
                                : "border-[#598EBC]/30"
                            } ${selections[step.id] ? "border-[#EF3443] shadow-[0_0_20px_rgba(239,52,67,0.6)]" : ""}`}
                          >
                            {selections[step.id] ? (
                              <CheckCircle className="w-6 h-6 text-[#EF3443] animate-bounce" style={{ animationDuration: "2s" }} />
                            ) : (
                              <step.icon
                                className={`w-6 h-6 transition-all ${
                                  index <= currentStep ? "text-[#598EBC] scale-110" : "text-[#598EBC]/30"
                                }`}
                              />
                            )}
                          </div>
                          <div
                            className={`text-xs uppercase tracking-wide mt-2 transition-colors ${
                              index <= currentStep ? "text-white" : "text-[#92A8B4]"
                            }`}
                          >
                            {step.title}
                          </div>
                        </div>
                        {index < baseSteps.length - 1 && (
                          <div
                            className={`h-1 flex-1 mx-2 transition-all ${
                              index < currentStep ? "bg-[#598EBC] shadow-[0_0_10px_rgba(89,142,188,0.6)]" : "bg-[#598EBC]/30"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Mobile Progress */}
                  <div className="md:hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 border-2 flex items-center justify-center bg-[#031429] border-[#598EBC] shadow-[0_0_20px_rgba(89,142,188,0.6)]`}>
                          {selections[currentStepData.id] ? (
                            <CheckCircle className="w-5 h-5 text-[#EF3443]" />
                          ) : (
                            <currentStepData.icon className="w-5 h-5 text-[#598EBC]" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm uppercase tracking-wide text-white">{currentStepData.title}</p>
                          <p className="text-xs text-[#92A8B4]">Шаг {currentStep + 1} из {baseSteps.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-2 bg-[#598EBC]/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#598EBC] shadow-[0_0_10px_rgba(89,142,188,0.6)] transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / baseSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Current Step */}
                <div className="border-2 md:border-3 border-[#598EBC]/50 p-4 md:p-8 bg-[#031429]/90 backdrop-blur-sm hover:border-[#598EBC] transition-all shadow-[0_0_30px_rgba(89,142,188,0.3)] corner-accent">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b-2 border-[#598EBC]/50">
                    <div className="w-12 h-12 md:w-16 md:h-16 border-2 md:border-3 border-[#598EBC] flex items-center justify-center bg-[#051b3a]/50 shadow-[0_0_20px_rgba(89,142,188,0.4)] shrink-0">
                      <currentStepData.icon className="w-6 h-6 md:w-8 md:h-8 text-[#598EBC]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-2xl uppercase tracking-wide text-white mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        {currentStepData.title}
                      </h2>
                      <p className="text-xs md:text-sm text-[#92A8B4]">{currentDescription}</p>
                    </div>
                  </div>

                  {/* Recommendation */}
                  {currentRecommendation && (
                    <div className="mb-4 md:mb-6 p-3 md:p-4 border-l-2 md:border-l-3 border-[#EF3443] bg-[#051b3a]/50 shadow-[0_0_15px_rgba(239,52,67,0.2)]">
                      <div className="flex items-start gap-2 md:gap-3">
                        <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-[#EF3443] shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.65rem] md:text-xs uppercase tracking-wide text-[#EF3443] mb-1">Рекомендация</p>
                          <p className="text-xs md:text-sm text-[#92A8B4]">{currentRecommendation}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Subjects */}
                  {currentSubjects.length > 0 && (
                    <div className="mb-4 md:mb-6 p-3 md:p-4 border-l-2 md:border-l-3 border-[#392B7D] bg-[#051b3a]/50 shadow-[0_0_15px_rgba(57,43,125,0.2)]">
                      <div className="flex items-start gap-2 md:gap-3">
                        <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-[#392B7D] shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.65rem] md:text-xs uppercase tracking-wide text-[#392B7D] mb-2">Профильные предметы</p>
                          <div className="flex flex-wrap gap-1.5 md:gap-2">
                            {currentSubjects.map((subject, idx) => (
                              <span
                                key={idx}
                                className="px-2 md:px-3 py-0.5 md:py-1 bg-[#392B7D]/20 border border-[#392B7D]/50 text-[#92A8B4] text-[0.6rem] md:text-xs uppercase tracking-wide"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  {currentOptions.length > 0 ? (
                    <div className="space-y-3 md:space-y-4">
                      {currentOptions.map((option) => {
                        // Проверяем нужна ли кнопка "Подробнее"
                        const needsDetailsButton = currentStepData.id === "direction" || currentStepData.id === "career";
                        
                        return (
                          <div
                            key={option}
                            className="p-4 md:p-6 border-3 border-[#598EBC]/50 bg-[#051b3a]/50 hover:border-[#598EBC] transition-all group shadow-[0_0_20px_rgba(89,142,188,0.2)] hover:shadow-[0_0_30px_rgba(89,142,188,0.4)]"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <button
                                onClick={() => handleSelection(currentStepData.id, option)}
                                className="flex-1 text-left flex items-center justify-between"
                              >
                                <span className="text-sm md:text-base text-white uppercase tracking-wide">{option}</span>
                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-[#598EBC] group-hover:translate-x-1 transition-transform shrink-0" />
                              </button>
                              
                              {needsDetailsButton && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (currentStepData.id === "direction") {
                                      handleDirectionDetails(option);
                                    } else if (currentStepData.id === "career") {
                                      handleProfessionDetails(option);
                                    }
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="border-2 border-[#392B7D] text-[#392B7D] hover:bg-[#392B7D]/20 uppercase tracking-wide text-xs shrink-0 shadow-[0_0_15px_rgba(57,43,125,0.3)] hover:shadow-[0_0_25px_rgba(57,43,125,0.5)] transition-all"
                                >
                                  Подробнее
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-[#92A8B4] mx-auto mb-3 opacity-50" />
                      <p className="text-[#92A8B4]">
                        {currentStepData.id === "direction" && "Нет доступных направлений. Добавьте направления через админ-панель."}
                        {currentStepData.id === "career" && "Нет доступных профессий для выбранного направления."}
                      </p>
                    </div>
                  )}

                  {/* Back Button */}
                  {currentStep > 0 && (
                    <div className="mt-6 flex justify-between items-center">
                      <Button
                        onClick={handleBackStep}
                        variant="outline"
                        className="border-2 border-[#598EBC] text-[#598EBC] hover:bg-[#598EBC]/20 uppercase tracking-wide transition-all shadow-[0_0_15px_rgba(89,142,188,0.3)] hover:shadow-[0_0_25px_rgba(89,142,188,0.5)]"
                      >
                        Назад
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Result */
              <div className="border-2 md:border-3 border-[#598EBC] p-6 md:p-10 bg-[#031429]/90 backdrop-blur-sm shadow-[0_0_40px_rgba(89,142,188,0.4)] corner-accent">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 border-3 border-[#EF3443] flex items-center justify-center bg-[#051b3a] shadow-[0_0_30px_rgba(239,52,67,0.6)]">
                    <Trophy className="w-8 h-8 md:w-10 md:h-10 text-[#EF3443]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl uppercase tracking-wide text-white mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    Ваш карьерный путь
                  </h2>
                  <p className="text-sm md:text-base text-[#92A8B4]">
                    {selections["direction"]} → {selections["career"]}
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  {/* Краткая сводка */}
                  <div className="space-y-3">
                    {Object.entries(selections).map(([key, value]) => {
                      const step = baseSteps.find(s => s.id === key);
                      return (
                        <div key={key} className="flex items-start gap-3 p-4 border-l-3 border-[#598EBC]/50 bg-[#051b3a]/30">
                          {step && <step.icon className="w-5 h-5 text-[#598EBC] shrink-0 mt-0.5" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs uppercase tracking-wide text-[#598EBC] mb-1">
                              {step?.title || key}
                            </p>
                            <p className="text-sm text-white">{value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Подробная информация о направлении */}
                  {selectedDirectionInfo && (
                    <div className="border-l-3 border-[#392B7D] pl-4 p-4 bg-[#051b3a]/30">
                      <p className="text-xs uppercase tracking-wide text-[#392B7D] mb-2">О направлении</p>
                      <p className="text-sm text-[#92A8B4] mb-3">{selectedDirectionInfo.description}</p>
                      
                      {selectedDirectionInfo.subjects && selectedDirectionInfo.subjects.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-[#392B7D] mb-2">Профильные предметы:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedDirectionInfo.subjects.map((subject, idx) => (
                              <span key={idx} className="px-2 py-1 bg-[#392B7D]/20 border border-[#392B7D]/50 text-[#92A8B4] text-xs">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedDirectionInfo.recommendation && (
                        <div className="flex items-start gap-2 p-3 bg-[#392B7D]/10 border border-[#392B7D]/30 rounded">
                          <Lightbulb className="w-4 h-4 text-[#392B7D] shrink-0 mt-0.5" />
                          <p className="text-xs text-[#92A8B4]">{selectedDirectionInfo.recommendation}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Подробная информация о профессии */}
                  {selectedProfessionInfo && (
                    <div className="border-l-3 border-[#EF3443] pl-4 p-4 bg-[#051b3a]/30">
                      <p className="text-xs uppercase tracking-wide text-[#EF3443] mb-2">О профессии</p>
                      <p className="text-sm text-[#92A8B4] mb-3">{selectedProfessionInfo.description}</p>
                      
                      {selectedProfessionInfo.salary_range && (
                        <div className="flex items-center gap-2 mb-2 text-sm">
                          <Target className="w-4 h-4 text-[#EF3443]" />
                          <span className="text-[#92A8B4]">Зарплата: <span className="text-white">{selectedProfessionInfo.salary_range}</span></span>
                        </div>
                      )}
                      
                      {selectedProfessionInfo.demand_level && (
                        <div className="flex items-center gap-2 mb-3 text-sm">
                          <Trophy className="w-4 h-4 text-[#EF3443]" />
                          <span className="text-[#92A8B4]">Востребованность: <span className="text-white">
                            {selectedProfessionInfo.demand_level === 'high' && 'Высокая'}
                            {selectedProfessionInfo.demand_level === 'medium' && 'Средняя'}
                            {selectedProfessionInfo.demand_level === 'low' && 'Низкая'}
                          </span></span>
                        </div>
                      )}
                      
                      {selectedProfessionInfo.requirements && selectedProfessionInfo.requirements.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-[#EF3443] mb-2">Требования:</p>
                          <ul className="space-y-1">
                            {selectedProfessionInfo.requirements.map((req, idx) => (
                              <li key={idx} className="text-xs text-[#92A8B4] flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-[#EF3443] shrink-0 mt-0.5" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedProfessionInfo.skills && selectedProfessionInfo.skills.length > 0 && (
                        <div>
                          <p className="text-xs text-[#EF3443] mb-2">Необходимые навыки:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedProfessionInfo.skills.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-[#EF3443]/20 border border-[#EF3443]/50 text-[#92A8B4] text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSaveTrajectory}
                    className="flex-1 bg-[#EF3443] hover:bg-[#EF3443]/80 text-white uppercase tracking-wide shadow-[0_0_20px_rgba(239,52,67,0.4)] hover:shadow-[0_0_30px_rgba(239,52,67,0.6)] transition-all"
                  >
                    Сохранить путь
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 border-2 border-[#598EBC] text-[#598EBC] hover:bg-[#598EBC]/20 uppercase tracking-wide shadow-[0_0_15px_rgba(89,142,188,0.3)] hover:shadow-[0_0_25px_rgba(89,142,188,0.5)] transition-all"
                  >
                    Начать заново
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Predefined Paths Tab */}
        {activeTab === "predefined" && (
          <div>
            {predefinedPaths.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 text-[#92A8B4] mx-auto mb-4 opacity-50" />
                <p className="text-white mb-2">Нет готовых путей</p>
                <p className="text-[#92A8B4] text-sm">
                  Добавьте готовые карьерные пути через админ-панель Django
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {predefinedPaths.map((path) => (
                  <div
                    key={path.id}
                    className="border-2 border-[#598EBC]/50 p-6 bg-[#031429]/90 backdrop-blur-sm hover:border-[#598EBC] transition-all cursor-pointer shadow-[0_0_20px_rgba(89,142,188,0.2)] hover:shadow-[0_0_30px_rgba(89,142,188,0.4)] corner-accent group"
                    onClick={() => setSelectedPath(path)}
                  >
                    <div className="mb-4">
                      <h3 className="text-lg uppercase tracking-wide text-white mb-2 group-hover:text-[#598EBC] transition-colors">
                        {path.title}
                      </h3>
                      <p className="text-sm text-[#92A8B4] line-clamp-3">{path.description}</p>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-[#92A8B4]">
                        <Calendar className="w-4 h-4" />
                        <span>{path.duration}</span>
                      </div>
                      {path.difficulty && (
                        <div className="flex items-center gap-2 text-xs text-[#92A8B4]">
                          <Target className="w-4 h-4" />
                          <span>Сложность: {path.difficulty}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPredefinedPath(path);
                      }}
                      className="w-full bg-[#598EBC] hover:bg-[#598EBC]/80 text-white uppercase tracking-wide text-xs"
                    >
                      Выбрать путь
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Path Details Dialog */}
            {selectedPath && (
              <DetailedRoadmapDialog
                open={!!selectedPath}
                onOpenChange={() => setSelectedPath(null)}
                path={selectedPath}
                onSelectPath={() => handleSelectPredefinedPath(selectedPath)}
                showSelectButton={true}
              />
            )}
          </div>
        )}

        {/* My Paths Tab */}
        {activeTab === "my-paths" && (
          <div>
            {savedTrajectories.length === 0 ? (
              <div className="text-center py-16">
                <User className="w-16 h-16 text-[#92A8B4] mx-auto mb-4 opacity-50" />
                <p className="text-white mb-2">У вас пока нет сохраненных путей</p>
                <p className="text-[#92A8B4] text-sm mb-6">
                  Создайте путь в конструкторе или выберите из готовых
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setActiveTab("constructor")}
                    className="bg-[#598EBC] hover:bg-[#598EBC]/80 text-white uppercase tracking-wide"
                  >
                    Открыть конструктор
                  </Button>
                  <Button
                    onClick={() => setActiveTab("predefined")}
                    variant="outline"
                    className="border-[#598EBC] text-[#598EBC] hover:bg-[#598EBC]/10 uppercase tracking-wide"
                  >
                    Готовые пути
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[#92A8B4]">
                    Сохранено путей: {savedTrajectories.length} / {MAX_SAVED_PATHS}
                  </p>
                </div>

                {savedTrajectories.map((trajectory) => (
                  <div
                    key={trajectory.id}
                    className="border-2 border-[#598EBC]/50 p-4 md:p-6 bg-[#031429]/90 backdrop-blur-sm hover:border-[#598EBC] transition-all shadow-[0_0_20px_rgba(89,142,188,0.2)] corner-accent"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0 cursor-pointer w-full" onClick={() => setSelectedSavedPath(trajectory)}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#EF3443] shrink-0" />
                            <h3 className="text-base sm:text-lg uppercase tracking-wide text-white hover:text-[#598EBC] transition-colors truncate">
                              {trajectory.pathTitle}
                            </h3>
                          </div>
                          <span className={`px-2 py-0.5 text-xs uppercase tracking-wide shrink-0 inline-block ${
                            trajectory.type === 'custom'
                              ? 'bg-[#598EBC]/20 border border-[#598EBC]/50 text-[#598EBC]'
                              : 'bg-[#392B7D]/20 border border-[#392B7D]/50 text-[#392B7D]'
                          }`}>
                            {trajectory.type === 'custom' ? 'Свой путь' : 'Готовый путь'}
                          </span>
                        </div>

                        {trajectory.type === 'custom' && trajectory.selections && (
                          <div className="space-y-2 mb-3">
                            {Object.entries(trajectory.selections).map(([key, value]) => {
                              const step = baseSteps.find(s => s.id === key);
                              return (
                                <div key={key} className="flex items-center gap-2 text-xs sm:text-sm text-[#92A8B4]">
                                  {step && <step.icon className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />}
                                  <span className="text-[#598EBC] shrink-0">{step?.title}:</span>
                                  <span className="truncate">{value}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {trajectory.type === 'predefined' && trajectory.path && (
                          <p className="text-xs sm:text-sm text-[#92A8B4] mb-3 line-clamp-2">
                            {trajectory.path.description}
                          </p>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <p className="text-xs text-[#92A8B4] flex items-center gap-2">
                            <Calendar className="w-3 h-3 shrink-0" />
                            <span>Создано: {new Date(trajectory.timestamp).toLocaleDateString('ru-RU')}</span>
                          </p>
                          <button className="text-xs text-[#598EBC] hover:text-white transition-colors text-left">
                            Подробнее →
                          </button>
                        </div>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTrajectory(trajectory.id);
                        }}
                        variant="ghost"
                        size="icon"
                        className="text-[#EF3443] hover:bg-[#EF3443]/10 shrink-0 self-start sm:self-center"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Saved Path Details Dialog */}
            {selectedSavedPath && selectedSavedPath.type === 'predefined' && selectedSavedPath.path && (
              <DetailedRoadmapDialog
                open={!!selectedSavedPath}
                onOpenChange={() => setSelectedSavedPath(null)}
                path={selectedSavedPath.path}
                showSelectButton={false}
              />
            )}
            
            {/* Custom Path Details Dialog */}
            {selectedSavedPath && selectedSavedPath.type === 'custom' && (
              <CustomPathDetailsDialog
                trajectory={selectedSavedPath}
                open={!!selectedSavedPath}
                onOpenChange={() => setSelectedSavedPath(null)}
                onClose={() => setSelectedSavedPath(null)}
              />
            )}
          </div>
        )}
        
        {/* Direction Details Dialog */}
        {selectedDirection && (
          <DirectionDetailsDialog
            direction={selectedDirection}
            open={!!selectedDirection}
            onOpenChange={() => setSelectedDirection(null)}
            onClose={() => setSelectedDirection(null)}
          />
        )}
        
        {/* Profession Details Dialog */}
        {selectedProfession && (
          <ProfessionDetailsDialog
            profession={selectedProfession}
            open={!!selectedProfession}
            onOpenChange={() => setSelectedProfession(null)}
            onClose={() => setSelectedProfession(null)}
          />
        )}
      </div>
    </div>
  );
}