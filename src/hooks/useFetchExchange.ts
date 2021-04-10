import { CachePolicies, useFetch } from 'use-http'
import { RabbitExchange } from '../types'
import { useEffect } from 'react'

export const useFetchExchange = ({
  vhost,
  exchangeName,
  live = false,
  onNotFound = () => null,
}: {
  vhost: string
  exchangeName: string
  live?: boolean
  onNotFound?: () => void
}) => {
  const { data, loading, get, response } = useFetch<RabbitExchange>(
    `exchanges/${vhost}/${exchangeName}`,
    {
      cachePolicy: CachePolicies.NETWORK_ONLY,
      persist: false,
      onError: ({ error }) => {
        if (error.name === '404') {
          onNotFound()
        }
      },
    },
    [live, vhost, exchangeName]
  )

  useEffect(() => {
    if (!loading && live) {
      const timeout = setTimeout(get, 5000)

      return () => clearTimeout(timeout)
    }
  }, [get, live, loading])

  return {
    exchange: response.ok === false || !data ? undefined : data,
    loading,
  }
}
