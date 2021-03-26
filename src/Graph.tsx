import React, { FC, useEffect, useState } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { Sample } from './types'
import { formatDate, formatNumber, formatSeconds, formatTime } from './format'

type Props = {
  data: {
    samples: Sample[]
    name: string
    stroke: string
  }[]
  derivative?: boolean
  format?: (value: number) => string
}

export const Graph: FC<Props> = ({
  data,
  derivative,
  format = formatNumber,
}) => {
  const graphData = (data[0]?.samples ?? [])
    .map(({ timestamp }, i) => {
      if (derivative && i === 0) {
        return null
      }

      return data.reduce(
        (acc, cur) => {
          if (derivative) {
            acc[cur.name] =
              (cur.samples[i - 1].sample - cur.samples[i].sample) / (cur.samples[i - 1].timestamp - cur.samples[i].timestamp) * 1000
          } else {
            acc[cur.name] = cur.samples[i].sample
          }

          return acc
        },
        { timestamp } as Record<string, number>
      )
    })
    .filter((Boolean as any) as (value: any) => value is Record<string, number>)

  const firstTimestamp = graphData[0]?.timestamp ?? 0
  const lastTimestamp = graphData[graphData.length - 1]?.timestamp ?? 0

  const range = (firstTimestamp - lastTimestamp) / 1000
  const spacing =
    [30 * 60, 15 * 60, 10 * 60, 5 * 60, 60, 20].find(
      (value) => range / value >= 3
    ) ?? 10
  const ticks = []

  for (
    let tick = Math.round(lastTimestamp / spacing / 1000) * spacing * 1000;
    tick <= firstTimestamp;
    tick += spacing * 1000
  ) {
    if (tick >= lastTimestamp) {
      ticks.push(tick)
    }
  }

  return (
    <div>
    <ResponsiveContainer aspect={4}>
      <LineChart data={graphData} margin={{ top: 5, right: 5 }}>
        <ChartTooltip
          labelFormatter={(x) => formatDate(x)}
          formatter={format}
        />
        <YAxis
          domain={[0, (dataMax: number) => Math.max(1, dataMax)]}
          tickFormatter={formatNumber}
          axisLine={false}
          tickLine={false}
        />
        <XAxis
          type="number"
          tickFormatter={range <= 120 ? formatSeconds : formatTime}
          dataKey="timestamp"
          ticks={ticks}
          domain={['dataMin', 'dataMax']}
          axisLine={false}
          tickLine={false}
        />
        <CartesianGrid strokeDasharray="3 3" />
        {data.map(({ name, stroke }) => (
          <Line
            key={name}
            type="step"
            dataKey={name}
            dot={false}
            name={name}
            stroke={stroke}
            strokeWidth={2}
            animationDuration={0}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
    </div>
  )
}
