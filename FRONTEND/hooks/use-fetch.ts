'use client'

import { useState, useEffect, useCallback } from 'react'
import { getErrorMessage } from '@/lib/services/api'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook personnalisé pour récupérer des données depuis l'API
 * Gère automatiquement les états loading, error et data
 */
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  dependencies: unknown[] = []
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(getErrorMessage(err))
      setData(null)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

interface UseMutationResult<T, P> {
  mutate: (params: P) => Promise<T | null>
  data: T | null
  loading: boolean
  error: string | null
  reset: () => void
}

/**
 * Hook pour les mutations (POST, PUT, DELETE)
 */
export function useMutation<T, P = void>(
  mutationFn: (params: P) => Promise<T>
): UseMutationResult<T, P> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (params: P): Promise<T | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await mutationFn(params)
      setData(result)
      return result
    } catch (err) {
      setError(getErrorMessage(err))
      return null
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  return { mutate, data, loading, error, reset }
}
