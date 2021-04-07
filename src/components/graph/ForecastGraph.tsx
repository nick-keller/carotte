import React, { FC } from 'react'
import { Line } from 'recharts'
import { RabbitSample } from '../../types'
import { BaseGraph } from './BaseGraph'

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
    samplesRange * 2,
    samples.length && rate < 0
      ? Math.min(samplesRange * 20, samples[0].sample / -rate)
      : 0
  )

  if (graphData.length) {
    const fromTimestamp = graphData[0].timestamp
    graphData[0].forecast = graphData[0].sample

    if ((graphData[0].sample ?? 0) + rate * forecastRange < 0) {
      graphData.unshift({
        timestamp: fromTimestamp - ((graphData[0].sample ?? 0) / rate) * 1000,
        forecast: 0,
      })
    }

    graphData.unshift({
      timestamp: fromTimestamp + forecastRange * 1000,
      forecast: Math.max(0, (graphData[0].sample ?? 0) + rate * forecastRange),
    })
  }

  return (
    <BaseGraph data={graphData}>
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
    </BaseGraph>
  )
}
