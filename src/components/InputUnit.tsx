import React, { FC, useEffect, useState } from 'react'
import { Input, Select } from 'antd'
import { InputNumber } from 'antd/es'

export const InputUnit: FC<{
  id?: string
  value?: number | null
  min?: number
  onChange?: (value: number | null) => void
  defaultScale: number
  units: {value: number; label: string}[]
  disabled?: boolean
}> = ({ id, value = null, onChange = () => null, min = 0, defaultScale, units, disabled = false }) => {
  const [scale, setScale] = useState(defaultScale)

  useEffect(() => {
    if (value !== null) {
      const rounded = Math.max(min, Math.round(value / scale)) * scale

      if (rounded !== value) {
        onChange(rounded)
      }
    }
  }, [min, onChange, value, scale])

  return (
    <Input.Group compact>
      <InputNumber
        id={id}
        value={value === null ? '' : value / scale}
        min={min}
        precision={0}
        parser={(v): number | '' => {
          const parsed = v === '' || isNaN(Number(v)) ? '' : Math.round(Number(v))
          onChange(parsed === '' ? null : Math.max(min, parsed * scale))
          return parsed
        }}
        onChange={(v) => onChange(v === '' ? null : Math.max(min, v * scale))}
        style={{ width: '150px' }}
        disabled={disabled}
      />
      <Select
        value={scale}
        onChange={setScale}
        style={{ width: '125px' }}
        options={units}
        disabled={disabled}
      />
    </Input.Group>
  )
}
