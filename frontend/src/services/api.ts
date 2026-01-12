/**
 * API Service для интеграции с Django Backend
 * 
 * Настройка:
 * 1. Создайте файл .env в корне проекта (используйте .env.example как шаблон)
 * 2. Установите переменную окружения VITE_API_URL с адресом Django сервера
 * 3. Django должен иметь CORS настройки для работы с этим фронтендом
 * 4. Все эндпоинты должны возвращать JSON
 * 
 * Если бэкенд не настроен, приложение продолжит работать с пустыми данными
 */

const API_BASE_URL = import.meta.env?.VITE_API_URL || '';

// Проверка что API URL настроен
const isApiConfigured = !!API_BASE_URL;

// Показываем информацию о статусе API только один раз при загрузке
if (import.meta?.env?.DEV) {
  if (isApiConfigured) {
    console.info(`✅ API настроен: ${API_BASE_URL}`);
  } else {
    console.warn('⚠️ API URL не настроен. Создайте файл .env с переменной VITE_API_URL');
    console.warn('Пример: VITE_API_URL=http://localhost:8000/api');
    console.warn('Приложение будет работать с пустыми данными до подключения бэкенда');
  }
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Базовый fetch wrapper с обработкой ошибок
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Если API не настроен, возвращаем пустой массив без повторных warning
  if (!isApiConfigured) {
    return {
      data: [] as T,
      status: 200,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Получаем текст ответа сначала
    const text = await response.text();
    
    // Выводим полную информацию для отладки
    if (!response.ok) {
      console.error(`❌ HTTP ${response.status} ${response.statusText}`);
      console.error(`🔗 URL: ${API_BASE_URL}${endpoint}`);
      console.error(`📄 Response:`, text.substring(0, 500)); // Первые 500 символов
    }

    // Пытаемся распарсить JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      // Если не JSON, возвращаем текст как есть
      console.error('⚠️ Ответ не является JSON. Возможно, Django вернул HTML страницу с ошибкой');
      console.error('Проверьте:');
      console.error('1. Правильность URL в .env (VITE_API_URL)');
      console.error('2. Что Django сервер запущен');
      console.error('3. Что URLs настроены в Django (urls.py)');
      console.error('4. CORS настройки в Django settings.py');
      
      return {
        error: `Сервер вернул некорректный ответ (${response.status}). Проверьте консоль для деталей.`,
        status: response.status,
      };
    }

    if (!response.ok) {
      return {
        error: data.message || data.detail || 'Произошла ошибка при загрузке данных',
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('🔗 Attempted URL:', `${API_BASE_URL}${endpoint}`);
    return {
      error: 'Ошибка соединения с сервером',
      status: 500,
    };
  }
}

/**
 * Universities API
 */
export const universitiesApi = {
  getAll: async (params?: { region?: string; direction?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.region) queryParams.append('region', params.region);
    if (params?.direction) queryParams.append('direction', params.direction);
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return apiFetch(`/universities/${query ? `?${query}` : ''}`);
  },
  
  getById: async (id: number) => {
    return apiFetch(`/universities/${id}/`);
  },
};

/**
 * Colleges API
 */
export const collegesApi = {
  getAll: async (params?: { region?: string; direction?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.region) queryParams.append('region', params.region);
    if (params?.direction) queryParams.append('direction', params.direction);
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return apiFetch(`/colleges/${query ? `?${query}` : ''}`);
  },
  
  getById: async (id: number) => {
    return apiFetch(`/colleges/${id}/`);
  },
};

/**
 * Companies API
 */
export const companiesApi = {
  getAll: async (params?: { region?: string; specialization?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.region) queryParams.append('region', params.region);
    if (params?.specialization) queryParams.append('specialization', params.specialization);
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return apiFetch(`/companies/${query ? `?${query}` : ''}`);
  },
  
  getById: async (id: number) => {
    return apiFetch(`/companies/${id}/`);
  },
};

/**
 * Roadmap Paths API
 */
export const roadmapApi = {
  // Получить все готовые пути
  getPredefinedPaths: async () => {
    return apiFetch('/roadmap/paths/');
  },
  
  // Получить конкретный путь по ID
  getPathById: async (id: string) => {
    return apiFetch(`/roadmap/paths/${id}/`);
  },
  
  // Сохранить персональный путь (конструктор)
  saveCustomPath: async (pathData: {
    selections: Record<string, string>;
    pathTitle: string;
  }) => {
    return apiFetch('/roadmap/custom-paths/', {
      method: 'POST',
      body: JSON.stringify(pathData),
    });
  },
  
  // Добавить готовый путь в план пользователя
  addPredefinedPathToUser: async (pathId: string) => {
    return apiFetch('/roadmap/user-paths/', {
      method: 'POST',
      body: JSON.stringify({ path_id: pathId }),
    });
  },
  
  // Получить все пути пользователя (custom + predefined)
  getUserPaths: async () => {
    return apiFetch('/roadmap/user-paths/');
  },
  
  // Удалить путь из плана пользователя
  deleteUserPath: async (id: string) => {
    return apiFetch(`/roadmap/user-paths/${id}/`, {
      method: 'DELETE',
    });
  },
};

/**
 * Videos API
 */
export const videosApi = {
  getAll: async (params?: { category?: string; is_featured?: boolean; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.is_featured !== undefined) queryParams.append('is_featured', String(params.is_featured));
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return apiFetch(`/videos/${query ? `?${query}` : ''}`);
  },
  
  getById: async (id: string) => {
    return apiFetch(`/videos/${id}/`);
  },
};

/**
 * Statistics API
 */
export const statsApi = {
  getOverview: async () => {
    return apiFetch('/statistics/overview/');
  },
};

/**
 * Directions API (Направления)
 */
export const directionsApi = {
  getAll: async () => {
    return apiFetch('/directions/');
  },
  
  getById: async (id: string) => {
    return apiFetch(`/directions/${id}/`);
  },
};

/**
 * Professions API (Профессии)
 */
export const professionsApi = {
  getAll: async (params?: { direction_id?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.direction_id) queryParams.append('direction_id', params.direction_id);
    
    const query = queryParams.toString();
    return apiFetch(`/professions/${query ? `?${query}` : ''}`);
  },
  
  getById: async (id: string) => {
    return apiFetch(`/professions/${id}/`);
  },
  
  getByDirection: async (directionId: string) => {
    return apiFetch(`/professions/?direction_id=${directionId}`);
  },
};

/**
 * Regions API (Регионы)
 */
export const regionsApi = {
  getAll: async () => {
    return apiFetch('/regions/');
  },
  
  getById: async (id: string) => {
    return apiFetch(`/regions/${id}/`);
  },
};

/**
 * Specializations API (Специальности)
 */
export const specializationsApi = {
  getAll: async (params?: { direction_id?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.direction_id) queryParams.append('direction_id', params.direction_id);
    
    const query = queryParams.toString();
    return apiFetch(`/specializations/${query ? `?${query}` : ''}`);
  },
  
  getById: async (id: string) => {
    return apiFetch(`/specializations/${id}/`);
  },
};