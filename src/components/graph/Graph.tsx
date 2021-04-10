import React, { FC } from 'react'
import { Line } from 'recharts'
import { RabbitSample } from '../../types'
import { formatNumber } from '../../utils/format'
import { CurveType } from 'recharts/types/shape/Curve'
import { BaseGraph } from './BaseGraph'

type Props = {
  data: {
    samples: RabbitSample[]
    name: string
    stroke: string
  }[]
  derivative?: boolean
  format?: (value: number) => string
  type?: CurveType
}

export const Graph: FC<Props> = ({
  data,
  derivative,
  format = formatNumber,
  type = 'linear',
}) => {
  const graphData = (data[0]?.samples ?? [])
    .map(({ timestamp }, i) => {
      if (derivative && i === 0) {
        return null
      }

      return data.reduce(
        (acc, cur) => {
          if (derivative) {
            if (!cur.samples[i]) {
              acc[cur.name] = 0
            } else {
              acc[cur.name] =
                ((cur.samples[i - 1].sample - cur.samples[i].sample) /
                  (cur.samples[i - 1].timestamp - cur.samples[i].timestamp)) *
                1000
            }
          } else {
            acc[cur.name] =
              cur.samples[i]?.sample ?? cur.samples[i - 1]?.sample ?? null
          }

          return acc
        },
        { timestamp } as { timestamp: number; [key: string]: number }
      )
    })
    .filter((Boolean as any) as (value: any) => value is { timestamp: number })

  return (
    <BaseGraph data={graphData} format={format}>
      {data.map(({ name, stroke }) => (
        <Line
          key={name}
          type={type}
          dataKey={name}
          dot={false}
          name={name}
          stroke={stroke}
          strokeWidth={2}
          animationDuration={0}
        />
      ))}
    </BaseGraph>
  )
}
