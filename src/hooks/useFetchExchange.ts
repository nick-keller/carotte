import { CachePolicies, useFetch } from 'use-http'
import { RabbitBinding, RabbitExchange } from '../types'
import { useEffect } from 'react'
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

  const {
    data: sourceData,
    loading: sourceLoading,
    get: sourceGet,
    response: sourceResponse,
  } = useFetch<RabbitBinding[]>(
    `exchanges/${vhost}/${exchangeName}/bindings/source`,
    {
      cachePolicy: CachePolicies.NETWORK_ONLY,
      persist: false,
    },
    [live, vhost, exchangeName]
  )

  const {
    data: destinationData,
    loading: destinationLoading,
    get: destinationGet,
    response: destinationResponse,
  } = useFetch<RabbitBinding[]>(
    `exchanges/${vhost}/${exchangeName}/bindings/destination`,
    {
      cachePolicy: CachePolicies.NETWORK_ONLY,
      persist: false,
    },
    [live, vhost, exchangeName]
  )

  useEffect(() => {
    if (!loading && !sourceLoading && !destinationLoading && live) {
      const timeout = setTimeout(() => {
        get()
        sourceGet()
        destinationGet()
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [
    get,
    live,
    loading,
    sourceLoading,
    destinationLoading,
    sourceGet,
    destinationGet,
  ])

  return {
    data:
      response.ok === false ||
      sourceResponse.ok === false ||
      destinationResponse.ok === false ||
      !data ||
      !allExchanges.data
        ? undefined
        : {
            ...data,
            source: sourceData,
            destination: destinationData,
            destinationAlternateExchanges: allExchanges.data.filter(
              (e) => e.arguments['alternate-exchange'] === exchangeName
            ),
          },
    loading,
  }
}
