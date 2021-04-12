import { CachePolicies, useFetch } from 'use-http'
import { RabbitQueueArguments } from '../../types'

const boolToStr = (value: boolean) => (value ? 'true' : 'false')

export type NewQueueParams = {
  vhost: string
  name: string
  autoDelete: boolean
  durable: boolean
  singleActiveConsumer: boolean
  lazy: boolean
  deadLetterExchange: string | null
  deadLetterRoutingKey: string
  ttl: null | number
  messagesTtl: null | number
  type: 'classic' | 'quorum'
  maxLength: null | number
  maxLengthBytes: null | number
  overflow: 'drop-head' | 'reject-publish' | 'reject-publish-dlx'
}

export const useNewQueue = () => {
  const { loading, put, response } = useFetch({
    cachePolicy: CachePolicies.NO_CACHE,
    persist: false,
  })

  return {
    creating: loading,
    create: async ({
      vhost,
      name,
      autoDelete,
      durable,
      deadLetterExchange,
      deadLetterRoutingKey,
      ttl,
      messagesTtl,
      lazy,
      singleActiveConsumer,
      type,
      maxLength,
      maxLengthBytes,
      overflow,
    }: NewQueueParams) => {
      const data = await put(
        `/queues/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`,
        {
          arguments: {
            'x-message-ttl':
              type === 'quorum' ? undefined : messagesTtl ?? undefined,
            'x-expires': type === 'quorum' ? undefined : ttl ?? undefined,
            'x-single-active-consumer': singleActiveConsumer,
            'x-queue-mode': lazy && type !== 'quorum' ? 'lazy' : undefined,
            'x-queue-type': type,
            'x-max-length': maxLength ?? undefined,
            'x-max-length-bytes': maxLengthBytes ?? undefined,
            'x-dead-letter-exchange': deadLetterExchange || undefined,
            'x-dead-letter-routing-key': deadLetterExchange && deadLetterRoutingKey ? deadLetterRoutingKey : undefined,
            'x-overflow':
              (maxLength !== null || maxLengthBytes !== null) &&
              type !== 'quorum'
                ? overflow
                : undefined,
          } as RabbitQueueArguments,
          auto_delete: boolToStr(autoDelete && type !== 'quorum'),
          durable: boolToStr(durable || type === 'quorum'),
          name,
          vhost,
        }
      )

      if (!response.ok) {
        throw new Error(data?.reason)
      }
    },
  }
}
