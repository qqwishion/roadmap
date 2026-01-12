import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook для работы с API с фильтрацией и debounce
 * Автоматически управляет состояниями loading, error, data и перезагрузкой при изменении фильтров
 */

interface UseApiWithFiltersState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseApiWithFiltersOptions<F> {
  apiFunction: (filters: F) => Promise<{ data?: T; error?: string; status: number }>;
  filters: F;
  debounceMs?: number;
  debounceKeys?: (keyof F)[];
}

export function useApiWithFilters<T, F extends Record<string, any>>({
  apiFunction,
  filters,
  debounceMs = 0,
  debounceKeys = [],
}: UseApiWithFiltersOptions<F>): UseApiWithFiltersState<T> {
  const [state, setState] = useState<Omit<UseApiWithFiltersState<T>, 'refetch'>>({
    data: null,
    loading: true,
    error: null,
  });

  // Используем ref для хранения последних фильтров и предотвращения лишних запросов
  const lastFiltersRef = useRef<string>('');

  const fetchData = useCallback(async (currentFilters: F) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction(currentFilters);

      if (response.error) {
        setState({ data: null, loading: false, error: response.error });
      } else {
        setState({ data: response.data || null, loading: false, error: null });
      }
    } catch (err) {
      console.error('API Error:', err);
      setState({
        data: null,
        loading: false,
        error: 'Не удалось загрузить данные. Проверьте подключение к серверу.',
      });
    }
  }, [apiFunction]);

  const refetch = useCallback(() => {
    fetchData(filters);
  }, [fetchData, filters]);

  useEffect(() => {
    // Сериализуем фильтры для сравнения
    const filtersString = JSON.stringify(filters);
    
    // Если фильтры не изменились, не делаем запрос
    if (filtersString === lastFiltersRef.current) {
      return;
    }
    
    lastFiltersRef.current = filtersString;

    // Проверяем, нужен ли debounce для текущих фильтров
    const needsDebounce = debounceKeys.length > 0 && debounceKeys.some(
      key => filters[key] !== undefined && filters[key] !== ''
    );

    if (needsDebounce && debounceMs > 0) {
      const timeoutId = setTimeout(() => {
        fetchData(filters);
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    } else {
      fetchData(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, debounceMs]);

  return { ...state, refetch };
}