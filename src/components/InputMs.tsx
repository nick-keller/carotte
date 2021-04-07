import React, { FC } from 'react'
import { InputUnit } from './InputUnit'

export const InputMs: FC<{
  id?: string
  value?: number | null
  min?: number
  onChange?: (value: number | null) => void
  disabled?: boolean
}> = (props) => {
  return <InputUnit defaultScale={1000} units={[
    { value: 1, label: 'milliseconds' },
    { value: 1000, label: 'seconds' },
    { value: 60000, label: 'minutes' },
    { value: 3600000, label: 'hours' },
  ]} {...props} />
}
