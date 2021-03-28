import React, { FC } from 'react'
import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  formatDate,
  formatNumber,
  formatSeconds,
  formatTime,
} from '../../utils/format'

type Props = {
  data: { timestamp: number }[]
  format?: (value: number) => string
}

export const BaseGraph: FC<Props> = ({
  data,
  format = formatNumber,
  children,
}) => {
  const firstTimestamp = data[0]?.timestamp ?? 0
  const lastTimestamp = data[data.length - 1]?.timestamp ?? 0

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
      <ResponsiveContainer aspect={4} minHeight={100}>
        <LineChart data={data} margin={{ top: 5, right: 5 }}>
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
          {children}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
