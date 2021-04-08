import React, { FC } from 'react'
import { RabbitExchange } from '../types'
import { Link } from 'react-router-dom'

export const ExchangeLink: FC<Pick<RabbitExchange, 'name' | 'vhost'>> = ({
  name,
  vhost,
}) => {
  return (
    <Link
      to={`/exchanges/${encodeURIComponent(vhost)}/${encodeURIComponent(
        name || 'amq.default'
      )}`}
    >
      {name || '(AMQP default)'}
    </Link>
  )
}
