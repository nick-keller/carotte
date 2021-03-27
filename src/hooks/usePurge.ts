import { CachePolicies, useFetch } from 'use-http'

export const usePurge = ({
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
    purging: loading,
    purge: async () => {
      for (const queue of queues) {
        const data = await del(
          `/queues/${encodeURI(vhost)}/${encodeURI(queue)}/contents`,
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
