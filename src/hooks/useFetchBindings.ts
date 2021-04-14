import { useFetch } from 'use-http'
import { RabbitBinding } from '../types'
import { useEffect } from 'react'
import { message } from 'antd'

export const useFetchBindings = ({ live = false }: { live?: boolean }) => {
  const { data, loading, get, response } = useFetch<RabbitBinding[]>(
    '/bindings',
    {
      data: [],
      onError: () => {
        message.error('Could not fetch bindings')
      },
    },
    []
  )

  useEffect(() => {
    if (!loading && live) {
      const timeout = setTimeout(get, 5000)

      return () => clearTimeout(timeout)
    }
  }, [get, loading, live])

  return {
    bindings: (response.ok ? data ?? [] : []) as RabbitBinding[],
    loading,
  }
}
