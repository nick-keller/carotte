import { CachePolicies, useFetch } from 'use-http'

export const useMoveQueues = ({
  vhost,
  queues,
}: {
  vhost: string
  queues: string[]
}) => {
  const { loading, put, response } = useFetch({
    cachePolicy: CachePolicies.NO_CACHE,
    persist: false,
  })

  return {
    moving: loading,
    move: async (destinationQueue: string) => {
      for (const queue of queues) {
        const data = await put(
          `/parameters/shovel/${encodeURIComponent(vhost)}/${encodeURIComponent(
            `Move from ${queue}`
          )}`,
          {
            component: 'shovel',
            name: `Move from ${queue}`,
            value: {
              'ack-mode': 'on-confirm',
              'dest-add-forward-headers': false,
              'dest-protocol': 'amqp091',
              'dest-queue': destinationQueue,
              'dest-uri': `amqp:///${encodeURIComponent(vhost)}`,
              'src-delete-after': 'queue-length',
              'src-prefetch-count': 1000,
              'src-protocol': 'amqp091',
              'src-queue': queue,
              'src-uri': `amqp:///${encodeURIComponent(vhost)}`,
            },
            vhost,
          }
        )

        if (!response.ok) {
          throw new Error(data?.reason)
        }
      }
    },
  }
}
