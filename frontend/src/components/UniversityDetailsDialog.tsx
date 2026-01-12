import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { MapPin, ExternalLink, Phone, Mail, Building, GraduationCap, Briefcase, Video } from "lucide-react";
import type { University } from "../types";
import { VideoPlayer } from "./VideoPlayer";

interface UniversityDetailsDialogProps {
  university: University | null;
  open?: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function UniversityDetailsDialog({ university, open, onClose, onOpenChange }: UniversityDetailsDialogProps) {
  if (!university) return null;

  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#031429] border-2 md:border-3 border-[#598EBC] shadow-[0_0_60px_rgba(89,142,188,0.6)] p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl text-white uppercase tracking-wide drop-shadow-[0_0_20px_rgba(89,142,188,0.8)]">
            {university.name}
          </DialogTitle>
          <DialogDescription className="text-xs md:text-sm text-[#92A8B4] flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {university.city}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-white">
          {university.description && (
            <p className="text-[#92A8B4] leading-relaxed border-l-3 border-[#598EBC] pl-4 bg-[#051b3a]/50 p-3">{university.description}</p>
          )}

          {/* Видео */}
          {university.videos && university.videos.length > 0 && (
            <div>
              <h4 className="text-sm uppercase tracking-wide mb-3 text-[#598EBC] flex items-center gap-2">
                <Video className="w-4 h-4" />
                Видео
              </h4>
              <div className="grid gap-4">
                {university.videos.map((video) => (
                  <div key={video.id} className="border-2 border-[#598EBC]/30 bg-[#051b3a]/50 overflow-hidden">
                    <VideoPlayer url={video.url} title={video.title} />
                    {video.title && (
                      <div className="p-3">
                        <p className="text-sm text-white mb-1">{video.title}</p>
                        {video.description && (
                          <p className="text-xs text-[#92A8B4]">{video.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {university.specializations && university.specializations.length > 0 && (
            <div>
              <h4 className="text-sm uppercase tracking-wide mb-3 text-[#598EBC] flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Специальности
              </h4>
              <div className="flex flex-wrap gap-2">
                {university.specializations.map((spec, idx) => (
                  <span key={idx} className="text-sm px-3 py-1.5 border-2 border-[#598EBC]/30 text-[#92A8B4] hover:border-[#598EBC] hover:text-white transition-all bg-[#051b3a]/50">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {university.pathAfter9 && (
              <div className="border-2 border-[#598EBC]/30 p-4 hover:border-[#598EBC] transition-all bg-[#051b3a]/50 hover:shadow-[0_0_20px_rgba(89,142,188,0.3)]">
                <h4 className="text-sm uppercase tracking-wide mb-2 text-[#598EBC]">После 9 класса</h4>
                <p className="text-sm text-[#92A8B4]">{university.pathAfter9}</p>
              </div>
            )}
            {university.pathAfter11 && (
              <div className="border-2 border-[#598EBC]/30 p-4 hover:border-[#598EBC] transition-all bg-[#051b3a]/50 hover:shadow-[0_0_20px_rgba(89,142,188,0.3)]">
                <h4 className="text-sm uppercase tracking-wide mb-2 text-[#598EBC]">После 11 класса</h4>
                <p className="text-sm text-[#92A8B4]">{university.pathAfter11}</p>
              </div>
            )}
          </div>

          {university.partnerCompanies && university.partnerCompanies.length > 0 && (
            <div>
              <h4 className="text-sm uppercase tracking-wide mb-3 text-[#598EBC] flex items-center gap-2">
                <Building className="w-4 h-4" />
                Предприятия-партнеры
              </h4>
              <div className="flex flex-wrap gap-2">
                {university.partnerCompanies.map((company, idx) => (
                  <span key={idx} className="text-sm px-3 py-1.5 border-2 border-[#598EBC]/30 text-[#92A8B4] hover:border-[#598EBC] hover:text-white transition-all bg-[#051b3a]/50">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          )}

          {university.has_advanced_engineering_school && university.advanced_engineering_school_info && (
            <div className="border-2 border-[#598EBC]/30 p-4 bg-[#051b3a]/50 hover:border-[#598EBC] transition-all">
              <h4 className="text-sm uppercase tracking-wide mb-2 text-[#598EBC] flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Передовая инженерная школа
              </h4>
              <p className="text-sm text-[#92A8B4]">{university.advanced_engineering_school_info}</p>
            </div>
          )}

          <div className="divider-colored my-6" />

          {university.internPositions && university.internPositions.length > 0 && (
            <div>
              <h4 className="text-sm uppercase tracking-wide mb-3 text-[#598EBC] flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Стажерские позиции
              </h4>
              <div className="space-y-3">
                {university.internPositions.map((pos, idx) => (
                  <div key={idx} className="border-2 border-[#598EBC]/30 p-4 hover:border-[#598EBC] transition-all bg-[#051b3a]/50 hover:shadow-[0_0_20px_rgba(89,142,188,0.3)]">
                    <div className="text-white mb-2">{pos.title}</div>
                    {pos.supportMeasures && pos.supportMeasures.length > 0 && (
                      <div className="text-sm text-[#92A8B4]">
                        <div className="mb-1 text-[#598EBC]">Меры поддержки:</div>
                        <ul className="space-y-1 ml-4">
                          {pos.supportMeasures.map((measure, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#598EBC]">✓</span>
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

          {university.entryPositions && university.entryPositions.length > 0 && (
            <div>
              <h4 className="text-sm uppercase tracking-wide mb-3 text-[#598EBC] flex items-center gap-2 whitespace-nowrap">
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>Начальные позиции</span>
              </h4>
              <div className="space-y-3">
                {university.entryPositions.map((pos, idx) => (
                  <div key={idx} className="border-2 border-[#598EBC]/30 p-4 hover:border-[#598EBC] transition-all bg-[#051b3a]/50 hover:shadow-[0_0_20px_rgba(89,142,188,0.3)]">
                    <div className="text-white mb-2">{pos.title}</div>
                    {pos.supportMeasures && pos.supportMeasures.length > 0 && (
                      <div className="text-sm text-[#92A8B4]">
                        <div className="mb-1 text-[#598EBC]">Меры поддержки:</div>
                        <ul className="space-y-1 ml-4">
                          {pos.supportMeasures.map((measure, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#598EBC]">✓</span>
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

          {university.advancedPositions && university.advancedPositions.length > 0 && (
            <div>
              <h4 className="text-sm uppercase tracking-wide mb-3 text-[#598EBC] flex items-center gap-2 whitespace-nowrap">
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>Последующие позиции</span>
              </h4>
              <div className="space-y-3">
                {university.advancedPositions.map((pos, idx) => (
                  <div key={idx} className="border-2 border-[#598EBC]/30 p-4 hover:border-[#598EBC] transition-all bg-[#051b3a]/50 hover:shadow-[0_0_20px_rgba(89,142,188,0.3)]">
                    <div className="text-white mb-2">{pos.title}</div>
                    {pos.supportMeasures && pos.supportMeasures.length > 0 && (
                      <div className="text-sm text-[#92A8B4]">
                        <div className="mb-1 text-[#598EBC]">Меры поддержки:</div>
                        <ul className="space-y-1 ml-4">
                          {pos.supportMeasures.map((measure, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#598EBC]">✓</span>
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

          {university.contacts && (
            <div className="border-t-2 border-[#598EBC]/30 pt-4">
              <h4 className="text-sm uppercase tracking-wide mb-3 text-[#598EBC]">Контакты</h4>
              <div className="space-y-2 text-sm">
                {university.contacts.phone && (
                  <div className="flex items-center gap-2 text-[#92A8B4]">
                    <Phone className="w-4 h-4 text-[#598EBC]" />
                    <span>{university.contacts.phone}</span>
                  </div>
                )}
                {university.contacts.email && (
                  <div className="flex items-center gap-2 text-[#92A8B4]">
                    <Mail className="w-4 h-4 text-[#598EBC]" />
                    <span>{university.contacts.email}</span>
                  </div>
                )}
                {university.contacts.address && (
                  <div className="flex items-start gap-2 text-[#92A8B4]">
                    <MapPin className="w-4 h-4 text-[#598EBC] shrink-0 mt-0.5" />
                    <span>{university.contacts.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {university.site && (
            <Button
              variant="outline"
              className="w-full border-3 border-[#598EBC] hover:bg-[#598EBC] hover:text-white bg-[#031429] text-white uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(89,142,188,0.4)] hover:shadow-[0_0_40px_rgba(89,142,188,0.7)]"
              onClick={() => window.open(university.site, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Официальный сайт
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}