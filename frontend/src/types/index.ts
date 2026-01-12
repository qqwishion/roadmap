// Типы для интеграции с Django backend

export interface Position {
  title: string;
  supportMeasures: string[];
}

export interface University {
  id: string;
  name: string;
  city: string;
  region: string;
  specializations: string[];
  pathAfter9: string; // Путь после 9 класса
  pathAfter11: string; // Путь после 11 класса
  partnerCompanies: string[]; // Предприятия-партнеры
  internPositions: Position[]; // Стажерские позиции
  entryPositions: Position[]; // Начальные позиции
  advancedPositions: Position[]; // Последующие позиции
  site: string;
  description?: string;
  has_advanced_engineering_school?: boolean; // Наличие передовой инженерной школы
  advanced_engineering_school_info?: string; // Информация о передовой инженерной школе
  video_url?: string; // URL главного видео (YouTube, VK, Rutube, Vimeo и т.д.)
  video_title?: string; // Название главного видео
  video_description?: string; // Описание главного видео
  related_videos?: string[]; // Массив ID привязанных мотивационных видео
  contacts?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

export interface College {
  id: string;
  name: string;
  city: string;
  region: string;
  specializations: string[];
  pathAfter9: string;
  pathAfter11: string;
  partnerCompanies: string[];
  internPositions: Position[];
  entryPositions: Position[];
  advancedPositions: Position[];
  site: string;
  description?: string;
  participates_in_professionalism?: boolean; // Участие в проекте Профессионалитет
  professionalism_info?: string; // Информация о проекте Профессионалитет
  video_url?: string; // URL главного видео (YouTube, VK, Rutube, Vimeo и т.д.)
  video_title?: string; // Название главного видео
  video_description?: string; // Описание главного видео
  related_videos?: string[]; // Массив ID привязанных мотивационных видео
  contacts?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

export interface Company {
  id: string;
  name: string;
  city: string;
  region: string;
  specializations?: string[]; // Специальности/направления
  partnerEducation: string[]; // Образовательные заведения-партнеры
  internPositions: Position[]; // Стажерские позиции
  entryPositions: Position[]; // Начальные позиции
  advancedPositions: Position[]; // Последующие позиции
  site: string;
  description?: string;
  has_base_department?: boolean; // Наличие базовой кафедры
  base_department_name?: string; // Название базовой кафедры
  video_url?: string; // URL главного видео (YouTube, VK, Rutube, Vimeo и т.д.)
  video_title?: string; // Название главного видео
  video_description?: string; // Описание главного видео
  related_videos?: string[]; // Массив ID привязанных мотивационных видео
  contacts?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  educationLevel?: string;
  institutionType?: string;
  direction?: string;
  university?: {
    name: string;
    specializations: string[];
  };
  internship?: {
    company: string;
    position: string;
    supportMeasures: string[];
  }[];
  entryPositions?: {
    company: string;
    position: string;
    supportMeasures: string[];
  }[];
  advancedPositions?: {
    company: string;
    position: string;
    supportMeasures: string[];
  }[];
  careerGoal?: string;
  achievements?: string[];
  steps?: {
    step: number;
    title: string;
    description: string;
    institutions?: string[];
    companies?: string[];
  }[];
  // Поля для PostgreSQL и Django
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface ApiFilters {
  region?: string;
  specialization?: string;
  search?: string;
  hasInternPositions?: boolean;
  hasEntryPositions?: boolean;
  hasAdvancedPositions?: boolean;
  hasSupportMeasures?: boolean;
}

// Интерфейс для сохраненных траекторий (My Paths)
export interface SavedTrajectory {
  id: string;
  timestamp: string;
  type: 'custom' | 'predefined';
  // Для custom путей
  selections?: Record<string, string>;
  pathTitle?: string;
  // Для predefined путей
  path?: CareerPath;
  // Поля для PostgreSQL и Django
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Интерфейс для мотивационных видео
export interface MotivationalVideo {
  id: string;
  title: string;
  description: string;
  video_url: string; // URL видео (YouTube, Vimeo и т.д.)
  thumbnail_url?: string; // URL превью
  category: 'university' | 'college' | 'company' | 'general'; // Категория видео
  related_entity_id?: string; // ID связанного вуза/ссуза/предприятия
  related_entity_name?: string; // Название связанной сущности
  tags?: string[]; // Теги для фильтрации
  duration?: string; // Длительность видео
  views_count?: number; // Количество просмотров
  created_at?: string;
  updated_at?: string;
  is_featured?: boolean; // Избранное видео
}

// Интерфейс для направлений (заполняются через админку)
export interface Direction {
  id: string;
  name: string; // Например: "Ракетостроение", "Космические аппараты", "Двигатели"
  slug: string; // URL-friendly название
  description: string;
  icon_name?: string; // Название иконки из lucide-react
  subjects?: string[]; // Профильные предметы для этого направления
  recommendation?: string; // Рекомендация для выбравших это направление
  order?: number; // Порядок отображения
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Интерфейс для профессий (заполняются через админку)
export interface Profession {
  id: string;
  name: string; // Например: "Инженер-конструктор ракетных двигателей"
  slug: string;
  direction_id: string; // ID направления, к которому относится профессия
  direction_name?: string; // Название направления (для отображения)
  description: string;
  requirements?: string[]; // Требования к профессии
  skills?: string[]; // Необходимые навыки
  salary_range?: string; // Диапазон зарплаты
  demand_level?: 'high' | 'medium' | 'low'; // Уровень востребованности
  order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Интерфейс для статистики на главной странице
export interface Statistics {
  universities_count: number;
  colleges_count: number;
  companies_count: number;
  videos_count: number;
  directions_count: number;
}

// Интерфейс для регионов (заполняются через админку)
export interface Region {
  id: string;
  name: string; // Например: "Центральный", "Северо-Западный"
  slug: string; // URL-friendly название
  order?: number; // Порядок отображения
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Интерфейс для специальностей (заполняются через админку)
export interface Specialization {
  id: string;
  name: string; // Например: "Ракетостроение", "Космические аппараты"
  slug: string; // URL-friendly название
  description?: string;
  direction_id?: string; // ID направления, к которому относится
  order?: number; // Порядок отображения
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
