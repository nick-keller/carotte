import React, { FC } from 'react'
import { Col, Radio, Row, Space, Statistic, Switch, } from 'antd'
import { Box } from '@xstyled/styled-components'
import { match as Match } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import { formatDate } from '../../../utils/format'
import { ForecastGraph } from '../../../components/graph/ForecastGraph'
import { useFetchQueue } from '../../../hooks/useFetchQueue'

const MINUTE = 60

export const Forecast: FC<{
  match: Match<{ vhost: string; queueName: string }>
}> = ({ match }) => {
  const { vhost, queueName } = match.params

  const [liveQueue, setLiveQueue] = useLocalStorage('liveQueue', true)
  const [forecastRange, setForecastRange] = useLocalStorage('forecastRange', 30)

  const { data } = useFetchQueue({
    vhost,
    queueName,
    live: liveQueue,
    range: forecastRange,
    resolution: 10,
    messageSamples: true,
  })

  const samples = data?.messages_details.samples ?? []
  const firstSample = samples[0] ?? { sample: 0, timestamp: 0 }
  const lastSample = samples[samples.length - 1] ?? { sample: 0, timestamp: 0 }
  const delta = firstSample.sample - lastSample.sample
  const range = firstSample.timestamp - lastSample.timestamp
  const rate = range ? (delta / range) * 1000 : 0
  const currentMessages = data?.messages ?? 0
  const timeToZero =
    currentMessages === 0 ? 0 : rate >= 0 ? null : currentMessages / -rate
  const eta = timeToZero !== null ? Date.now() + timeToZero * 1000 : null

  return (
    <Box m={20}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Space size="large">
            <Radio.Group
              value={forecastRange}
              onChange={(e) => setForecastRange(e.target.value)}
              size="small"
            >
              <Radio.Button value={10}>10s</Radio.Button>
              <Radio.Button value={30}>30s</Radio.Button>
              <Radio.Button value={MINUTE}>1m</Radio.Button>
              <Radio.Button value={5 * MINUTE}>5m</Radio.Button>
              <Radio.Button value={10 * MINUTE}>10m</Radio.Button>
              <Radio.Button value={30 * MINUTE}>30m</Radio.Button>
              <Radio.Button value={60 * MINUTE}>1h</Radio.Button>
            </Radio.Group>
            <Switch
              checked={liveQueue}
              onChange={setLiveQueue}
              checkedChildren="Live"
              unCheckedChildren="Frozen"
            />
          </Space>
        </Col>

        <Col span={12}>
          <Space direction="vertical">
            <Statistic
              title="Delta"
              value={delta}
              prefix={delta > 0 ? '+' : null}
            />
            <Statistic
              title="Average rate"
              value={rate < 0.1 && rate > -0.1 ? rate * 60 : rate}
              precision={2}
              prefix={rate > 0 ? '+' : null}
              suffix={rate < 0.1 && rate > -0.1 ? '/min' : '/s'}
            />
            {eta && <Statistic.Countdown title="Time to zero" value={eta} />}
            {!eta && <Statistic title="Time to zero" value="∞" />}
            <Statistic
              title="ETA to zero"
              value={eta ? formatDate(eta) : '∞'}
            />
          </Space>
        </Col>
        <Col span={12}>
          <ForecastGraph
            samples={data?.messages_details.samples ?? []}
            rate={rate}
          />
        </Col>
      </Row>
    </Box>
  )
}
