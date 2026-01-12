import { useState, useMemo, useCallback } from "react";
import { Comets } from "./Comets";
import { FloatingSquares } from "./FloatingSquares";
import { Stars } from "./Stars";
import { VideoCard } from "./VideoCard";
import { VideoDetailsDialog } from "./VideoDetailsDialog";
import { VideosFilters, CATEGORY_LABELS } from "./VideosFilters";
import type { MotivationalVideo } from "../types";
import { useApiWithFilters } from "../hooks/useApiWithFilters";
import { videosApi } from "../services/api";

/**
 * VideosPage - Страница мотивационных видео с серверной фильтрацией
 * 
 * Использует серверную фильтрацию через API:
 * - category: фильтр по категории (university, college, company, general)
 * - search: поиск по названию, описанию и тегам
 * 
 * Debounce 300ms применяется к поисковому запросу для оптимизации.
 */

interface VideoFilters {
  category?: string;
  search?: string;
}

export function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedVideo, setSelectedVideo] = useState<MotivationalVideo | null>(null);

  // Мемоизируем API функцию, чтобы она не пересоздавалась
  const fetchVideos = useCallback((filters: VideoFilters) => {
    return videosApi.getAll(filters);
  }, []);

  // Формируем фильтры для API (не включаем пустые значения)
  const apiFilters = useMemo<VideoFilters>(() => {
    const filters: VideoFilters = {};
    
    // Добавляем категорию только если не "all"
    if (categoryFilter !== "all") {
      filters.category = categoryFilter;
    }
    
    // Добавляем поиск только если есть текст
    if (searchQuery.trim()) {
      filters.search = searchQuery.trim();
    }
    
    return filters;
  }, [categoryFilter, searchQuery]);

  // Загрузка видео с серверной фильтрацией и debounce для поиска
  const { data: videos, loading, error } = useApiWithFilters<MotivationalVideo[], VideoFilters>({
    apiFunction: fetchVideos,
    filters: apiFilters,
    debounceMs: 300,
    debounceKeys: ['search'], // Применяем debounce только к поиску
  });

  const videosArray = videos || [];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#031429] via-[#051b3a] to-[#031429]">
      {/* Реалистичные звезды */}
      <Stars />

      {/* Космические эффекты */}
      <Comets />
      <FloatingSquares />

      {/* Паттерны */}
      <div className="absolute inset-0 circuit-pattern opacity-10" />
      <div className="absolute inset-0 dots-pattern opacity-5" />
      
      {/* Темные цветные элементы */}
      <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-[#598EBC]/10 blur-3xl color-orb-1" />
      <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-[#392B7D]/15 blur-3xl color-orb-3" />

      {/* Header секция */}
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6 md:mb-8 border-b-2 border-[#598EBC] pb-4 md:pb-6 energy-lines">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#598EBC] drop-shadow-[0_0_20px_rgba(89,142,188,0.8)]">
                Мотивационные видео
              </h1>
            </div>
            <p className="text-sm md:text-base text-[#92A8B4]">
              Вдохновляющие истории и материалы о карьере в космической отрасли
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="relative py-6 md:py-8">
        <div className="container mx-auto px-4 relative z-10">
          <VideosFilters
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            onSearchChange={setSearchQuery}
            onCategoryChange={setCategoryFilter}
            resultsCount={videosArray.length}
            loading={loading}
            error={error}
          />
        </div>
      </section>

      {/* Videos Grid */}
      <section className="relative py-8 md:py-12">
        <div className="container mx-auto px-4 relative z-10">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-3 border-[#598EBC] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12 border-3 border-[#598EBC]/30 corner-accent bg-[#031429]/90 backdrop-blur-sm shadow-[0_0_30px_rgba(89,142,188,0.3)]">
              <p className="text-[#EF3443]">Ошибка загрузки видео</p>
              <p className="text-sm text-[#92A8B4] mt-2">{error}</p>
            </div>
          ) : videosArray.length === 0 ? (
            <div className="text-center py-20 border-3 border-[#598EBC]/30 corner-accent bg-[#031429]/90 backdrop-blur-sm shadow-[0_0_30px_rgba(89,142,188,0.3)]">
              <p className="text-[#92A8B4] text-lg mb-2">Видео не найдены</p>
              <p className="text-sm text-[#92A8B4] mb-4">
                {!videos || videos.length === 0 
                  ? "Backend API не настроен или база данных пуста" 
                  : "Попробуйте изменить параметры поиска"}
              </p>
              {(!videos || videos.length === 0) && (
                <div className="mt-4 text-xs text-[#92A8B4]/70 max-w-md mx-auto">
                  <p>Для добавления видео:</p>
                  <ol className="text-left mt-2 space-y-1 pl-6">
                    <li>1. Настройте Django backend (см. BACKEND_GUIDE.md)</li>
                    <li>2. Добавьте видео через Django Admin</li>
                    <li>3. Укажите VITE_API_URL в .env файле</li>
                  </ol>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosArray.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  categoryLabel={CATEGORY_LABELS[video.category] || video.category}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      <VideoDetailsDialog
        video={selectedVideo}
        categoryLabel={selectedVideo ? (CATEGORY_LABELS[selectedVideo.category] || selectedVideo.category) : ""}
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
      />
    </div>
  );
}