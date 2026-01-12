import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Eye, Tag } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";
import type { MotivationalVideo } from "../types";

interface VideoDetailsDialogProps {
  video: MotivationalVideo | null;
  categoryLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoDetailsDialog({
  video,
  categoryLabel,
  open,
  onOpenChange,
}: VideoDetailsDialogProps) {
  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#031429] border-2 md:border-3 border-[#598EBC] shadow-[0_0_60px_rgba(89,142,188,0.6)] p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl text-white uppercase tracking-wide drop-shadow-[0_0_20px_rgba(89,142,188,0.8)]">
            {video.title}
          </DialogTitle>
          <DialogDescription className="text-xs md:text-sm text-[#92A8B4]">
            {video.related_entity_name || 'Видео о космической отрасли'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-white">
          <VideoPlayer url={video.video_url} title={video.title} />

          <p className="text-[#92A8B4] leading-relaxed border-l-3 border-[#598EBC] pl-4 bg-[#051b3a]/50 p-3">
            {video.description}
          </p>

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 text-sm text-[#92A8B4] bg-[#051b3a]/50 px-3 py-1.5 border-2 border-[#598EBC]/30 hover:border-[#598EBC] hover:text-white transition-all"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-[#92A8B4] border-t-2 border-[#598EBC]/30 pt-4">
            <span className="px-3 py-1.5 bg-[#598EBC]/20 text-[#598EBC] border-2 border-[#598EBC]/30 uppercase tracking-wide">
              {categoryLabel}
            </span>
            {video.duration && <span>Длительность: {video.duration}</span>}
            {video.views_count !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {video.views_count.toLocaleString()} просмотров
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
