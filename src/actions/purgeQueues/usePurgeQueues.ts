import { CachePolicies, useFetch } from 'use-http'

export const usePurgeQueues = ({
  vhost,
  queues,
}: {
  vhost: string
  queues: string[]
}) => {
  const { loading, del, response } = useFetch({
    cachePolicy: CachePolicies.NO_CACHE,
    persist: false,
  })

  return {
    purging: loading,
    purge: async () => {
      for (const queue of queues) {
        const data = await del(
          `/queues/${encodeURIComponent(vhost)}/${encodeURIComponent(
            queue
          )}/contents`,
          {
            mode: 'purge',
            name: queue,
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
