import { useFetch } from 'use-http'
import { RabbitExchange } from '../types'
import { useEffect } from 'react'
import { message } from 'antd'

export const useFetchExchanges = ({ live }: { live: boolean }) => {
  const { data, loading, get, response } = useFetch<RabbitExchange[]>(
    '/exchanges',
    {
      data: [],
      onError: () => {
        message.error('Could not fetch exchanges')
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

  return { data: (response.ok ? data ?? [] : []) as RabbitExchange[], loading }
}
