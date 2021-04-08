import { CachePolicies, useFetch } from 'use-http'
import { RabbitBinding } from '../types'
import { useEffect } from 'react'

export const useFetchQueueBindings = ({
  vhost,
  queueName,
  live = false,
}: {
  vhost: string
  queueName: string
  live?: boolean
}) => {
  const { data, loading, get, response } = useFetch<RabbitBinding[]>(
    `queues/${vhost}/${queueName}/bindings`,
    {
      cachePolicy: CachePolicies.NETWORK_ONLY,
      persist: false,
    },
    [live]
  )

  useEffect(() => {
    if (!loading && live) {
      const timeout = setTimeout(get, 5000)

      return () => clearTimeout(timeout)
    }
  }, [get, live, loading])

  return { bindings: response.ok  ? data ?? [] : [], loading }
}
