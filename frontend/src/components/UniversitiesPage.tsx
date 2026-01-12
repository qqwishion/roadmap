import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Search,
  MapPin,
  ExternalLink,
  Phone,
  Mail,
  TrendingUp,
  Building,
  GraduationCap,
  Briefcase,
  Hexagon,
  Rocket,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { University, Region, Specialization } from "../types";
import { Comets } from "./Comets";
import { FloatingSquares } from "./FloatingSquares";
import { Stars } from "./Stars";
import { useApi } from "../hooks/useApi";
import { universitiesApi, regionsApi, specializationsApi } from "../services/api";
import { UniversityDetailsDialog } from "./UniversityDetailsDialog";

export function UniversitiesPage() {
  // Состояния для фильтров
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSpecialization, setSelectedSpecialization] = useState("Все специальности");
  const [hasInternPositions, setHasInternPositions] = useState(false);
  const [hasEntryPositions, setHasEntryPositions] = useState(false);
  const [hasAdvancedPositions, setHasAdvancedPositions] = useState(false);
  const [hasSupportMeasures, setHasSupportMeasures] = useState(false);
  const [hasAdvancedEngineeringSchool, setHasAdvancedEngineeringSchool] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  
  // API запросы - регионы и специальности загружаем один раз
  const { data: apiRegions } = useApi<Region[]>(() => regionsApi.getAll(), []);
  const { data: apiSpecializations } = useApi<Specialization[]>(() => specializationsApi.getAll(), []);
  
  // Вузы загружаем с параметрами фильтрации (region и search на сервере)
  const { data: apiUniversities, loading, error } = useApi<University[]>(
    () => universitiesApi.getAll({
      region: selectedRegion !== "all" ? selectedRegion : undefined,
      search: searchQuery || undefined,
    }),
    [selectedRegion, searchQuery] // Перезагружаем при изменении фильтров
  );
  
  // Используем API данные или пустой массив если нет данных
  const universities = apiUniversities || [];
  const regions = apiRegions || [];
  const specializations = ["Все специальности", ...(apiSpecializations?.map(s => s.name) || [])];
  
  // Клиентская фильтрация только по полям, которых нет в API
  const filteredUniversities = universities.filter((uni) => {
    const matchesSpecialization =
      selectedSpecialization === "Все специальности" ||
      (uni.specializations &&
        uni.specializations.some((s) =>
          s.includes(selectedSpecialization),
        ));
    const matchesIntern =
      !hasInternPositions ||
      (uni.internPositions && uni.internPositions.length > 0);
    const matchesEntry =
      !hasEntryPositions ||
      (uni.entryPositions && uni.entryPositions.length > 0);
    const matchesAdvanced =
      !hasAdvancedPositions ||
      (uni.advancedPositions &&
        uni.advancedPositions.length > 0);
    const matchesSupport =
      !hasSupportMeasures ||
      [
        ...(uni.internPositions || []),
        ...(uni.entryPositions || []),
        ...(uni.advancedPositions || []),
      ].some(
        (pos) =>
          pos.supportMeasures && pos.supportMeasures.length > 0,
      );
    const matchesAdvancedEngineeringSchool =
      !hasAdvancedEngineeringSchool ||
      uni.has_advanced_engineering_school;

    return (
      matchesSpecialization &&
      matchesIntern &&
      matchesEntry &&
      matchesAdvanced &&
      matchesSupport &&
      matchesAdvancedEngineeringSchool
    );
  });

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
              <p className="text-[#92A8B4]">
                Загрузка вузов...
              </p>
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
              <p className="text-white mb-2">
                Ошибка загрузки данных
              </p>
              <p className="text-[#92A8B4] text-sm mb-4">
                {error}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#598EBC] hover:bg-[#598EBC]/80"
              >
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
      <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-[#598EBC]/10 blur-3xl color-orb-1" />
      <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-[#392B7D]/15 blur-3xl color-orb-3" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#EF3443]/5 blur-3xl color-orb-2" />

      {/* Рандомные светящиеся плавающие рамки */}
      <FloatingSquares />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-6 md:mb-8 border-b-2 border-[#598EBC] pb-4 md:pb-6 energy-lines">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="w-10 h-10 md:w-14 md:h-14 border-2 md:border-3 border-[#598EBC] flex items-center justify-center relative corner-accent bg-[#031429] shadow-[0_0_30px_rgba(89,142,188,0.6)] text-[#598EBC] shrink-0">
              <Rocket className="w-5 h-5 md:w-7 md:h-7 text-[#598EBC]" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#598EBC] drop-shadow-[0_0_20px_rgba(89,142,188,0.8)]">
              Вузы
            </h1>
          </div>
          <p className="text-sm md:text-base text-[#92A8B4]">
            Высшие учебные заведения с программами подготовки
            для космической отрасли
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 border-3 border-[#598EBC]/50 bg-[#031429]/90 backdrop-blur-sm relative corner-accent hover:border-[#598EBC] transition-all shadow-[0_0_30px_rgba(89,142,188,0.3)] energy-lines hover:shadow-[0_0_40px_rgba(89,142,188,0.5)]">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#598EBC]" />
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="pl-10 bg-[#051b3a]/50 border-2 border-[#598EBC]/30 text-white placeholder:text-[#92A8B4] focus:border-[#598EBC] transition-all focus:shadow-[0_0_20px_rgba(89,142,188,0.4)]"
                />
              </div>
            </div>

            <Select
              value={selectedRegion}
              onValueChange={setSelectedRegion}
            >
              <SelectTrigger className="bg-[#051b3a]/50 border-2 border-[#598EBC]/30 text-white hover:border-[#598EBC] transition-all">
                <SelectValue placeholder="Все регионы" />
              </SelectTrigger>
              <SelectContent className="bg-[#031429] border-[#598EBC]">
                <SelectItem
                  value="all"
                  className="text-white focus:bg-[#598EBC]/20"
                >
                  Все регионы
                </SelectItem>
                {regions.map((region) => (
                  <SelectItem
                    key={region.id}
                    value={region.slug}
                    className="text-white focus:bg-[#598EBC]/20"
                  >
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedSpecialization}
              onValueChange={setSelectedSpecialization}
            >
              <SelectTrigger className="bg-[#051b3a]/50 border-2 border-[#598EBC]/30 text-white hover:border-[#598EBC] transition-all">
                <SelectValue placeholder="Специальность" />
              </SelectTrigger>
              <SelectContent className="bg-[#031429] border-[#598EBC]">
                {specializations.map((spec) => (
                  <SelectItem
                    key={spec}
                    value={spec}
                    className="text-white focus:bg-[#598EBC]/20"
                  >
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasInternPositions}
                onChange={(e) =>
                  setHasInternPositions(e.target.checked)
                }
                className="w-5 h-5 accent-[#598EBC]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#598EBC] transition-colors">
                Стажерские позиции
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasEntryPositions}
                onChange={(e) =>
                  setHasEntryPositions(e.target.checked)
                }
                className="w-5 h-5 accent-[#598EBC]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#598EBC] transition-colors">
                Начальные позиции
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasAdvancedPositions}
                onChange={(e) =>
                  setHasAdvancedPositions(e.target.checked)
                }
                className="w-5 h-5 accent-[#598EBC]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#598EBC] transition-colors">
                Последующие позиции
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasSupportMeasures}
                onChange={(e) =>
                  setHasSupportMeasures(e.target.checked)
                }
                className="w-5 h-5 accent-[#598EBC]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#598EBC] transition-colors">
                Меры поддержки
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasAdvancedEngineeringSchool}
                onChange={(e) =>
                  setHasAdvancedEngineeringSchool(
                    e.target.checked,
                  )
                }
                className="w-5 h-5 accent-[#598EBC]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#598EBC] transition-colors">
                Передовая инженерная школа
              </span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#598EBC] animate-bounce-slow drop-shadow-[0_0_10px_rgba(89,142,188,0.8)]" />
          <span className="text-[#92A8B4] text-sm uppercase tracking-wide">
            {filteredUniversities.length}{" "}
            {filteredUniversities.length === 1
              ? "вуз"
              : "вузов"}
          </span>
        </div>

        {/* Universities Grid */}
        {filteredUniversities.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((uni, index) => (
              <button
                key={uni.id}
                className="border-3 border-[#598EBC]/50 hover:border-[#598EBC] transition-all p-6 bg-[#031429]/90 backdrop-blur-sm hover-lift group relative corner-accent text-left text-[#598EBC] shadow-[0_0_20px_rgba(89,142,188,0.2)] hover:shadow-[0_0_40px_rgba(89,142,188,0.5)]"
                onClick={() => setSelectedUniversity(uni)}
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 border-2 border-[#598EBC]/50 flex items-center justify-center shrink-0 group-hover:border-[#598EBC] group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 bg-[#598EBC]/10 shadow-[0_0_15px_rgba(89,142,188,0.3)]">
                      <Hexagon className="w-5 h-5 text-[#598EBC] drop-shadow-[0_0_10px_rgba(89,142,188,0.8)]" />
                    </div>
                    <h3 className="text-lg uppercase tracking-wide text-white group-hover:text-[#598EBC] transition-all flex-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      {uni.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#92A8B4] mb-4 group-hover:text-[#598EBC] transition-colors">
                    <MapPin className="w-4 h-4" />
                    <span>{uni.city}</span>
                  </div>

                  {uni.specializations &&
                    uni.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {uni.specializations
                          .slice(0, 2)
                          .map((spec, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-3 py-1.5 border-2 border-[#598EBC]/30 text-[#92A8B4] group-hover:border-[#598EBC] group-hover:text-white transition-all bg-[#051b3a]/50"
                            >
                              {spec}
                            </span>
                          ))}
                      </div>
                    )}

                  <div className="space-y-2 text-xs">
                    {uni.internPositions &&
                      uni.internPositions.length > 0 && (
                        <div className="text-[#598EBC] flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#598EBC] rounded-full pulse-dot shadow-[0_0_8px_rgba(89,142,188,0.8)]" />
                          Стажерские позиции
                        </div>
                      )}
                    {uni.entryPositions &&
                      uni.entryPositions.length > 0 && (
                        <div className="text-[#92A8B4] flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#92A8B4] rounded-full pulse-dot shadow-[0_0_8px_rgba(146,168,180,0.6)]" />
                          Начальные позиции
                        </div>
                      )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-3 border-[#598EBC]/30 corner-accent text-[#598EBC] bg-[#031429]/90 backdrop-blur-sm shadow-[0_0_30px_rgba(89,142,188,0.3)]">
            <p className="text-[#92A8B4]">
              {universities.length === 0
                ? "Нет данных о вузах. Добавьте вузы через админ-панель."
                : "По вашему запросу ничего не найдено"}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedUniversity && (
        <UniversityDetailsDialog
          university={selectedUniversity}
          open={!!selectedUniversity}
          onOpenChange={() => setSelectedUniversity(null)}
          onClose={() => setSelectedUniversity(null)}
        />
      )}
    </div>
  );
}