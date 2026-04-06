import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../config/api.config';

/** Standard error shape returned by the API. */
interface DefaultApiError {
  error: string | { message: string; statusCode?: number };
}

/**
 * Hook for performing mutating API requests (POST, PUT, DELETE).
 *
 * Manages loading, data, and error state automatically.
 *
 * @typeParam TData      - Expected response data type.
 * @typeParam TVariables - Request body type.
 * @param endpoint - API path relative to `API_BASE_URL`.
 * @param method   - HTTP method (defaults to `'POST'`).
 * @returns `{ mutate, data, loading, error, setError }` — the mutation trigger, response data, and state.
 *
 * @example
 * ```tsx
 * const { mutate: login, loading } = useMutation('/login', 'POST');
 * const result = await login({ username, password });
 * ```
 */
export function useMutation<TData = any, TVariables = any>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method,
          headers,
          body: JSON.stringify(variables),
        });

        const result = await response.json();

        if (!response.ok) {
          const apiError: DefaultApiError = result;
          const message = typeof apiError.error === 'object' 
            ? apiError.error.message 
            : (apiError.error || 'An unexpected error occurred');
          throw new Error(message);
        }

        setData(result);
        return result;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, method]
  );

  return { mutate, data, loading, error, setError };
}

/**
 * Hook for performing read-only API requests (GET).
 *
 * Provides a `fetchResource` callback that can be called imperatively,
 * plus reactive `data`, `loading`, and `error` state.
 *
 * @typeParam TData - Expected response data type.
 * @param endpoint - API path relative to `API_BASE_URL`.
 * @returns `{ fetchResource, data, loading, error }` — the fetch trigger and state.
 *
 * @example
 * ```tsx
 * const { fetchResource: getSites, data } = useQuery<{ sites: SiteLayout[] }>('/auth/sites');
 * useEffect(() => { getSites(); }, [getSites]);
 * ```
 */
export function useQuery<TData = any>(endpoint: string) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResource = useCallback(async (): Promise<TData> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
      const result = await response.json();

      if (!response.ok) {
        const apiError: DefaultApiError = result;
        const message = typeof apiError.error === 'object' 
          ? apiError.error.message 
          : (apiError.error || 'An unexpected error occurred');
        throw new Error(message);
      }

      const tData = result as TData;
      setData(tData);
      return tData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return { fetchResource, data, loading, error };
}

