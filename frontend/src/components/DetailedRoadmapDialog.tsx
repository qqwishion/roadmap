import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { School, GraduationCap, Building, Briefcase, Trophy, CheckCircle, ArrowRight, MapPin, Calendar, Target, Star, Lightbulb, Award, TrendingUp, Clock } from "lucide-react";
import { Button } from "./ui/button";
import type { CareerPath } from "../types";

interface DetailedRoadmapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  path: CareerPath;
  onSelectPath?: () => void;
  showSelectButton?: boolean;
}

export function DetailedRoadmapDialog({ 
  open, 
  onOpenChange, 
  path,
  onSelectPath,
  showSelectButton = true 
}: DetailedRoadmapDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[96vw] max-h-[95vh] bg-[#031429] border-5 border-[#598EBC] p-0 overflow-hidden flex flex-col shadow-[0_0_80px_rgba(89,142,188,0.7)]">
        {/* Header */}
        <div className="border-b-5 border-[#598EBC]/50 p-4 md:p-6 shrink-0 bg-gradient-to-r from-[#031429] via-[#051b3a] to-[#031429]">
          <h2 className="text-xl md:text-2xl uppercase tracking-[0.15em] text-white drop-shadow-[0_0_25px_rgba(89,142,188,0.9)] mb-1 md:mb-2">
            {path.title}
          </h2>
          <p className="text-sm md:text-base text-[#92A8B4]">{path.description}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto px-8 md:px-10 py-8 space-y-10">
          {/* ДЕТАЛЬНЫЕ ШАГИ */}
          {path.steps && path.steps.length > 0 && (
            <div className="border-5 border-[#598EBC]/50 p-8 bg-gradient-to-br from-[#051b3a]/80 to-[#031429]/80 backdrop-blur-sm shadow-[0_0_40px_rgba(89,142,188,0.3)] corner-accent">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 border-4 border-[#598EBC] flex items-center justify-center bg-[#051b3a] shadow-[0_0_25px_rgba(89,142,188,0.6)] shrink-0">
                  <TrendingUp className="w-8 h-8 text-[#598EBC]" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl uppercase tracking-wide text-white">Пошаговый план</h3>
                  <p className="text-sm text-[#92A8B4]">Детальная разбивка вашего пути</p>
                </div>
              </div>
              <div className="space-y-8">
                {path.steps.map((step, idx) => (
                  <div key={idx} className="relative pl-10 pb-8 border-l-5 border-[#598EBC]/50 last:border-l-0 last:pb-0">
                    <div className="absolute -left-4 top-0 w-8 h-8 rounded-full border-4 border-[#598EBC] bg-[#031429] flex items-center justify-center shadow-[0_0_20px_rgba(89,142,188,0.7)]">
                      <span className="text-sm text-[#598EBC]">{step.step}</span>
                    </div>
                    <div className="bg-[#051b3a]/50 p-6 border-3 border-[#598EBC]/30">
                      <h4 className="text-lg md:text-xl uppercase tracking-wide text-[#598EBC] mb-3">{step.title}</h4>
                      <p className="text-base text-[#92A8B4] mb-4 leading-relaxed">{step.description}</p>
                      {step.institutions && step.institutions.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-[#392B7D] mb-3 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Учебные заведения:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {step.institutions.map((inst, i) => (
                              <span key={i} className="px-3 py-1.5 bg-[#392B7D]/20 border-2 border-[#392B7D]/50 text-[#92A8B4] text-sm">
                                {inst}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {step.companies && step.companies.length > 0 && (
                        <div>
                          <p className="text-sm text-[#598EBC] mb-3 flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Предприятия:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {step.companies.map((comp, i) => (
                              <span key={i} className="px-3 py-1.5 bg-[#598EBC]/20 border-2 border-[#598EBC]/50 text-[#92A8B4] text-sm">
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ШКОЛА */}
          <div className="border-l-5 border-[#598EBC] pl-8 py-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 border-4 border-[#598EBC] flex items-center justify-center bg-[#051b3a] shadow-[0_0_25px_rgba(89,142,188,0.5)] shrink-0">
                <School className="w-7 h-7 text-[#598EBC]" />
              </div>
              <div>
                <h3 className="text-2xl uppercase tracking-wide text-white">Школа</h3>
                <p className="text-sm text-[#92A8B4]">Базовое образование</p>
              </div>
            </div>
            <div className="ml-18">
              <p className="text-base text-[#92A8B4] mb-3">
                <span className="text-[#598EBC]">Выбор:</span> {path.educationLevel || "11 классов"}
              </p>
              {(path.educationLevel === "11 классов" || !path.educationLevel) && (
                <p className="text-sm text-[#92A8B4] flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#598EBC] shrink-0 mt-0.5" />
                  Прямое поступление в вуз после сдачи ЕГЭ
                </p>
              )}
            </div>
          </div>

          {/* ОБРАЗОВАНИЕ */}
          {path.university && path.university.name && (
            <div className="border-l-5 border-[#392B7D] pl-8 py-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 border-4 border-[#392B7D] flex items-center justify-center bg-[#051b3a] shadow-[0_0_25px_rgba(57,43,125,0.5)] shrink-0">
                  <GraduationCap className="w-7 h-7 text-[#392B7D]" />
                </div>
                <div>
                  <h3 className="text-2xl uppercase tracking-wide text-white">Образование</h3>
                  <p className="text-sm text-[#92A8B4]">Профессиональная подготовка</p>
                </div>
              </div>
              <div className="ml-18 space-y-4">
                <div>
                  <p className="text-base text-[#92A8B4] mb-2">
                    <span className="text-[#392B7D]">Тип:</span> {path.institutionType || "Вуз"}
                  </p>
                  {path.direction && (
                    <p className="text-base text-[#92A8B4]">
                      <span className="text-[#392B7D]">Направление:</span> {path.direction}
                    </p>
                  )}
                </div>
                
                <div className="bg-[#051b3a]/50 p-5 border-3 border-[#392B7D]/30">
                  <p className="text-sm uppercase tracking-wide text-[#392B7D] mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Рекомендуемые вузы
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-[#392B7D] shrink-0 mt-0.5" />
                      <span className="text-base text-white">{path.university.name}</span>
                    </div>
                    {path.university.specializations && path.university.specializations.length > 0 && (
                      <div className="ml-8">
                        <p className="text-sm text-[#392B7D] mb-3">Специальности:</p>
                        <div className="flex flex-wrap gap-2">
                          {path.university.specializations.map((spec, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-[#392B7D]/20 border-2 border-[#392B7D]/50 text-[#92A8B4] text-sm">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* СТАЖИРОВКА */}
          {path.internship && path.internship.length > 0 && (
            <div className="border-l-5 border-[#598EBC] pl-8 py-6">
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
                  Предприятия для стажировки
                </p>
                <div className="space-y-5">
                  {path.internship.map((intern, idx) => (
                    <div key={idx} className="bg-[#051b3a]/50 p-5 border-3 border-[#598EBC]/30 shadow-[0_0_20px_rgba(89,142,188,0.15)]">
                      <div className="flex items-start gap-3 mb-3">
                        <Building className="w-6 h-6 text-[#598EBC] shrink-0 mt-0.5" />
                        <p className="text-base text-white">{intern.company}</p>
                      </div>
                      {intern.position && (
                        <p className="text-base text-[#92A8B4] mb-4 ml-9">{intern.position}</p>
                      )}
                      {intern.supportMeasures && intern.supportMeasures.length > 0 && (
                        <div className="ml-9">
                          <p className="text-sm text-[#598EBC] mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            Меры поддержки
                          </p>
                          <ul className="space-y-2">
                            {intern.supportMeasures.map((measure, mIdx) => (
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
          )}

          {/* НАЧАЛЬНЫЕ ПОЗИЦИИ */}
          {path.entryPositions && path.entryPositions.length > 0 && (
            <div className="border-l-5 border-[#392B7D] pl-8 py-6">
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
                {path.entryPositions.map((position, idx) => (
                  <div key={idx} className="bg-[#051b3a]/50 p-5 border-3 border-[#392B7D]/30">
                    <div className="flex items-start gap-3 mb-3">
                      <Briefcase className="w-6 h-6 text-[#392B7D] shrink-0 mt-0.5" />
                      <p className="text-base text-white">{position.position}</p>
                    </div>
                    {position.company && (
                      <p className="text-base text-[#92A8B4] mb-4 ml-9">{position.company}</p>
                    )}
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
          )}

          {/* ПОСЛЕДУЮЩИЕ ПОЗИЦИИ */}
          {path.advancedPositions && path.advancedPositions.length > 0 && (
            <div className="border-l-5 border-[#598EBC] pl-8 py-6">
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
                {path.advancedPositions.map((position, idx) => (
                  <div key={idx} className="bg-[#051b3a]/50 p-5 border-3 border-[#598EBC]/30">
                    <div className="flex items-start gap-3 mb-3">
                      <Award className="w-6 h-6 text-[#598EBC] shrink-0 mt-0.5" />
                      <p className="text-base text-white">{position.position}</p>
                    </div>
                    {position.company && (
                      <p className="text-base text-[#92A8B4] mb-4 ml-9">{position.company}</p>
                    )}
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
          )}

          {/* ИТОГИ КАРЬЕРЫ */}
          <div className="border-5 border-[#EF3443]/50 p-8 bg-gradient-to-br from-[#051b3a]/80 to-[#031429]/80 backdrop-blur-sm shadow-[0_0_40px_rgba(239,52,67,0.3)] corner-accent">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 border-4 border-[#EF3443] flex items-center justify-center bg-[#051b3a] shadow-[0_0_30px_rgba(239,52,67,0.7)] shrink-0">
                <Trophy className="w-8 h-8 text-[#EF3443]" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl uppercase tracking-wide text-white">Итоги карьеры</h3>
                <p className="text-sm text-[#92A8B4]">Ваши достижения и перспективы</p>
              </div>
            </div>
            <div className="space-y-5">
              {path.careerGoal && (
                <div className="bg-[#051b3a]/50 p-5 border-3 border-[#EF3443]/40">
                  <p className="text-sm uppercase tracking-wide text-[#EF3443] mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Карьерная цель
                  </p>
                  <p className="text-base text-white leading-relaxed">{path.careerGoal}</p>
                </div>
              )}

              {path.achievements && path.achievements.length > 0 && (
                <div>
                  <p className="text-sm uppercase tracking-wide text-[#EF3443] mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Ключевые достижения
                  </p>
                  <ul className="space-y-3">
                    {path.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-base text-[#92A8B4] flex items-start gap-3 bg-[#051b3a]/30 p-4 border-2 border-[#EF3443]/30">
                        <Star className="w-5 h-5 text-[#EF3443] shrink-0 mt-0.5" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-5 border-[#598EBC]/50 p-8 md:p-10 flex flex-col sm:flex-row gap-4 shrink-0 bg-gradient-to-r from-[#031429] via-[#051b3a] to-[#031429]">
          {showSelectButton && onSelectPath && (
            <Button
              onClick={() => {
                onSelectPath();
                onOpenChange(false);
              }}
              className="flex-1 bg-[#EF3443] hover:bg-[#EF3443]/80 text-white uppercase tracking-wide text-base py-6 shadow-[0_0_25px_rgba(239,52,67,0.5)] hover:shadow-[0_0_35px_rgba(239,52,67,0.7)] transition-all"
            >
              Добавить в мои пути
            </Button>
          )}
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className={`${showSelectButton ? 'flex-1' : 'w-full'} border-3 border-[#598EBC] text-[#598EBC] hover:bg-[#598EBC]/20 uppercase tracking-wide text-base py-6 shadow-[0_0_20px_rgba(89,142,188,0.3)] hover:shadow-[0_0_30px_rgba(89,142,188,0.5)] transition-all`}
          >
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}