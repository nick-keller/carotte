import { CachePolicies, useFetch } from 'use-http'
import { RabbitQueue } from '../types'
import { useEffect } from 'react'
import qs from 'qs'

export const useFetchQueue = ({
  vhost,
  queueName,
  range = 0,
  resolution = 60,
  messageSamples = false,
  rateSamples = false,
  live = false,
  onNotFound = () => null,
}: {
  vhost: string
  queueName: string
  range?: number
  resolution?: number
  messageSamples?: boolean
  rateSamples?: boolean
  live?: boolean
  onNotFound?: () => void
}) => {
  const interval = Math.max(5, Math.round(range / resolution))

  const params = qs.stringify({
    lengths_age: messageSamples ? range : undefined,
    lengths_incr: messageSamples ? interval : undefined,
    msg_rates_age: rateSamples ? range : undefined,
    msg_rates_incr: rateSamples ? interval : undefined,
  })

  const { data, loading, get, response } = useFetch<RabbitQueue>(
    `queues/${vhost}/${queueName}?${params}`,
    {
      cachePolicy: CachePolicies.NETWORK_ONLY,
      persist: false,
      onError: ({ error }) => {
        if (error.name === '404') {
          onNotFound()
        }
      },
    },
    [params, live]
  )

  useEffect(() => {
    if (!loading && live) {
      const timeout = setTimeout(get, 2000)

      return () => clearTimeout(timeout)
    }
  }, [get, live, loading])

  return { data: response.ok === false ? undefined : data, loading }
}
