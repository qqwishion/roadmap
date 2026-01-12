import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, Filter } from "lucide-react";

interface VideosFiltersProps {
  searchQuery: string;
  categoryFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  resultsCount: number;
  loading: boolean;
  error: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: "Все категории",
  university: "Вузы",
  college: "Ссузы",
  company: "Предприятия",
  general: "Общие"
};

export function VideosFilters({
  searchQuery,
  categoryFilter,
  onSearchChange,
  onCategoryChange,
  resultsCount,
  loading,
  error,
}: VideosFiltersProps) {
  return (
    <div className="mb-8 p-6 border-3 border-[#598EBC]/50 bg-[#031429]/90 backdrop-blur-sm relative corner-accent hover:border-[#598EBC] transition-all shadow-[0_0_30px_rgba(89,142,188,0.3)] energy-lines hover:shadow-[0_0_40px_rgba(89,142,188,0.5)]">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#598EBC]" />
          <Input
            placeholder="Поиск по названию, описанию, тегам..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-[#051b3a]/50 border-2 border-[#598EBC]/30 text-white placeholder:text-[#92A8B4] focus:border-[#598EBC] transition-all focus:shadow-[0_0_20px_rgba(89,142,188,0.4)]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#598EBC] shrink-0" />
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full md:w-[220px] bg-[#051b3a]/50 border-2 border-[#598EBC]/30 text-white hover:border-[#598EBC] transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#031429] border-[#598EBC]">
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value} className="text-white focus:bg-[#598EBC]/20">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-[#92A8B4]">
        {loading ? (
          <span>Загрузка...</span>
        ) : error ? (
          <span className="text-[#EF3443]">Ошибка загрузки данных</span>
        ) : (
          <span>
            Найдено видео: <span className="text-[#598EBC]">{resultsCount}</span>
          </span>
        )}
      </div>
    </div>
  );
}

export { CATEGORY_LABELS };
