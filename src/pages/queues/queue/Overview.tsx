import React, { FC, useEffect, useState } from 'react'
import { Col, Radio, Row, Space, Statistic, Badge, Switch } from 'antd'
import { Box } from '@xstyled/styled-components'
import { match as Match } from 'react-router-dom'
import { CachePolicies, useFetch } from 'use-http'
import qs from 'qs'
import { RabbitQueue } from '../../../types'
import { Graph } from '../../../components/Graph'
import { formatRate } from '../../../utils/format'
import useLocalStorage from 'use-local-storage'

const MINUTE = 60
const GRAPH_RESOLUTION = 30

const messages = [
  {
    key: 'messages',
    name: 'Total',
    color: '#ff4d4f',
  },
  {
    key: 'messages_ready',
    name: 'Ready',
    color: '#ffa940',
  },
  {
    key: 'messages_unacknowledged',
    name: 'Unacked',
    color: '#40a9ff',
  },
]

const messagesGet = [
  {
    key: 'ack',
    name: 'Consumer ack',
    color: '#73d13d',
  },
  {
    key: 'deliver_get',
    name: 'Redelivered',
    color: '#9254de',
  },
  {
    key: 'get',
    name: 'Get (manual ack)',
    color: '#434343',
  },
  {
    key: 'get_no_ack',
    name: 'Get (auto ack)',
    color: '#8c8c8c',
  },
]

const messagesPublish = [
  {
    key: 'publish',
    name: 'Publish',
    color: '#ffa940',
  },
  {
    key: 'deliver',
    name: 'Deliver (manual ack)',
    color: '#40a9ff',
  },
  {
    key: 'deliver_no_ack',
    name: 'Deliver (auto ack)',
    color: '#ff4d4f',
  },
]

export const Overview: FC<{
  match: Match<{ vhost: string; queueName: string }>
}> = ({ match }) => {
  const { vhost, queueName } = match.params

  const [liveQueue, setLiveQueue] = useLocalStorage('liveQueue', true)
  const [graphRange, setGraphRange] = useLocalStorage('graphRange', MINUTE)
  const graphInterval = Math.round(graphRange / GRAPH_RESOLUTION)

  const params = qs.stringify({
    lengths_age: graphRange,
    lengths_incr: graphInterval,
    msg_rates_age: graphRange,
    msg_rates_incr: graphInterval,
  })

  const { data, loading, get } = useFetch<RabbitQueue>(
    `queues/${vhost}/${queueName}?${params}`,
    {
      cachePolicy: CachePolicies.NETWORK_ONLY,
      persist: false,
    },
    [params, liveQueue]
  )

  useEffect(() => {
    if (!loading && liveQueue) {
      const timeout = setTimeout(get, 2000)

      return () => clearTimeout(timeout)
    }
  }, [get, liveQueue, loading])

  return (
    <Box m={20}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Space size="large">
            <Radio.Group
              value={graphRange}
              onChange={(e) => setGraphRange(e.target.value)}
              size="small"
            >
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
          <Graph
            data={messages.map(({ key, name, color }) => ({
              samples:
                data?.[(key + '_details') as 'messages_details'].samples ?? [],
              name,
              stroke: color,
            }))}
          />
          <Box ml={60} mt={20}>
            <Space direction="vertical">
              {messages.map(({ key, name, color }) => (
                <Statistic
                  title={<Badge color={color} text={name} />}
                  value={data?.[key as 'messages']}
                />
              ))}
            </Space>
          </Box>
        </Col>
        <Col span={12}>
          <Graph
            derivative
            format={(value) => formatRate(value) + '/s'}
            type="step"
            data={[...messagesPublish, ...messagesGet]
              .map(({ key, name, color }) => ({
                samples:
                  data?.message_stats?.[(key + '_details') as 'ack_details']
                    ?.samples ?? [],
                name,
                stroke: color,
              }))
              .filter(({ samples }) => samples.length)}
          />

          <Box ml={60} mt={20}>
            <Row gutter={20}>
              <Col span={12}>
                <Space direction="vertical">
                  {messagesPublish.map(({ key, name, color }) => (
                    <Statistic
                      title={<Badge color={color} text={name} />}
                      value={
                        data?.message_stats?.[
                          (key + '_details') as 'ack_details'
                        ]?.rate
                      }
                      precision={2}
                      suffix="/s"
                    />
                  ))}
                </Space>
              </Col>
              <Col span={12}>
                <Space direction="vertical">
                  {messagesGet.map(({ key, name, color }) => (
                    <Statistic
                      title={<Badge color={color} text={name} />}
                      value={
                        data?.message_stats?.[
                          (key + '_details') as 'ack_details'
                        ]?.rate
                      }
                      precision={2}
                      suffix="/s"
                    />
                  ))}
                </Space>
              </Col>
            </Row>
          </Box>
        </Col>
      </Row>
    </Box>
  )
}
