import { Tag } from 'antd'
import React, { FC } from 'react'
import { RabbitExchange } from '../types'

export const ExchangeTypeTag: FC<Partial<Pick<RabbitExchange, 'type'>>> = ({
  type,
}) => {
  if (!type) {
    return null
  }

  return (
    <Tag
      color={
        {
          fanout: 'green',
          direct: 'blue',
          topic: 'purple',
          headers: 'orange',
        }[type] ?? 'gray'
      }
    >
      {type}
    </Tag>
  )
}
