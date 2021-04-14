import React, { FC } from 'react'
import { Link } from 'react-router-dom'

export const ExchangeLink: FC<{ name: string; vhost?: string }> = ({
  name,
  vhost,
}) => {
  if (!vhost) {
    return <>{name || '(AMQP default)'}</>
  }

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
