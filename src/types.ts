export type Sample = {
  sample: number
  timestamp: number
}

export type MessageStat = {
  avg: number
  avg_rate: number
  rate: number
  samples: Sample[]
}

export type Consumer = {
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

export type QueueArguments = {
  'x-dead-letter-exchange'?: string
  'x-single-active-consumer'?: boolean
  'x-dead-letter-routing-key'?: string
  'x-message-ttl'?: number
}

export type Queue<Stat = MessageStat> = {
  consumer_details: Consumer[]
  arguments: QueueArguments
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
  type: 'classic' | string
  vhost: string
}

export type RabbitMessage = {
  exchange: string
  message_count: number
  payload: string
  payload_bytes: number
  payload_encoding: string
  properties: Record<string, any>
  redelivered: boolean
  routing_key: string
}
