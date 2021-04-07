import React, { FC } from 'react'
import { InputUnit } from './InputUnit'

export const InputBytes: FC<{
  id?: string
  value?: number | null
  min?: number
  onChange?: (value: number | null) => void
  disabled?: boolean
}> = (props) => {
  return (
    <InputUnit
      defaultScale={1 << 20}
      units={[
        { value: 1, label: 'bytes' },
        { value: 1 << 10, label: 'kilobytes' },
        { value: 1 << 20, label: 'megabytes' },
        { value: 1 << 30, label: 'gigabytes' },
      ]}
      {...props}
    />
  )
}
