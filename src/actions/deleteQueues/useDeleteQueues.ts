import { CachePolicies, useFetch } from 'use-http'

export const useDeleteQueues = ({
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
    deleting: loading,
    del: async () => {
      for (const queue of queues) {
        const data = await del(
          `/queues/${encodeURIComponent(vhost)}/${encodeURIComponent(queue)}`,
          {
            mode: 'delete',
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
