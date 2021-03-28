import { CachePolicies, useFetch } from 'use-http'

export const useDeleteQueues = ({
  vhost,
  queues,
}: {
  vhost: string
  queues: string[]
}) => {
  const { loading, del, response } = useFetch({
    cachePolicy: CachePolicies.NETWORK_ONLY,
    persist: false,
  })

  return {
    deleting: loading,
    del: async () => {
      for (const queue of queues) {
        const data = await del(
          `/queues/${encodeURI(vhost)}/${encodeURI(queue)}`,
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
