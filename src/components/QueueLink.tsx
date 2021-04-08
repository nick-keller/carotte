import React, { FC } from 'react'
import { RabbitQueue } from '../types'
import { Link } from 'react-router-dom'

export const QueueLink: FC<Pick<RabbitQueue, 'name' | 'vhost'>> = ({
  name,
  vhost,
}) => {
  return (
    <Link
      to={`/queues/${encodeURIComponent(vhost)}/${encodeURIComponent(
        name
      )}`}
    >
      {name}
    </Link>
  )
}
