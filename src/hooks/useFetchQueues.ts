import { useFetch } from 'use-http'
import { RabbitQueue } from '../types'
import { useEffect } from 'react'
import { message } from 'antd'

export const useFetchQueues = ({ live }: { live: boolean }) => {
  const { data, loading, get, response } = useFetch<RabbitQueue[]>(
    '/queues',
    {
      data: [],
      onError: () => {
        message.error('Could not fetch queues')
      },
    },
    []
  )

  useEffect(() => {
    if (!loading && live) {
      const timeout = setTimeout(get, 2000)

      return () => clearTimeout(timeout)
    }
  }, [get, loading, live])

  return { data: (response.ok ? data ?? [] : []) as RabbitQueue[], loading }
}
