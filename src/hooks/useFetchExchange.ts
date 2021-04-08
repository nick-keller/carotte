import { CachePolicies, useFetch } from 'use-http'
import { RabbitBinding, RabbitExchange } from '../types'
import { useEffect } from 'react'
import { useFetchQueues } from './useFetchQueues'
import { useFetchExchanges } from './useFetchExchanges'

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
  const allExchanges = useFetchExchanges({ live })

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

  const source = useFetch<RabbitBinding[]>(
    `exchanges/${vhost}/${exchangeName}/bindings/source`,
    {
      cachePolicy: CachePolicies.NETWORK_ONLY,
      persist: false,
    },
    [live, vhost, exchangeName]
  )

  const destination = useFetch<RabbitBinding[]>(
    `exchanges/${vhost}/${exchangeName}/bindings/destination`,
    {
      cachePolicy: CachePolicies.NETWORK_ONLY,
      persist: false,
    },
    [live, vhost, exchangeName]
  )

  useEffect(() => {
    if (!loading && !source.loading && !destination.loading && live) {
      const timeout = setTimeout(() => {
        get()
        source.get()
        destination.get()
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [
    get,
    live,
    loading,
    source.loading,
    destination.loading,
    source.get,
    destination.get,
  ])

  return {
    data:
      response.ok === false ||
      source.response.ok === false ||
      destination.response.ok === false ||
      !data ||
      !allExchanges.data
        ? undefined
        : {
            ...data,
            source: source.data,
            destination: destination.data,
            destinationAlternateExchanges: allExchanges.data.filter(
              (e) => e.arguments['alternate-exchange'] === exchangeName
            ),
          },
    loading,
  }
}
