import { Tag } from 'antd'
import React, { FC } from 'react'

export const BooleanTag: FC<{ value: boolean}> = ({
  value,
}) => {
  return (
    <Tag
      color={value ? 'green' : 'red'}
    >
      {value ? 'Yes' : 'No'}
    </Tag>
  )
}
