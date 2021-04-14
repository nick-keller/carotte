import { Tag, Tooltip } from 'antd'
import React, { FC } from 'react'
import { DeliveryMode } from '../types'

export const DeliveryModeTag: FC<{ mode: DeliveryMode }> = ({ mode }) => {
  if (!mode) {
    return null
  }

  return (
    <Tooltip title={mode}>
      <Tag
        color={
          {
            [DeliveryMode.Persistent]: 'purple',
            [DeliveryMode.Transient]: 'orange',
          }[mode] ?? 'gray'
        }
      >
        {{
          [DeliveryMode.Persistent]: 'persistent',
          [DeliveryMode.Transient]: 'transient',
        }[mode] ?? mode}
      </Tag>
    </Tooltip>
  )
}
