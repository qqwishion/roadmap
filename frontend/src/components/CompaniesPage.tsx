import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Search, MapPin, ExternalLink, Phone, Mail, Building, TrendingUp, GraduationCap, Briefcase, Hexagon, Zap, Video, Award } from "lucide-react";
import type { Company, Region, Specialization } from "../types";
import { Comets } from "./Comets";
import { FloatingSquares } from "./FloatingSquares";
import { Stars } from "./Stars";
import { VideoPlayer } from "./VideoPlayer";
import { analytics } from "../services/analytics";
import { useApi } from "../hooks/useApi";
import { companiesApi, regionsApi, specializationsApi } from "../services/api";

/**
 * CompaniesPage - Страница предприятий
 * 
 * Все данные загружаются из Django backend через API.
 * Для работы необходимо:
 * 1. Настроить VITE_API_URL в .env
 * 2. Создать модель Company в Django
 * 3. Заполнить данные через django-admin
 * 
 * См. README.md для подробных инструкций
 */

export function CompaniesPage() {
  // Состояния для фильтров
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSpecialization, setSelectedSpecialization] = useState("Все специальности");
  const [hasInternPositions, setHasInternPositions] = useState(false);
  const [hasEntryPositions, setHasEntryPositions] = useState(false);
  const [hasAdvancedPositions, setHasAdvancedPositions] = useState(false);
  const [hasSupportMeasures, setHasSupportMeasures] = useState(false);
  const [hasBaseDepartment, setHasBaseDepartment] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  // API запросы - регионы и специальности загружаем один раз
  const { data: apiRegions } = useApi<Region[]>(() => regionsApi.getAll(), []);
  const { data: apiSpecializations } = useApi<Specialization[]>(() => specializationsApi.getAll(), []);
  
  // Компании загружаем с параметрами фильтрации (region и search на сервере)
  const { data: apiCompanies, loading, error } = useApi<Company[]>(
    () => companiesApi.getAll({
      region: selectedRegion !== "all" ? selectedRegion : undefined,
      search: searchQuery || undefined,
    }),
    [selectedRegion, searchQuery] // Перезагружаем при изменении фильтров
  );
  
  // Используем API данные или пустой массив если нет данных
  const companies = apiCompanies || [];
  const regions = apiRegions || [];
  const specializations = ["Все специальности", ...(apiSpecializations?.map(s => s.name) || [])];
  
  // Клиентская фильтрация только по полям, которых нет в API  
  const filteredCompanies = companies.filter((company) => {
    const matchesSpecialization = selectedSpecialization === "Все специальности" || 
                                  (company.specializations && company.specializations.some(s => s.includes(selectedSpecialization)));
    const matchesIntern = !hasInternPositions || company.internPositions.length > 0;
    const matchesEntry = !hasEntryPositions || company.entryPositions.length > 0;
    const matchesAdvanced = !hasAdvancedPositions || company.advancedPositions.length > 0;
    const matchesSupport = !hasSupportMeasures || 
                          [...company.internPositions, ...company.entryPositions, ...company.advancedPositions]
                            .some(pos => pos.supportMeasures.length > 0);
    const matchesBaseDepartment = !hasBaseDepartment || company.has_base_department === true;

    return matchesSpecialization && matchesIntern && matchesEntry && matchesAdvanced && matchesSupport && matchesBaseDepartment;
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
      <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-[#EF3443]/15 blur-3xl color-orb-1" />
      <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-[#598EBC]/10 blur-3xl color-orb-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#392B7D]/10 blur-3xl color-orb-3" />
      
      {/* Рандомные плавающие рамки */}
      <FloatingSquares />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-6 md:mb-8 border-b-2 border-[#EF3443] pb-4 md:pb-6 energy-lines">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="w-10 h-10 md:w-14 md:h-14 border-2 md:border-3 border-[#EF3443] flex items-center justify-center relative corner-accent bg-[#031429] shadow-[0_0_30px_rgba(239,52,67,0.6)] text-[#EF3443] shrink-0">
              <Zap className="w-5 h-5 md:w-7 md:h-7 text-[#EF3443]" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#EF3443] drop-shadow-[0_0_20px_rgba(239,52,67,0.8)]">Предприятия</h1>
          </div>
          <p className="text-sm md:text-base text-[#92A8B4]">
            Ведущие предприятия ракетно-космической отрасли с программами стажировок и карьерными возможностями
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 border-3 border-[#EF3443]/50 bg-[#031429]/90 backdrop-blur-sm relative corner-accent hover:border-[#EF3443] transition-all shadow-[0_0_30px_rgba(239,52,67,0.3)] energy-lines hover:shadow-[0_0_40px_rgba(239,52,67,0.5)]">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#EF3443]" />
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#051b3a]/50 border-2 border-[#EF3443]/30 text-white placeholder:text-[#92A8B4] focus:border-[#EF3443] transition-all focus:shadow-[0_0_20px_rgba(239,52,67,0.4)]"
                />
              </div>
            </div>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="bg-[#051b3a]/50 border-2 border-[#EF3443]/30 text-white hover:border-[#EF3443] transition-all">
                <SelectValue placeholder="Все регионы" />
              </SelectTrigger>
              <SelectContent className="bg-[#031429] border-[#EF3443]">
                <SelectItem
                  value="all"
                  className="text-white focus:bg-[#EF3443]/20"
                >
                  Все регионы
                </SelectItem>
                {regions.map((region) => (
                  <SelectItem
                    key={region.id}
                    value={region.slug}
                    className="text-white focus:bg-[#EF3443]/20"
                  >
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="bg-[#051b3a]/50 border-2 border-[#EF3443]/30 text-white hover:border-[#EF3443] transition-all">
                <SelectValue placeholder="Специальность" />
              </SelectTrigger>
              <SelectContent className="bg-[#031429] border-[#EF3443]">
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec} className="text-white focus:bg-[#EF3443]/20">{spec}</SelectItem>
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
                className="w-5 h-5 accent-[#EF3443]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#EF3443] transition-colors">
                Стажерские позиции
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasEntryPositions}
                onChange={(e) => setHasEntryPositions(e.target.checked)}
                className="w-5 h-5 accent-[#EF3443]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#EF3443] transition-colors">
                Начальные позиции
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasAdvancedPositions}
                onChange={(e) => setHasAdvancedPositions(e.target.checked)}
                className="w-5 h-5 accent-[#EF3443]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#EF3443] transition-colors">
                Последующие позиции
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasSupportMeasures}
                onChange={(e) => setHasSupportMeasures(e.target.checked)}
                className="w-5 h-5 accent-[#EF3443]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#EF3443] transition-colors">
                Меры поддержки
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasBaseDepartment}
                onChange={(e) => setHasBaseDepartment(e.target.checked)}
                className="w-5 h-5 accent-[#EF3443]"
              />
              <span className="text-sm text-[#92A8B4] group-hover:text-[#EF3443] transition-colors">
                Базовая кафедра
              </span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#EF3443] animate-bounce-slow" />
          <span className="text-[#92A8B4] text-sm uppercase tracking-wide">
            {loading ? "Загрузка..." : error ? "Ошибка загрузки" : `${filteredCompanies.length} ${filteredCompanies.length === 1 ? "предприятие" : "предприятий"}`}
          </span>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-3 border-[#EF3443] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12 border-3 border-[#EF3443]/30 corner-accent bg-[#031429]/90 backdrop-blur-sm shadow-[0_0_30px_rgba(239,52,67,0.3)]">
            <p className="text-[#EF3443]">Ошибка загрузки предприятий</p>
            <p className="text-sm text-[#92A8B4] mt-2">{error}</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20 border-3 border-[#EF3443]/30 corner-accent bg-[#031429]/90 backdrop-blur-sm shadow-[0_0_30px_rgba(239,52,67,0.3)]">
            <p className="text-[#92A8B4] text-lg mb-2">Предприятия не найдены</p>
            <p className="text-sm text-[#92A8B4] mb-4">
              {companies.length === 0 
                ? "Backend API не настроен или база данных пуста" 
                : "Попробуйте изменить параметры фильтрации"}
            </p>
            {companies.length === 0 && (
              <div className="mt-4 text-xs text-[#92A8B4]/70 max-w-md mx-auto">
                <p>Для добавления предприятий:</p>
                <ol className="text-left mt-2 space-y-1 pl-6">
                  <li>1. Настройте Django backend (см. README.md)</li>
                  <li>2. Добавьте предприятия через Django Admin</li>
                  <li>3. Укажите VITE_API_URL в .env файле</li>
                </ol>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
            <button
              key={company.id}
              className="border-3 border-[#EF3443]/50 hover:border-[#EF3443] transition-all p-6 bg-[#031429]/90 backdrop-blur-sm hover-lift group relative corner-accent text-left text-[#EF3443] shadow-[0_0_20px_rgba(239,52,67,0.2)] hover:shadow-[0_0_40px_rgba(239,52,67,0.5)]"
              onClick={() => {
                analytics.trackCompanyClick(company.id, company.name);
                setSelectedCompany(company);
              }}
              style={{ 
                animationDelay: `${index * 0.05}s`
              }}
            >
              <div className="relative z-10">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 border-2 border-[#EF3443]/50 flex items-center justify-center shrink-0 group-hover:border-[#EF3443] group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 bg-[#EF3443]/10 shadow-[0_0_15px_rgba(239,52,67,0.3)]">
                    <Hexagon className="w-5 h-5 text-[#EF3443] drop-shadow-[0_0_10px_rgba(239,52,67,0.8)]" />
                  </div>
                  <h3 className="text-lg uppercase tracking-wide text-white group-hover:text-[#EF3443] transition-all flex-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {company.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#92A8B4] mb-4 group-hover:text-[#EF3443] transition-colors">
                  <MapPin className="w-4 h-4" />
                  <span>{company.city}</span>
                </div>

                {company.specializations && company.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {company.specializations.slice(0, 2).map((spec, idx) => (
                      <span key={idx} className="text-xs px-3 py-1.5 border-2 border-[#EF3443]/30 text-[#92A8B4] group-hover:border-[#EF3443] group-hover:text-white transition-all bg-[#051b3a]/50">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}

                <div className="space-y-2 text-xs">
                  {company.internPositions && company.internPositions.length > 0 && (
                    <div className="text-[#EF3443] flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#EF3443] rounded-full pulse-dot shadow-[0_0_8px_rgba(239,52,67,0.8)]" />
                      Стажерские позиции: {company.internPositions.length}
                    </div>
                  )}
                  {company.entryPositions && company.entryPositions.length > 0 && (
                    <div className="text-[#598EBC] flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#598EBC] rounded-full pulse-dot shadow-[0_0_8px_rgba(89,142,188,0.6)]" />
                      Начальные позиции: {company.entryPositions.length}
                    </div>
                  )}
                  {company.advancedPositions && company.advancedPositions.length > 0 && (
                    <div className="text-[#392B7D] flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#392B7D] rounded-full pulse-dot shadow-[0_0_8px_rgba(57,43,125,0.6)]" />
                      Последующие позиции: {company.advancedPositions.length}
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
      {selectedCompany && (
        <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
          <DialogContent className="max-w-[95vw] sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#031429] border-2 md:border-3 border-[#EF3443] shadow-[0_0_60px_rgba(239,52,67,0.6)] p-4 md:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl md:text-2xl text-white uppercase tracking-wide drop-shadow-[0_0_20px_rgba(239,52,67,0.8)]">
                {selectedCompany.name}
              </DialogTitle>
              <DialogDescription className="text-xs md:text-sm text-[#92A8B4] flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {selectedCompany.city}, {selectedCompany.region}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 text-white">
              {selectedCompany.description && (
                <p className="text-[#92A8B4] leading-relaxed border-l-3 border-[#EF3443] pl-4 bg-[#051b3a]/50 p-3">{selectedCompany.description}</p>
              )}

              {/* Video Section */}
              {selectedCompany.video_url && (
                <div className="border-2 border-[#EF3443]/30 p-4 bg-[#051b3a]/50">
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-[#EF3443] flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    {selectedCompany.video_title || "Видео о предприятии"}
                  </h4>
                  {selectedCompany.video_description && (
                    <p className="text-sm text-[#92A8B4] mb-3">{selectedCompany.video_description}</p>
                  )}
                  <VideoPlayer url={selectedCompany.video_url} title={selectedCompany.video_title} />
                </div>
              )}

              {selectedCompany.specializations && selectedCompany.specializations.length > 0 && (
                <div>
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-[#EF3443] flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Специальности
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.specializations.map((spec, idx) => (
                      <span key={idx} className="text-sm px-3 py-1.5 border-2 border-[#EF3443]/30 text-[#92A8B4] hover:border-[#EF3443] hover:text-white transition-all bg-[#051b3a]/50">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedCompany.has_base_department && (
                <div className="border-2 border-[#EF3443]/30 p-4 bg-[#051b3a]/50 hover:border-[#EF3443] transition-all">
                  <h4 className="text-sm uppercase tracking-wide mb-2 text-[#EF3443] flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Базовая кафедра
                  </h4>
                  {selectedCompany.base_department_name && (
                    <p className="text-sm text-[#92A8B4]">{selectedCompany.base_department_name}</p>
                  )}
                </div>
              )}

              <div>
                <h4 className="text-sm uppercase tracking-wide mb-3 text-[#EF3443] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Образовательные заведения-партнеры
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCompany.partnerEducation?.map((edu, idx) => (
                    <span key={idx} className="text-sm px-3 py-1.5 border-2 border-[#EF3443]/30 text-[#92A8B4] hover:border-[#EF3443] hover:text-white transition-all bg-[#051b3a]/50">
                      {edu}
                    </span>
                  ))}
                </div>
              </div>

              <div className="divider-colored my-6" />

              {selectedCompany.internPositions.length > 0 && (
                <div>
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-[#EF3443] flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Стажерские позиции
                  </h4>
                  <div className="space-y-3">
                    {selectedCompany.internPositions.map((pos, idx) => (
                      <div key={idx} className="border-2 border-[#EF3443]/30 p-4 hover:border-[#EF3443] transition-all bg-[#051b3a]/50 hover:shadow-[0_0_20px_rgba(239,52,67,0.3)]">
                        <div className="text-white mb-2">{pos.title}</div>
                        {pos.supportMeasures.length > 0 && (
                          <div className="text-sm text-[#92A8B4]">
                            <div className="mb-1 text-[#EF3443]">Меры поддержки:</div>
                            <ul className="space-y-1 ml-4">
                              {pos.supportMeasures.map((measure, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-[#EF3443]">✓</span>
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

              {selectedCompany.entryPositions.length > 0 && (
                <div>
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-[#EF3443] flex items-center gap-2 whitespace-nowrap">
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <span>Начальные позиции</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedCompany.entryPositions.map((pos, idx) => (
                      <div key={idx} className="border-2 border-[#EF3443]/30 p-4 hover:border-[#EF3443] transition-all bg-[#051b3a]/50 hover:shadow-[0_0_20px_rgba(239,52,67,0.3)]">
                        <div className="text-white mb-2">{pos.title}</div>
                        {pos.supportMeasures.length > 0 && (
                          <div className="text-sm text-[#92A8B4]">
                            <div className="mb-1 text-[#EF3443]">Меры поддержки:</div>
                            <ul className="space-y-1 ml-4">
                              {pos.supportMeasures.map((measure, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-[#EF3443]">✓</span>
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

              {selectedCompany.advancedPositions.length > 0 && (
                <div>
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-[#EF3443] flex items-center gap-2 whitespace-nowrap">
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <span>Последующие позиции</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedCompany.advancedPositions.map((pos, idx) => (
                      <div key={idx} className="border-2 border-[#EF3443]/30 p-4 hover:border-[#EF3443] transition-all bg-[#051b3a]/50 hover:shadow-[0_0_20px_rgba(239,52,67,0.3)]">
                        <div className="text-white mb-2">{pos.title}</div>
                        {pos.supportMeasures.length > 0 && (
                          <div className="text-sm text-[#92A8B4]">
                            <div className="mb-1 text-[#EF3443]">Меры поддержки:</div>
                            <ul className="space-y-1 ml-4">
                              {pos.supportMeasures.map((measure, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-[#EF3443]">✓</span>
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
              {selectedCompany.related_videos && selectedCompany.related_videos.length > 0 && (
                <div>
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-[#EF3443] flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Связанные видео
                  </h4>
                  <div className="grid gap-4">
                    {selectedCompany.related_videos.map((videoId) => {
                      // TODO: Получать видео из API по videoId
                      const video = null; // Заглушка - замените на реальный API запрос
                      if (!video) return null;
                      return (
                        <div key={videoId} className="border-2 border-[#EF3443]/30 p-4 bg-[#051b3a]/50 hover:border-[#EF3443] transition-all">
                          <h5 className="text-white mb-2">{video.title}</h5>
                          <p className="text-sm text-[#92A8B4] mb-3">{video.description}</p>
                          <VideoPlayer url={video.video_url} title={video.title} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedCompany.contacts && (
                <div className="border-t-2 border-[#EF3443]/50 pt-4">
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-[#EF3443]">Контакты</h4>
                  <div className="space-y-2 text-sm">
                    {selectedCompany.contacts.phone && (
                      <div className="flex items-center gap-2 text-[#92A8B4]">
                        <Phone className="w-4 h-4 text-[#EF3443]" />
                        <span>{selectedCompany.contacts.phone}</span>
                      </div>
                    )}
                    {selectedCompany.contacts.email && (
                      <div className="flex items-center gap-2 text-[#92A8B4]">
                        <Mail className="w-4 h-4 text-[#EF3443]" />
                        <span>{selectedCompany.contacts.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full border-3 border-[#EF3443] hover:bg-[#EF3443] hover:text-white bg-[#031429] text-white uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(239,52,67,0.4)] hover:shadow-[0_0_40px_rgba(239,52,67,0.7)]"
                onClick={() => window.open(selectedCompany.site, '_blank')}
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