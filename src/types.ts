export type RabbitSample = {
  sample: number
  timestamp: number
}

export enum DeliveryMode {
  Persistent = 2,
  Transient = 1,
}

export type RabbitMessageStat = {
  avg: number
  avg_rate: number
  rate: number
  samples: RabbitSample[]
}

export type RabbitConsumer = {
  arguments: Record<string, any>
  channel_details: {
    connection_name: string
    name: string
    node: string
    number: number
    peer_host: string
    peer_port: number
    user: string
  }
  ack_required: boolean
  active: boolean
  activity_status: string
  consumer_tag: string
  exclusive: boolean
  prefetch_count: number
  queue: { name: string; vhost: string }
}

export type RabbitExchangeArguments = {
  'alternate-exchange'?: string
}

export type RabbitBindingArguments = {
  'alternate-exchange'?: string
}

export type RabbitQueueArguments = {
  'x-dead-letter-exchange'?: string
  'x-single-active-consumer'?: boolean
  'x-dead-letter-routing-key'?: string
  'x-message-ttl'?: number
  'x-max-length'?: number
  'x-max-length-bytes'?: number
  'x-max-priority'?: number
  'x-expires'?: number
  'x-overflow'?: 'drop-head' | 'reject-publish' | 'reject-publish-dlx'
  'x-queue-mode'?: 'lazy' | 'default'
  'x-queue-type'?: 'classic' | 'quorum'
}

export type RabbitBinding = {
  arguments: RabbitBindingArguments
  destination: string
  destination_type: 'exchange' | 'queue'
  properties_key: string
  routing_key: string
  source: string
  vhost: string
}

export type RabbitExchange = {
  arguments: RabbitExchangeArguments
  auto_delete: boolean
  durable: boolean
  incoming: []
  internal: boolean
  name: string
  outgoing: []
  type: 'fanout' | 'direct' | 'topic' | 'headers'
  user_who_performed_action: string
  vhost: string
}

export type RabbitQueue<Stat = RabbitMessageStat> = {
  consumer_details: RabbitConsumer[]
  arguments: RabbitQueueArguments
  auto_delete: boolean
  consumers: number
  durable: boolean
  exclusive: boolean
  idle_since: string
  memory: number
  message_bytes: number
  message_bytes_paged_out: number
  message_bytes_persistent: number
  message_bytes_ram: number
  message_bytes_ready: number
  message_bytes_unacknowledged: number
  message_stats: {
    ack: number
    ack_details: Stat
    deliver: number
    deliver_details: Stat
    deliver_get: number
    deliver_get_details: Stat
    deliver_no_ack: number
    deliver_no_ack_details: Stat
    get: number
    get_details: Stat
    get_empty: number
    get_empty_details: Stat
    get_no_ack: number
    get_no_ack_details: Stat
    publish: number
    publish_details: Stat
    redeliver: number
    redeliver_details: Stat
  }
  messages: number
  messages_details: Stat
  messages_paged_out: number
  messages_persistent: number
  messages_ram: number
  messages_ready: number
  messages_ready_details: Stat
  messages_ready_ram: number
  messages_unacknowledged: number
  messages_unacknowledged_details: Stat
  messages_unacknowledged_ram: number
  name: string
  node: string
  reductions: number
  reductions_details: Stat
  state: 'running' | string
  type: 'classic' | 'quorum'
  vhost: string
}

export type DeathReason = 'rejected' | 'expired' | 'maxlen'

export type RabbitMessage = {
  exchange: string
  message_count?: number
  payload: string
  payload_bytes?: number
  payload_encoding: string
  properties: {
    delivery_mode: DeliveryMode
    headers: {
      'x-death'?: {
        count: number
        exchange: string
        queue: string
        reason: DeathReason
        'routing-keys': string[]
        time: number
      }[]
      'x-first-death-exchange'?: string
      'x-first-death-queue'?: string
      'x-first-death-reason'?: DeathReason
    }
  }
  redelivered: boolean
  routing_key: string
}
