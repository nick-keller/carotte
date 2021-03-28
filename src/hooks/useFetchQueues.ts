import { useFetch } from 'use-http'
import { RabbitQueue } from '../types'
import { useEffect } from 'react'

export const useFetchQueues = ({ live }: { live: boolean }) => {
  const { data, loading, get } = useFetch<RabbitQueue[]>(
    '/queues',
    { data: [] },
    []
  )

  useEffect(() => {
    if (!loading && live) {
      const timeout = setTimeout(get, 2000)

      return () => clearTimeout(timeout)
    }
  }, [get, loading, live])

  return { data: data as RabbitQueue[], loading }
}
