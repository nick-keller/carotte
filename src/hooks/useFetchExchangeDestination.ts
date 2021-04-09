import { CachePolicies, useFetch } from 'use-http'
import { RabbitBinding } from '../types'
import { useEffect } from 'react'
import { useFetchExchanges } from './useFetchExchanges'
import { useFetchQueues } from './useFetchQueues'

export const useFetchExchangeDestination = ({
  vhost,
  exchangeName,
  live = false,
}: {
  vhost: string
  exchangeName: string
  live?: boolean
}) => {
  const allExchanges = useFetchExchanges({ live })
  const allQueues = useFetchQueues({ live })

  const { data, loading, get, response } = useFetch<RabbitBinding[]>(
    `exchanges/${vhost}/${exchangeName}/bindings/destination`,
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
    destination: response.ok ? data ?? [] : [],
    destinationAlternateExchanges: allExchanges.data.filter(
      (e) => e.arguments['alternate-exchange'] === exchangeName
    ),
    destinationDeadLetters: allQueues.data.filter(
      (q) => q.arguments['x-dead-letter-exchange'] === exchangeName
    ),
    loading,
  }
}
