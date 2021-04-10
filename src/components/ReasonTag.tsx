import { Tag } from 'antd'
import React, { FC } from 'react'
import { DeathReason } from '../types'

export const ReasonTag: FC<{reason?: DeathReason}> = ({
  reason,
}) => {
  if (!reason) {
    return null
  }

  return (
    <Tag
      color={
        { rejected: 'red', expired: 'purple' }[reason] ?? 'gray'
      }
    >
      {reason}
    </Tag>
  )
}
