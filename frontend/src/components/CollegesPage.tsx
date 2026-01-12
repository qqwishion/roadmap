import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Search, MapPin, ExternalLink, Phone, Mail, Award, TrendingUp, Building, GraduationCap, Briefcase, Hexagon, Video, Star } from "lucide-react";
import type { College, Region, Specialization } from "../types";
import { Comets } from "./Comets";
import { FloatingSquares } from "./FloatingSquares";
import { Stars } from "./Stars";
import { VideoPlayer } from "./VideoPlayer";
import { analytics } from "../services/analytics";
import { useApi } from "../hooks/useApi";
import { collegesApi, regionsApi, specializationsApi } from "../services/api";

/**
 * CollegesPage - Страница ссузов
 * 
 * Все данные загружаются из Django backend через API.
 * Для работы необходимо:
 * 1. Настроить VITE_API_URL в .env
 * 2. Создать модель College в Django
 * 3. Заполнить данные через django-admin
 * 
 * См. README.md для подробных инструкций
 */

export function CollegesPage() {
  // Состояния для фильтров
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSpecialization, setSelectedSpecialization] = useState("Все специальности");
  const [hasInternPositions, setHasInternPositions] = useState(false);
  const [hasEntryPositions, setHasEntryPositions] = useState(false);
  const [hasAdvancedPositions, setHasAdvancedPositions] = useState(false);
  const [hasSupportMeasures, setHasSupportMeasures] = useState(false);
  const [participatesInProfessionalism, setParticipatesInProfessionalism] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  
  // API запросы - регионы и специальности загружаем один раз
  const { data: apiRegions } = useApi<Region[]>(() => regionsApi.getAll(), []);
  const { data: apiSpecializations } = useApi<Specialization[]>(() => specializationsApi.getAll(), []);
  
  // Колледжи загружаем с параметрами фильтрации (region и search на сервере)
  const { data: apiColleges, loading, error } = useApi<College[]>(
    () => collegesApi.getAll({
      region: selectedRegion !== "all" ? selectedRegion : undefined,
      search: searchQuery || undefined,
    }),
    [selectedRegion, searchQuery] // Перезагружаем при изменении фильтров
  );
  
  // Используем API данные или пустой массив если нет данных
  const colleges = apiColleges || [];
  const regions = apiRegions || [];
  const specializations = ["Все специальности", ...(apiSpecializations?.map(s => s.name) || [])];
  
  // Клиентская фильтрация только по полям, которых нет в API
  const filteredColleges = colleges.filter((college) => {
    const matchesSpecialization = selectedSpecialization === "Все специальности" || 
                                  college.specializations.some(s => s.includes(selectedSpecialization));
    const matchesIntern = !hasInternPositions || college.internPositions.length > 0;
    const matchesEntry = !hasEntryPositions || college.entryPositions.length > 0;
    const matchesAdvanced = !hasAdvancedPositions || college.advancedPositions.length > 0;
    const matchesSupport = !hasSupportMeasures || 
                          [...college.internPositions, ...college.entryPositions, ...college.advancedPositions]
                            .some(pos => pos.supportMeasures.length > 0);
    const matchesProfessionalism = !participatesInProfessionalism || college.participates_in_professionalism === true;

    return matchesSpecialization && 
           matchesIntern && matchesEntry && matchesAdvanced && matchesSupport && matchesProfessionalism;
  });

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
      <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-[#392B7D]/15 blur-3xl color-orb-3" />
      <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-[#598EBC]/10 blur-3xl color-orb-1" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#EF3443]/5 blur-3xl color-orb-2" />
      
      {/* Рандомные плавающие рамки */}
      <FloatingSquares />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-6 md:mb-8 border-b-2 border-[#392B7D] pb-4 md:pb-6 energy-lines">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="w-10 h-10 md:w-14 md:h-14 border-2 md:border-3 border-[#392B7D] flex items-center justify-center relative corner-accent bg-[#031429] shadow-[0_0_30px_rgba(57,43,125,0.6)] shrink-0">
              <Award className="w-5 h-5 md:w-7 md:h-7 text-[#392B7D]" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#392B7D] drop-shadow-[0_0_20px_rgba(57,43,125,0.8)]">Ссузы</h1>
          </div>
          <p className="text-sm md:text-base text-[#92A8B4]">
            Средние специальные учебные заведения с программами подготовки для космической отрасли
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 border-3 border-[#392B7D]/50 bg-[#031429]/90 backdrop-blur-sm relative corner-accent hover:border-[#392B7D] transition-all shadow-[0_0_30px_rgba(57,43,125,0.3)] energy-lines hover:shadow-[0_0_40px_rgba(57,43,125,0.5)]">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#392B7D]" />
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#051b3a]/50 border-2 border-[#392B7D]/30 text-white placeholder:text-[#92A8B4] focus:border-[#392B7D] transition-all focus:shadow-[0_0_20px_rgba(57,43,125,0.4)]"
                />
              </div>
            </div>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="bg-[#051b3a]/50 border-2 border-[#392B7D]/30 text-white hover:border-[#392B7D] transition-all">
                <SelectValue placeholder="Все регионы" />
              </SelectTrigger>
              <SelectContent className="bg-[#031429] border-[#392B7D]">
                <SelectItem
                  value="all"
                  className="text-white focus:bg-[#392B7D]/20"
                >
                  Все регионы
                </SelectItem>
                {regions.map((region) => (
                  <SelectItem
                    key={region.id}
                    value={region.slug}
                    className="text-white focus:bg-[#392B7D]/20"
                  >
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="bg-[#051b3a]/50 border-2 border-[#392B7D]/30 text-white hover:border-[#392B7D] transition-all">
                <SelectValue placeholder="Специальность" />
              </SelectTrigger>
              <SelectContent className="bg-[#031429] border-[#392B7D]">
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec} className="text-white focus:bg-[#392B7D]/20">{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasInternPositions}
                onChange={(e) => setHasInternPositions(e.target.checked)}
                className="w-5 h-5 accent-[#392B7D]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#392B7D] transition-colors">
                Стажерские позиции
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasEntryPositions}
                onChange={(e) => setHasEntryPositions(e.target.checked)}
                className="w-5 h-5 accent-[#392B7D]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#392B7D] transition-colors">
                Начальные позиции
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasAdvancedPositions}
                onChange={(e) => setHasAdvancedPositions(e.target.checked)}
                className="w-5 h-5 accent-[#392B7D]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#392B7D] transition-colors">
                Последующие позиции
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasSupportMeasures}
                onChange={(e) => setHasSupportMeasures(e.target.checked)}
                className="w-5 h-5 accent-[#392B7D]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#392B7D] transition-colors">
                Меры поддержки
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={participatesInProfessionalism}
                onChange={(e) => setParticipatesInProfessionalism(e.target.checked)}
                className="w-5 h-5 accent-[#392B7D]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#392B7D] transition-colors">
                Профессионалитет
              </span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#392B7D] animate-bounce-slow" />
          <span className="text-[#92A8B4] text-sm uppercase tracking-wide">
            {loading ? "Загрузка..." : error ? "Ошибка загрузки" : `${filteredColleges.length} ${filteredColleges.length === 1 ? "ссуз" : "ссузов"}`}
          </span>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-3 border-[#392B7D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12 border-3 border-[#392B7D]/30 corner-accent bg-[#031429]/90 backdrop-blur-sm shadow-[0_0_30px_rgba(57,43,125,0.3)]">
            <p className="text-[#392B7D]">Ошибка загрузки ссузов</p>
            <p className="text-sm text-[#92A8B4] mt-2">{error}</p>
          </div>
        ) : filteredColleges.length === 0 ? (
          <div className="text-center py-20 border-3 border-[#392B7D]/30 corner-accent bg-[#031429]/90 backdrop-blur-sm shadow-[0_0_30px_rgba(57,43,125,0.3)]">
            <p className="text-[#92A8B4] text-lg mb-2">Ссузы не найдены</p>
            <p className="text-sm text-[#92A8B4] mb-4">
              {colleges.length === 0 
                ? "Backend API не настроен или база данных пуста" 
                : "Попробуйте изменить параметры фильтрации"}
            </p>
            {colleges.length === 0 && (
              <div className="mt-4 text-xs text-[#92A8B4]/70 max-w-md mx-auto">
                <p>Для добавления ссузов:</p>
                <ol className="text-left mt-2 space-y-1 pl-6">
                  <li>1. Настройте Django backend (см. README.md)</li>
                  <li>2. Добавьте ссузы через Django Admin</li>
                  <li>3. Укажите VITE_API_URL в .env файле</li>
                </ol>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college, index) => (
            <button
              key={college.id}
              className="border-3 border-[#392B7D]/50 hover:border-[#392B7D] transition-all p-6 bg-[#031429]/90 backdrop-blur-sm hover-lift group relative corner-accent text-left text-[#392B7D] shadow-[0_0_20px_rgba(57,43,125,0.2)] hover:shadow-[0_0_40px_rgba(57,43,125,0.5)]"
              onClick={() => {
                analytics.trackCollegeClick(college.id, college.name);
                setSelectedCollege(college);
              }}
              style={{ 
                animationDelay: `${index * 0.05}s`
              }}
            >
              <div className="relative z-10">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 border-2 border-[#392B7D]/50 flex items-center justify-center shrink-0 group-hover:border-[#392B7D] group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 bg-[#392B7D]/10 shadow-[0_0_15px_rgba(57,43,125,0.3)]">
                    <Hexagon className="w-5 h-5 text-[#392B7D] drop-shadow-[0_0_10px_rgba(57,43,125,0.8)]" />
                  </div>
                  <h3 className="text-lg uppercase tracking-wide text-white group-hover:text-[#392B7D] transition-all flex-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {college.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#92A8B4] mb-4 group-hover:text-[#392B7D] transition-colors">
                  <MapPin className="w-4 h-4" />
                  <span>{college.city}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {college.specializations.slice(0, 2).map((spec, idx) => (
                    <span key={idx} className="text-xs px-3 py-1.5 border-2 border-[#392B7D]/30 text-[#92A8B4] group-hover:border-[#392B7D] group-hover:text-white transition-all bg-[#051b3a]/50">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="space-y-2 text-xs">
                  {college.internPositions && college.internPositions.length > 0 && (
                    <div className="text-[#392B7D] flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#392B7D] rounded-full pulse-dot shadow-[0_0_8px_rgba(57,43,125,0.8)]" />
                      Стажерские позиции
                    </div>
                  )}
                  {college.entryPositions && college.entryPositions.length > 0 && (
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
        )}
      </div>

      {/* Detail Modal */}
      {selectedCollege && (
        <Dialog open={!!selectedCollege} onOpenChange={() => setSelectedCollege(null)}>
          <DialogContent className="max-w-[95vw] sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#031429] border-2 md:border-3 border-[#392B7D] shadow-[0_0_60px_rgba(57,43,125,0.6)] p-4 md:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl md:text-2xl text-white uppercase tracking-wide drop-shadow-[0_0_20px_rgba(57,43,125,0.8)]">
                {selectedCollege.name}
              </DialogTitle>
              <DialogDescription className="text-xs md:text-sm text-[#92A8B4] flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {selectedCollege.city}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 text-white">
              {selectedCollege.description && (
                <p className="text-[#92A8B4] leading-relaxed border-l-3 border-[#392B7D] pl-4 bg-[#051b3a]/50 p-3">{selectedCollege.description}</p>
              )}

              {/* Video Section */}
              {selectedCollege.video_url && (
                <div className="border-2 border-[#392B7D]/30 p-4 bg-[#051b3a]/50">
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-[#392B7D] flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    {selectedCollege.video_title || "Видео о ссузе"}
                  </h4>
                  {selectedCollege.video_description && (
                    <p className="text-sm text-[#92A8B4] mb-3">{selectedCollege.video_description}</p>
                  )}
                  <VideoPlayer url={selectedCollege.video_url} title={selectedCollege.video_title} />
                </div>
              )}

              <div>
                <h4 className="text-sm uppercase tracking-wide mb-3 text-[#392B7D] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Специальности
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCollege.specializations?.map((spec, idx) => (
                    <span key={idx} className="text-sm px-3 py-1.5 border-2 border-[#392B7D]/30 text-[#92A8B4] hover:border-[#392B7D] hover:text-white transition-all bg-[#051b3a]/50">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-2 border-[#392B7D]/30 p-4 hover:border-[#392B7D] transition-all bg-[#051b3a]/50 hover:shadow-[0_0_20px_rgba(57,43,125,0.3)]">
                  <h4 className="text-sm uppercase tracking-wide mb-2 text-[#392B7D]">После 9 класса</h4>
                  <p className="text-sm text-[#92A8B4]">{selectedCollege.pathAfter9}</p>
                </div>
                <div className="border-2 border-[#392B7D]/30 p-4 hover:border-[#392B7D] transition-all bg-[#051b3a]/50 hover:shadow-[0_0_20px_rgba(57,43,125,0.3)]">
                  <h4 className="text-sm uppercase tracking-wide mb-2 text-[#392B7D]">После 11 класса</h4>
                  <p className="text-sm text-[#92A8B4]">{selectedCollege.pathAfter11}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm uppercase tracking-wide mb-3 text-[#392B7D] flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Предприятия-партнеры
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCollege.partnerCompanies?.map((company, idx) => (
                    <span key={idx} className="text-sm px-3 py-1.5 border-2 border-[#392B7D]/30 text-[#92A8B4] hover:border-[#392B7D] hover:text-white transition-all bg-[#051b3a]/50">
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCollege.participates_in_professionalism && (
                <div className="border-2 border-[#392B7D]/30 p-4 bg-[#051b3a]/50 hover:border-[#392B7D] transition-all">
                  <h4 className="text-sm uppercase tracking-wide mb-2 text-[#392B7D] flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Участие в проекте Профессионалитет
                  </h4>
                  {selectedCollege.professionalism_info && (
                    <p className="text-sm text-[#92A8B4]">{selectedCollege.professionalism_info}</p>
                  )}
                </div>
              )}

              <div className="divider-colored my-6" />

              {selectedCollege.internPositions.length > 0 && (
                <div>
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-[#392B7D] flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Стажерские позиции
                  </h4>
                  <div className="space-y-3">
                    {selectedCollege.internPositions.map((pos, idx) => (
                      <div key={idx} className="border-2 border-[#392B7D]/30 p-4 hover:border-[#392B7D] transition-all bg-[#051b3a]/50 hover:shadow-[0_0_20px_rgba(57,43,125,0.3)]">
                        <div className="text-white mb-2">{pos.title}</div>
                        {pos.supportMeasures.length > 0 && (
                          <div className="text-sm text-[#92A8B4]">
                            <div className="mb-1 text-[#392B7D]">Меры поддержки:</div>
                            <ul className="space-y-1 ml-4">
                              {pos.supportMeasures.map((measure, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-[#392B7D]">✓</span>
                                  <span>{measure}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCollege.entryPositions.length > 0 && (
                <div>
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-[#392B7D] flex items-center gap-2 whitespace-nowrap">
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <span>Начальные позиции</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedCollege.entryPositions.map((pos, idx) => (
                      <div key={idx} className="border-2 border-[#392B7D]/30 p-4 hover:border-[#392B7D] transition-all bg-[#051b3a]/50 hover:shadow-[0_0_20px_rgba(57,43,125,0.3)]">
                        <div className="text-white mb-2">{pos.title}</div>
                        {pos.supportMeasures.length > 0 && (
                          <div className="text-sm text-[#92A8B4]">
                            <div className="mb-1 text-[#392B7D]">Меры поддержки:</div>
                            <ul className="space-y-1 ml-4">
                              {pos.supportMeasures.map((measure, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-[#392B7D]">✓</span>
                                  <span>{measure}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCollege.advancedPositions.length > 0 && (
                <div>
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-[#392B7D] flex items-center gap-2 whitespace-nowrap">
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <span>Последующие позиции</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedCollege.advancedPositions.map((pos, idx) => (
                      <div key={idx} className="border-2 border-[#392B7D]/30 p-4 hover:border-[#392B7D] transition-all bg-[#051b3a]/50 hover:shadow-[0_0_20px_rgba(57,43,125,0.3)]">
                        <div className="text-white mb-2">{pos.title}</div>
                        {pos.supportMeasures.length > 0 && (
                          <div className="text-sm text-[#92A8B4]">
                            <div className="mb-1 text-[#392B7D]">Меры поддержки:</div>
                            <ul className="space-y-1 ml-4">
                              {pos.supportMeasures.map((measure, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-[#392B7D]">✓</span>
                                  <span>{measure}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Videos Section */}
              {selectedCollege.related_videos && selectedCollege.related_videos.length > 0 && (
                <div>
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-[#392B7D] flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Связанные видео
                  </h4>
                  <div className="grid gap-4">
                    {selectedCollege.related_videos.map((videoId) => {
                      // TODO: Получать видео из API по videoId
                      const video = null; // Заглушка - замените на реальный API запрос
                      if (!video) return null;
                      return (
                        <div key={videoId} className="border-2 border-[#392B7D]/30 p-4 bg-[#051b3a]/50 hover:border-[#392B7D] transition-all">
                          <h5 className="text-white mb-2">{video.title}</h5>
                          <p className="text-sm text-[#92A8B4] mb-3">{video.description}</p>
                          <VideoPlayer url={video.video_url} title={video.title} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedCollege.contacts && (
                <div className="border-t-2 border-[#392B7D]/50 pt-4">
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-[#392B7D]">Контакты</h4>
                  <div className="space-y-2 text-sm">
                    {selectedCollege.contacts.phone && (
                      <div className="flex items-center gap-2 text-[#92A8B4]">
                        <Phone className="w-4 h-4 text-[#392B7D]" />
                        <span>{selectedCollege.contacts.phone}</span>
                      </div>
                    )}
                    {selectedCollege.contacts.email && (
                      <div className="flex items-center gap-2 text-[#92A8B4]">
                        <Mail className="w-4 h-4 text-[#392B7D]" />
                        <span>{selectedCollege.contacts.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full border-3 border-[#392B7D] hover:bg-[#392B7D] hover:text-white bg-[#031429] text-white uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(57,43,125,0.4)] hover:shadow-[0_0_40px_rgba(57,43,125,0.7)]"
                onClick={() => window.open(selectedCollege.site, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Официальный сайт
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}