import { Play, Eye, Tag } from "lucide-react";
import type { MotivationalVideo } from "../types";

interface VideoCardProps {
  video: MotivationalVideo;
  categoryLabel: string;
  onClick: () => void;
}

export function VideoCard({ video, categoryLabel, onClick }: VideoCardProps) {
  return (
    <div
      className="group relative border-3 border-[#598EBC]/50 bg-[#031429]/90 backdrop-blur-sm hover:border-[#598EBC] transition-all cursor-pointer overflow-hidden hover-lift corner-accent shadow-[0_0_20px_rgba(89,142,188,0.2)] hover:shadow-[0_0_40px_rgba(89,142,188,0.5)]"
      onClick={onClick}
    >
      {/* Thumbnail or Placeholder */}
      <div className="relative aspect-video bg-gradient-to-br from-[#031429] to-[#392B7D] flex items-center justify-center overflow-hidden">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-[#598EBC]">
            <Play className="w-16 h-16 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-[#031429]/0 group-hover:bg-[#031429]/30 transition-all flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100" />
        </div>

        {/* Featured badge */}
        {video.is_featured && (
          <div className="absolute top-2 right-2 bg-[#EF3443] text-white text-xs px-2 py-1 uppercase tracking-wide">
            Избранное
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg mb-2 text-white group-hover:text-[#598EBC] transition-colors line-clamp-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          {video.title}
        </h3>
        
        <p className="text-sm text-[#92A8B4] mb-3 line-clamp-2">
          {video.description}
        </p>

        {/* Category and Entity */}
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span className="px-2 py-1 bg-[#598EBC]/20 text-[#598EBC] border border-[#598EBC]/30 uppercase tracking-wide">
            {categoryLabel}
          </span>
          {video.related_entity_name && (
            <span className="text-[#92A8B4] truncate">
              {video.related_entity_name}
            </span>
          )}
        </div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {video.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 text-xs text-[#92A8B4] bg-[#051b3a]/50 px-2 py-0.5 border border-[#598EBC]/30"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="text-xs text-[#92A8B4]">+{video.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-[#92A8B4] pt-3 border-t border-[#598EBC]/30">
          {video.duration && (
            <span>{video.duration}</span>
          )}
          {video.views_count !== undefined && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {video.views_count.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
