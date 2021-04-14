import React, { FC } from 'react'
import { Link } from 'react-router-dom'

export const QueueLink: FC<{ name: string; vhost?: string; tab?: string }> = ({
  name,
  vhost,
  tab = '',
}) => {
  if (!vhost) {
    return <>{name}</>
  }

  return (
    <Link
      to={`/queues/${encodeURIComponent(vhost)}/${encodeURIComponent(
        name
      )}${tab}`}
    >
      {name}
    </Link>
  )
}
