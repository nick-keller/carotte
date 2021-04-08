import { CachePolicies, useFetch } from 'use-http'
import { RabbitBinding } from '../types'
import { useEffect } from 'react'

export const useFetchExchangeSource = ({
  vhost,
  exchangeName,
  live = false,
}: {
  vhost: string
  exchangeName: string
  live?: boolean
}) => {
  const { data, loading, get, response } = useFetch<RabbitBinding[]>(
    `exchanges/${vhost}/${exchangeName}/bindings/source`,
    {
      cachePolicy: CachePolicies.NETWORK_ONLY,
      persist: false,
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
    source: response.ok ? data ?? [] : [],
    loading,
  }
}
