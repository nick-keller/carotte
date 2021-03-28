import React, { FC } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { RabbitSample } from '../types'
import {
  formatDate,
  formatNumber,
  formatSeconds,
  formatTime,
} from '../utils/format'

type Props = {
  samples: RabbitSample[]
  rate: number
}

export const ForecastGraph: FC<Props> = ({ samples, rate }) => {
  const graphData = samples.map((sample) => ({ ...sample })) as {
    timestamp: number
    sample?: number
    forecast?: number
  }[]

  const samplesRange = samples.length
    ? (samples[0].timestamp - samples[samples.length - 1].timestamp) / 1000
    : 0
  const forecastRange = Math.max(
    samplesRange * 3,
    Math.min(
      samplesRange * 30,
      samples.length && rate ? samples[0].sample / rate : 0
    )
  )

  if (graphData.length) {
    graphData[0].forecast = graphData[0].sample
    graphData.unshift({
      timestamp: graphData[0].timestamp + forecastRange * 1000,
      forecast: Math.max(0, (graphData[0].sample ?? 0) + rate * forecastRange),
    })
  }

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
            formatter={formatNumber}
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
          <Line
            key="sample"
            type="linear"
            dataKey="sample"
            dot={false}
            name="Actual"
            stroke="#ff4d4f"
            strokeWidth={2}
            animationDuration={0}
          />
          <Line
            key="forecast"
            dataKey="forecast"
            dot={false}
            name="Forecast"
            stroke="#7c7c7c"
            strokeWidth={2}
            strokeDasharray="6 3"
            animationDuration={0}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
