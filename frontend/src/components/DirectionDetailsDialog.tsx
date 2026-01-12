import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Lightbulb, GraduationCap } from "lucide-react";
import type { Direction } from "../types";

interface DirectionDetailsDialogProps {
  direction: Direction | null;
  open?: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function DirectionDetailsDialog({ direction, open, onClose, onOpenChange }: DirectionDetailsDialogProps) {
  if (!direction) return null;

  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
    onClose();
  };

  return (
    <Dialog open={open !== undefined ? open : !!direction} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-[96vw] bg-[#031429] border-5 border-[#392B7D] shadow-[0_0_80px_rgba(57,43,125,0.7)] p-0 overflow-hidden max-h-[95vh] flex flex-col">
        <DialogHeader className="border-b-5 border-[#392B7D]/50 p-4 md:p-5 shrink-0 bg-gradient-to-r from-[#031429] via-[#051b3a] to-[#031429]">
          <DialogTitle className="text-xl md:text-2xl uppercase tracking-[0.15em] text-[#392B7D] drop-shadow-[0_0_25px_rgba(57,43,125,0.9)]">
            {direction.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-8">
          <div>
            <p className="text-base md:text-lg text-[#92A8B4] leading-relaxed">{direction.description}</p>
          </div>
          
          {direction.subjects && direction.subjects.length > 0 && (
            <div className="border-l-5 border-[#392B7D] pl-6 py-4">
              <p className="text-sm uppercase tracking-wide text-[#392B7D] mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Профильные предметы
              </p>
              <div className="flex flex-wrap gap-3">
                {direction.subjects.map((subject, idx) => (
                  <span key={idx} className="px-4 py-2 bg-[#392B7D]/20 border-3 border-[#392B7D]/50 text-white text-base">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {direction.recommendation && (
            <div className="p-6 bg-[#392B7D]/10 border-3 border-[#392B7D]/30">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-6 h-6 text-[#392B7D] shrink-0" />
                <div>
                  <p className="text-sm uppercase tracking-wide text-[#392B7D] mb-3">Рекомендация</p>
                  <p className="text-base text-[#92A8B4] leading-relaxed">{direction.recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t-5 border-[#392B7D]/50 p-8 md:p-10 shrink-0 bg-gradient-to-r from-[#031429] via-[#051b3a] to-[#031429]">
          <Button
            onClick={handleClose}
            variant="outline"
            className="w-full border-3 border-[#392B7D] text-[#392B7D] hover:bg-[#392B7D]/20 uppercase tracking-wide text-base py-6 shadow-[0_0_20px_rgba(57,43,125,0.3)] hover:shadow-[0_0_30px_rgba(57,43,125,0.5)] transition-all"
          >
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}