import { Tag } from 'antd'
import React, { FC } from 'react'
import { RabbitQueue } from '../types'

export const QueueTypeTag: FC<Partial<Pick<RabbitQueue, 'type'>>> = ({
  type,
}) => {
  if (!type) {
    return null
  }

  return (
    <Tag
      color={
        {
          classic: 'blue',
          quorum: 'green',
        }[type] ?? 'gray'
      }
    >
      {type}
    </Tag>
  )
}
