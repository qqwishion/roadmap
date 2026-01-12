import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { School, GraduationCap, Building, Briefcase, Trophy, CheckCircle, Calendar, Loader2, Award, Star, Lightbulb } from "lucide-react";
import type { SavedTrajectory, Direction, Profession, University, College, Company } from "../types";
import { useState, useEffect } from "react";
import { directionsApi, professionsApi, universitiesApi, collegesApi, companiesApi } from "../services/api";

interface CustomPathDetailsDialogProps {
  trajectory: SavedTrajectory | null;
  open?: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
}

const stepIcons: Record<string, any> = {
  "education-level": School,
  "institution": GraduationCap,
  "direction": Building,
  "internship": Briefcase,
  "career": Trophy,
};

const stepTitles: Record<string, string> = {
  "education-level": "Школа",
  "institution": "Учебное заведение",
  "direction": "Направление",
  "internship": "Стажировка",
  "career": "Карьера",
};

export function CustomPathDetailsDialog({ trajectory, open, onClose, onOpenChange }: CustomPathDetailsDialogProps) {
  if (!trajectory || trajectory.type !== 'custom' || !trajectory.selections) return null;

  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
    onClose();
  };

  const selections = Object.entries(trajectory.selections);

  // Состояния для загруженных данных
  const [loading, setLoading] = useState(true);
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<Profession | null>(null);
  const [relatedUniversities, setRelatedUniversities] = useState<University[]>([]);
  const [relatedColleges, setRelatedColleges] = useState<College[]>([]);
  const [relatedCompanies, setRelatedCompanies] = useState<Company[]>([]);

  // Загрузка данных при открытии диалога
  useEffect(() => {
    if (!open || !trajectory.selections) return;
    
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Загружаем направления и профессии
        const [directionsRes, professionsRes] = await Promise.all([
          directionsApi.getAll(),
          professionsApi.getAll()
        ]);

        const directions = Array.isArray(directionsRes.data) ? directionsRes.data : [];
        const professions = Array.isArray(professionsRes.data) ? professionsRes.data : [];

        // Находим выбранное направление
        const directionName = trajectory.selections["direction"];
        const direction = directions.find((d: Direction) => d.name === directionName);
        setSelectedDirection(direction || null);

        // Находим выбранную профессию
        const professionName = trajectory.selections["career"];
        const profession = professions.find((p: Profession) => p.name === professionName);
        setSelectedProfession(profession || null);

        // Определяем тип учебного заведения
        const institutionType = trajectory.selections["institution"];
        const showUniversities = institutionType === "Вуз" || institutionType === "Ссуз с переходом в Вуз";
        const showColleges = institutionType === "Ссуз" || institutionType === "Ссуз с переходом в Вуз";

        // Загружаем связанные ВУЗы и ССУЗы если есть направление
        if (direction) {
          const promises = [];
          
          if (showUniversities) {
            promises.push(universitiesApi.getAll({ direction: direction.name }));
          }
          
          if (showColleges) {
            promises.push(collegesApi.getAll({ direction: direction.name }));
          }
          
          const results = await Promise.all(promises);
          
          let resultIndex = 0;
          if (showUniversities) {
            setRelatedUniversities(Array.isArray(results[resultIndex]?.data) ? results[resultIndex].data : []);
            resultIndex++;
          }
          
          if (showColleges) {
            setRelatedColleges(Array.isArray(results[resultIndex]?.data) ? results[resultIndex].data : []);
          }
        }

        // Загружаем связанные компании если есть профессия
        if (profession) {
          const companiesRes = await companiesApi.getAll({ specialization: profession.name });
          setRelatedCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
        }
        
      } catch (error) {
        console.error('Error loading trajectory data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [open, trajectory]);

  return (
    <Dialog open={open !== undefined ? open : !!trajectory} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-[96vw] max-h-[95vh] bg-[#031429] border-5 border-[#598EBC] p-0 overflow-hidden flex flex-col shadow-[0_0_80px_rgba(89,142,188,0.7)]">
        <DialogHeader className="border-b-5 border-[#598EBC]/50 p-4 md:p-5 shrink-0 bg-gradient-to-r from-[#031429] via-[#051b3a] to-[#031429]">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 border-3 border-[#598EBC] flex items-center justify-center bg-[#051b3a] shadow-[0_0_25px_rgba(89,142,188,0.6)] shrink-0">
              <Trophy className="w-6 h-6 text-[#598EBC]" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl md:text-2xl uppercase tracking-[0.15em] text-[#598EBC] mb-2 drop-shadow-[0_0_20px_rgba(89,142,188,0.8)]">
                {trajectory.pathTitle}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#598EBC]/20 border-2 border-[#598EBC]/50 text-[#598EBC] text-xs uppercase tracking-wide">
                  Свой путь
                </span>
                <span className="text-sm text-[#92A8B4] flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(trajectory.timestamp).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-[#598EBC] animate-spin" />
            </div>
          ) : (
            <>
              {/* Пошаговый план */}
              <div className="mb-8">
                <h3 className="text-xl uppercase tracking-wider text-[#598EBC] mb-6 flex items-center gap-3">
                  <div className="w-1 h-6 bg-[#598EBC]"></div>
                  Ваш путь
                </h3>

                <div className="space-y-4">
                  {selections.map(([key, value], index) => {
                    const Icon = stepIcons[key] || CheckCircle;
                    const title = stepTitles[key] || key;
                    
                    return (
                      <div 
                        key={key}
                        className="border-3 border-[#598EBC]/30 p-6 bg-[#051b3a]/30 hover:border-[#598EBC]/50 transition-all shadow-[0_0_15px_rgba(89,142,188,0.1)]"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 border-3 border-[#598EBC] flex items-center justify-center bg-[#031429] shrink-0 shadow-[0_0_20px_rgba(89,142,188,0.4)]">
                            <Icon className="w-6 h-6 text-[#598EBC]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[#598EBC] text-sm uppercase tracking-wider">
                                Шаг {index + 1}
                              </span>
                              <div className="h-px flex-1 bg-[#598EBC]/30"></div>
                            </div>
                            <h4 className="text-lg uppercase tracking-wide text-white mb-2">
                              {title}
                            </h4>
                            <p className="text-[#92A8B4]">
                              {value}
                            </p>
                          </div>
                          <CheckCircle className="w-6 h-6 text-[#598EBC] shrink-0" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* О направлении */}
              {selectedDirection && (
                <div className="mb-8 border-l-5 border-[#392B7D] pl-6 py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Building className="w-6 h-6 text-[#392B7D]" />
                    <h3 className="text-xl uppercase tracking-wide text-white">О направлении</h3>
                  </div>
                  <p className="text-base text-[#92A8B4] mb-4">{selectedDirection.description}</p>
                  
                  {selectedDirection.subjects && selectedDirection.subjects.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm uppercase tracking-wide text-[#392B7D] mb-3">Профильные предметы</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDirection.subjects.map((subject, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-[#392B7D]/20 border-2 border-[#392B7D]/50 text-white text-sm">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDirection.recommendation && (
                    <div className="p-4 bg-[#392B7D]/10 border-2 border-[#392B7D]/30 flex items-start gap-3">
                      <Star className="w-5 h-5 text-[#392B7D] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm uppercase tracking-wide text-[#392B7D] mb-2">Рекомендация</p>
                        <p className="text-sm text-[#92A8B4]">{selectedDirection.recommendation}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Рекомендуемые ВУЗы */}
              {relatedUniversities.length > 0 && (
                <div className="mb-8 border-l-5 border-[#392B7D] pl-6 py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap className="w-6 h-6 text-[#392B7D]" />
                    <h3 className="text-xl uppercase tracking-wide text-white">Рекомендуемые ВУЗы</h3>
                  </div>
                  <div className="space-y-3">
                    {relatedUniversities.slice(0, 5).map((university) => (
                      <div key={university.id} className="bg-[#051b3a]/50 p-4 border-2 border-[#392B7D]/30">
                        <p className="text-base text-white mb-1">{university.name}</p>
                        {university.city && (
                          <p className="text-sm text-[#92A8B4]">📍 {university.city}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Рекомендуемые ССУЗы */}
              {relatedColleges.length > 0 && (
                <div className="mb-8 border-l-5 border-[#598EBC] pl-6 py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap className="w-6 h-6 text-[#598EBC]" />
                    <h3 className="text-xl uppercase tracking-wide text-white">Рекомендуемые ССУЗы</h3>
                  </div>
                  <div className="space-y-3">
                    {relatedColleges.slice(0, 5).map((college) => (
                      <div key={college.id} className="bg-[#051b3a]/50 p-4 border-2 border-[#598EBC]/30">
                        <p className="text-base text-white mb-1">{college.name}</p>
                        {college.city && (
                          <p className="text-sm text-[#92A8B4]">📍 {college.city}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* О профессии */}
              {selectedProfession && (
                <div className="mb-8 border-l-5 border-[#EF3443] pl-6 py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="w-6 h-6 text-[#EF3443]" />
                    <h3 className="text-xl uppercase tracking-wide text-white">О профессии</h3>
                  </div>
                  <p className="text-base text-[#92A8B4] mb-4">{selectedProfession.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {selectedProfession.salary_range && (
                      <div>
                        <p className="text-sm uppercase tracking-wide text-[#EF3443] mb-1">Зарплата</p>
                        <p className="text-base text-white">{selectedProfession.salary_range}</p>
                      </div>
                    )}
                    
                    {selectedProfession.demand_level && (
                      <div>
                        <p className="text-sm uppercase tracking-wide text-[#EF3443] mb-1">Востребованность</p>
                        <p className="text-base text-white">
                          {selectedProfession.demand_level === 'high' && 'Высокая'}
                          {selectedProfession.demand_level === 'medium' && 'Средняя'}
                          {selectedProfession.demand_level === 'low' && 'Низкая'}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedProfession.skills && selectedProfession.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm uppercase tracking-wide text-[#EF3443] mb-3">Необходимые навыки</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfession.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-[#EF3443]/20 border-2 border-[#EF3443]/50 text-white text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProfession.requirements && selectedProfession.requirements.length > 0 && (
                    <div>
                      <p className="text-sm uppercase tracking-wide text-[#EF3443] mb-3">Требования</p>
                      <ul className="space-y-2">
                        {selectedProfession.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-[#92A8B4]">
                            <CheckCircle className="w-4 h-4 text-[#EF3443] shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* СТАЖЕРСКИЕ ПОЗИЦИИ */}
              {(() => {
                // Собираем стажерские позиции из всех источников
                const internPositions = [
                  ...relatedUniversities.flatMap(uni => 
                    (uni.internPositions || []).map(pos => ({ ...pos, source: uni.name, sourceType: 'university' as const }))
                  ),
                  ...relatedColleges.flatMap(college => 
                    (college.internPositions || []).map(pos => ({ ...pos, source: college.name, sourceType: 'college' as const }))
                  ),
                  ...relatedCompanies.flatMap(company => 
                    (company.internPositions || []).map(pos => ({ ...pos, source: company.name, sourceType: 'company' as const }))
                  ),
                ];

                if (internPositions.length === 0) return null;

                return (
                  <div className="border-l-5 border-[#598EBC] pl-8 py-6 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 border-4 border-[#598EBC] flex items-center justify-center bg-[#051b3a] shadow-[0_0_25px_rgba(89,142,188,0.5)] shrink-0">
                        <Briefcase className="w-7 h-7 text-[#598EBC]" />
                      </div>
                      <div>
                        <h3 className="text-2xl uppercase tracking-wide text-white">Стажировка</h3>
                        <p className="text-sm text-[#92A8B4]">Практический опыт</p>
                      </div>
                    </div>
                    <div className="ml-18">
                      <p className="text-sm uppercase tracking-wide text-[#598EBC] mb-4 flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Стажерские позиции
                      </p>
                      <div className="space-y-5">
                        {internPositions.slice(0, 6).map((position, idx) => (
                          <div key={idx} className="bg-[#051b3a]/50 p-5 border-3 border-[#598EBC]/30 shadow-[0_0_20px_rgba(89,142,188,0.15)]">
                            <div className="flex items-start gap-3 mb-3">
                              <Briefcase className="w-6 h-6 text-[#598EBC] shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-base text-white mb-1">{position.title}</p>
                                <p className="text-sm text-[#92A8B4]">{position.source}</p>
                              </div>
                            </div>
                            {position.supportMeasures && position.supportMeasures.length > 0 && (
                              <div className="ml-9">
                                <p className="text-sm text-[#598EBC] mb-3 flex items-center gap-2">
                                  <Star className="w-4 h-4" />
                                  Меры поддержки
                                </p>
                                <ul className="space-y-2">
                                  {position.supportMeasures.map((measure, mIdx) => (
                                    <li key={mIdx} className="text-sm text-[#92A8B4] flex items-start gap-2">
                                      <CheckCircle className="w-4 h-4 text-[#598EBC] shrink-0 mt-0.5" />
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
                  </div>
                );
              })()}

              {/* НАЧАЛЬНЫЕ ПОЗИЦИИ */}
              {(() => {
                // Собираем начальные позиции из всех источников
                const entryPositions = [
                  ...relatedUniversities.flatMap(uni => 
                    (uni.entryPositions || []).map(pos => ({ ...pos, source: uni.name, sourceType: 'university' as const }))
                  ),
                  ...relatedColleges.flatMap(college => 
                    (college.entryPositions || []).map(pos => ({ ...pos, source: college.name, sourceType: 'college' as const }))
                  ),
                  ...relatedCompanies.flatMap(company => 
                    (company.entryPositions || []).map(pos => ({ ...pos, source: company.name, sourceType: 'company' as const }))
                  ),
                ];

                if (entryPositions.length === 0) return null;

                return (
                  <div className="border-l-5 border-[#392B7D] pl-8 py-6 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 border-4 border-[#392B7D] flex items-center justify-center bg-[#051b3a] shadow-[0_0_25px_rgba(57,43,125,0.5)] shrink-0">
                        <Building className="w-7 h-7 text-[#392B7D]" />
                      </div>
                      <div>
                        <h3 className="text-2xl uppercase tracking-wide text-white">Начальные позиции</h3>
                        <p className="text-sm text-[#92A8B4]">Старт карьеры</p>
                      </div>
                    </div>
                    <div className="ml-18 space-y-5">
                      {entryPositions.slice(0, 6).map((position, idx) => (
                        <div key={idx} className="bg-[#051b3a]/50 p-5 border-3 border-[#392B7D]/30">
                          <div className="flex items-start gap-3 mb-3">
                            <Briefcase className="w-6 h-6 text-[#392B7D] shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-base text-white mb-1">{position.title}</p>
                              <p className="text-sm text-[#92A8B4]">{position.source}</p>
                            </div>
                          </div>
                          {position.supportMeasures && position.supportMeasures.length > 0 && (
                            <div className="ml-9">
                              <p className="text-sm text-[#392B7D] mb-3 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" />
                                Меры поддержки
                              </p>
                              <ul className="space-y-2">
                                {position.supportMeasures.map((measure, mIdx) => (
                                  <li key={mIdx} className="text-sm text-[#92A8B4] flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#392B7D] shrink-0 mt-0.5" />
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
                );
              })()}

              {/* ПОСЛЕДУЮЩИЕ ПОЗИЦИИ */}
              {(() => {
                // Собираем последующие позиции из всех источников
                const advancedPositions = [
                  ...relatedUniversities.flatMap(uni => 
                    (uni.advancedPositions || []).map(pos => ({ ...pos, source: uni.name, sourceType: 'university' as const }))
                  ),
                  ...relatedColleges.flatMap(college => 
                    (college.advancedPositions || []).map(pos => ({ ...pos, source: college.name, sourceType: 'college' as const }))
                  ),
                  ...relatedCompanies.flatMap(company => 
                    (company.advancedPositions || []).map(pos => ({ ...pos, source: company.name, sourceType: 'company' as const }))
                  ),
                ];

                if (advancedPositions.length === 0) return null;

                return (
                  <div className="border-l-5 border-[#598EBC] pl-8 py-6 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 border-4 border-[#598EBC] flex items-center justify-center bg-[#051b3a] shadow-[0_0_25px_rgba(89,142,188,0.5)] shrink-0">
                        <Trophy className="w-7 h-7 text-[#598EBC]" />
                      </div>
                      <div>
                        <h3 className="text-2xl uppercase tracking-wide text-white">Последующие позиции</h3>
                        <p className="text-sm text-[#92A8B4]">Карьерный рост</p>
                      </div>
                    </div>
                    <div className="ml-18 space-y-5">
                      {advancedPositions.slice(0, 6).map((position, idx) => (
                        <div key={idx} className="bg-[#051b3a]/50 p-5 border-3 border-[#598EBC]/30">
                          <div className="flex items-start gap-3 mb-3">
                            <Award className="w-6 h-6 text-[#598EBC] shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-base text-white mb-1">{position.title}</p>
                              <p className="text-sm text-[#92A8B4]">{position.source}</p>
                            </div>
                          </div>
                          {position.supportMeasures && position.supportMeasures.length > 0 && (
                            <div className="ml-9">
                              <p className="text-sm text-[#598EBC] mb-3 flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                Преимущества
                              </p>
                              <ul className="space-y-2">
                                {position.supportMeasures.map((measure, mIdx) => (
                                  <li key={mIdx} className="text-sm text-[#92A8B4] flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#598EBC] shrink-0 mt-0.5" />
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
                );
              })()}

              {/* Предприятия для стажировки */}
              {relatedCompanies.length > 0 && (
                <div className="mb-8 border-l-5 border-[#598EBC] pl-6 py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="w-6 h-6 text-[#598EBC]" />
                    <h3 className="text-xl uppercase tracking-wide text-white">Предприятия для стажировки и работы</h3>
                  </div>
                  <div className="space-y-3">
                    {relatedCompanies.slice(0, 5).map((company) => (
                      <div key={company.id} className="bg-[#051b3a]/50 p-4 border-2 border-[#598EBC]/30">
                        <p className="text-base text-white mb-2">{company.name}</p>
                        {company.description && (
                          <p className="text-sm text-[#92A8B4] mb-2">{company.description}</p>
                        )}
                        {company.city && (
                          <p className="text-sm text-[#92A8B4]">📍 {company.city}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Итоговая рекомендация */}
              <div className="border-5 border-[#EF3443]/50 p-6 bg-gradient-to-br from-[#051b3a]/80 to-[#031429]/80 backdrop-blur-sm shadow-[0_0_40px_rgba(239,52,67,0.3)]">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-[#EF3443]" />
                  <h3 className="text-xl uppercase tracking-wide text-white">Итоги и рекомендации</h3>
                </div>
                <p className="text-[#92A8B4] text-sm leading-relaxed">
                  Следуйте этому плану поэтапно, уделяя особое внимание профильным предметам и практическим навыкам. 
                  Не забывайте про олимпиады и дополнительное образование — это даст вам преимущество при поступлении.
                  Рассмотрите возможность стажировки на космических предприятиях уже во время обучения.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="border-t-3 border-[#598EBC]/30 p-6 md:p-8 pt-6 shrink-0 bg-gradient-to-r from-[#031429] via-[#051b3a] to-[#031429]">
          <Button
            onClick={handleClose}
            variant="outline"
            className="w-full border-3 border-[#598EBC] text-[#598EBC] hover:bg-[#598EBC]/20 uppercase tracking-wide text-base py-6 shadow-[0_0_20px_rgba(89,142,188,0.3)] hover:shadow-[0_0_30px_rgba(89,142,188,0.5)] transition-all"
          >
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}