import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../config/api.config';

interface DefaultApiError {
  error: string;
}

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
          throw new Error(apiError.error || 'An unexpected error occurred');
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

export function useQuery<TData = any>(endpoint: string) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResource = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
      const result = await response.json();

      if (!response.ok) {
        const apiError = result as DefaultApiError;
        throw new Error(apiError.error || 'An unexpected error occurred');
      }

      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return { fetchResource, data, loading, error };
}
