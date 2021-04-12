import { CachePolicies, useFetch } from 'use-http'
import { RabbitBinding } from '../../types'

export const useUnBind = () => {
  const { loading, del, response } = useFetch({
    cachePolicy: CachePolicies.NO_CACHE,
    persist: false,
  })

  return {
    unBinding: loading,
    unBind: async ({
      source,vhost,destination,destination_type,properties_key
    }: Omit<RabbitBinding, 'routing_key' | 'arguments'>) => {
      const data = await del(
        `/bindings/${encodeURIComponent(vhost)}/e/${encodeURIComponent(source)}/${destination_type[0]}/${encodeURIComponent(destination)}/${encodeURIComponent(properties_key)}`,
        {
          destination,
          destination_type: destination_type[0],
          properties_key,
          source,
          vhost,
        }
      )

      if (!response.ok) {
        throw new Error(data?.reason)
      }
    },
  }
}
