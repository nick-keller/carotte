import React, { FC } from 'react'
import { Tag, Tooltip } from 'antd'

export const OptTag: FC<{
  name: string
  abbr: string
  value?: boolean | string | number
}> = ({ name, value, abbr }) => {
  let title = name

  if (typeof value === 'number' || (typeof value === 'string' && value)) {
    title += ': ' + value
  }

  return (
    <Tooltip
      title={
        <span
          style={{
            textDecoration: value || value === 0 ? undefined : 'line-through',
          }}
        >
          {title}
        </span>
      }
    >
      <Tag color={value || value === 0 ? 'blue' : 'gray'}>{abbr}</Tag>
    </Tooltip>
  )
}
