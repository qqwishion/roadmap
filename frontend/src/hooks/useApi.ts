import { useState, useEffect } from 'react';

/**
 * Custom hook для работы с API
 * Автоматически управляет состояниями loading, error, data
 */

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiFunction: () => Promise<{ data?: T; error?: string; status: number }>,
  deps: any[] = []
): UseApiState<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await apiFunction();
      
      if (isMounted) {
        if (response.error) {
          setState({
            data: null,
            loading: false,
            error: response.error,
          });
        } else {
          setState({
            data: response.data || null,
            loading: false,
            error: null,
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, deps);

  return state;
}

/**
 * Hook для работы с фильтрацией и поиском
 */
export function useApiWithFilters<T>(
  apiFunction: (params?: any) => Promise<{ data?: T; error?: string; status: number }>,
  initialFilters: any = {}
) {
  const [filters, setFilters] = useState(initialFilters);
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await apiFunction(filters);
      
      if (isMounted) {
        if (response.error) {
          setState({
            data: null,
            loading: false,
            error: response.error,
          });
        } else {
          setState({
            data: response.data || null,
            loading: false,
            error: null,
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  return {
    ...state,
    filters,
    setFilters,
    updateFilter: (key: string, value: any) => {
      setFilters((prev: any) => ({ ...prev, [key]: value }));
    },
  };
}
