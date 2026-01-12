import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";
import type { Profession } from "../types";

interface ProfessionDetailsDialogProps {
  profession: Profession | null;
  open?: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function ProfessionDetailsDialog({ profession, open, onClose, onOpenChange }: ProfessionDetailsDialogProps) {
  if (!profession) return null;

  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
    onClose();
  };

  return (
    <Dialog open={open !== undefined ? open : !!profession} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-[96vw] bg-[#031429] border-5 border-[#EF3443] shadow-[0_0_80px_rgba(239,52,67,0.7)] p-0 overflow-hidden max-h-[95vh] flex flex-col">
        <DialogHeader className="border-b-5 border-[#EF3443]/50 p-4 md:p-5 shrink-0 bg-gradient-to-r from-[#031429] via-[#051b3a] to-[#031429]">
          <DialogTitle className="text-xl md:text-2xl uppercase tracking-[0.15em] text-[#EF3443] drop-shadow-[0_0_25px_rgba(239,52,67,0.9)]">
            {profession.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-8">
          <div>
            <p className="text-base md:text-lg text-[#92A8B4] leading-relaxed">{profession.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profession.salary_range && (
              <div className="border-l-5 border-[#EF3443] pl-6 py-4">
                <p className="text-sm uppercase tracking-wide text-[#EF3443] mb-2">Зарплата</p>
                <p className="text-base text-white">{profession.salary_range}</p>
              </div>
            )}
            
            {profession.demand_level && (
              <div className="border-l-5 border-[#EF3443] pl-6 py-4">
                <p className="text-sm uppercase tracking-wide text-[#EF3443] mb-2">Востребованность</p>
                <p className="text-base text-white">
                  {profession.demand_level === 'high' && 'Высокая'}
                  {profession.demand_level === 'medium' && 'Средняя'}
                  {profession.demand_level === 'low' && 'Низкая'}
                </p>
              </div>
            )}
          </div>
          
          {profession.requirements && profession.requirements.length > 0 && (
            <div className="border-l-5 border-[#598EBC] pl-6 py-4">
              <p className="text-sm uppercase tracking-wide text-[#598EBC] mb-4">Требования</p>
              <ul className="space-y-3">
                {profession.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-base text-[#92A8B4]">
                    <CheckCircle className="w-5 h-5 text-[#598EBC] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {profession.skills && profession.skills.length > 0 && (
            <div className="border-l-5 border-[#392B7D] pl-6 py-4">
              <p className="text-sm uppercase tracking-wide text-[#392B7D] mb-4">Необходимые навыки</p>
              <div className="flex flex-wrap gap-3">
                {profession.skills.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 bg-[#392B7D]/20 border-3 border-[#392B7D]/50 text-white text-base">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t-5 border-[#EF3443]/50 p-8 md:p-10 shrink-0 bg-gradient-to-r from-[#031429] via-[#051b3a] to-[#031429]">
          <Button
            onClick={handleClose}
            variant="outline"
            className="w-full border-3 border-[#EF3443] text-[#EF3443] hover:bg-[#EF3443]/20 uppercase tracking-wide text-base py-6 shadow-[0_0_20px_rgba(239,52,67,0.3)] hover:shadow-[0_0_30px_rgba(239,52,67,0.5)] transition-all"
          >
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}