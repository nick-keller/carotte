import { CachePolicies, useFetch } from 'use-http'

export const useMove = ({ vhost, queues }: { vhost: string, queues: string[] }) => {
  const {
    loading,
    put,
    response
  } = useFetch({
    cachePolicy: CachePolicies.NETWORK_ONLY,
    persist: false
  })

  return {
    moving: loading,
    move: async (destinationQueue: string) => {
      for (const queue of queues) {
        const data = await put(`/parameters/shovel/${encodeURI(vhost)}/${encodeURI(`Move from ${queue}`)}`, {
          component: 'shovel',
          name: `Move from ${queue}`,
          value: {
            'ack-mode': 'on-confirm',
            'dest-add-forward-headers': false,
            'dest-protocol': 'amqp091',
            'dest-queue': destinationQueue,
            'dest-uri': `amqp:///${vhost}`,
            'src-delete-after': 'queue-length',
            'src-prefetch-count': 1000,
            'src-protocol': 'amqp091',
            'src-queue': queue,
            'src-uri': `amqp:///${vhost}`
          },
          vhost
        })

        if (!response.ok) {
          throw new Error(data?.reason)
        }
      }
    }
  }
}
