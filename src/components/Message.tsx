import React, { FC, useState } from 'react'
import { Card, Col, Descriptions, Row, Tag, Tooltip } from 'antd'
import ReactJson from 'react-json-view'
import { RabbitMessage } from '../types'
import { useRouteMatch } from 'react-router-dom'
import { ExchangeLink } from './ExchangeLink'
import { DeliveryModeTag } from './DeliveryModeTag'
import { formatDateTime, formatNumber } from '../utils/format'
import { BooleanTag } from './BooleanTag'
import { QueueLink } from './QueueLink'
import { ReasonTag } from './ReasonTag'

export const Message: FC<{ message: RabbitMessage }> = ({ message }) => {
  const { params } = useRouteMatch<{ vhost?: string }>()
  console.log(params)
  const [tab, setTab] = useState('payload')
  let json: any = undefined

  try {
    json = JSON.parse(message.payload)

    if (typeof json !== 'object' || json === null) {
      json = undefined
    }
  } catch (error) {
    // Do nothing
  }

  let content

  if (tab === 'payload') {
    content =
      json === undefined ? (
        <pre style={{ margin: 0 }}>{message.payload}</pre>
      ) : (
        <ReactJson src={json} name={false} />
      )
  }

  if (tab === 'headers') {
    content = (
      <Row gutter={[20, 20]}>
        <Col span={24} md={12} xl={8} xxl={6}>
        <Descriptions title="Delivery" column={1} size="small">
          <Descriptions.Item label="From exchange">
            <ExchangeLink name={message.exchange} vhost={params.vhost} />
          </Descriptions.Item>
          <Descriptions.Item label="Routing key">
            <pre style={{ margin: 0 }}>{message.routing_key}</pre>
          </Descriptions.Item>
          <Descriptions.Item label="Deliver mode">
            <pre style={{ margin: 0 }}><DeliveryModeTag mode={message.properties.delivery_mode} /></pre>
          </Descriptions.Item>
          <Descriptions.Item label="Redelivered">
            <BooleanTag value={message.redelivered} />
          </Descriptions.Item>
        </Descriptions>
        </Col>
        {message.properties.headers['x-first-death-exchange'] &&
          message.properties.headers['x-first-death-queue'] &&
          message.properties.headers['x-first-death-reason'] && <Col span={24} md={12} xl={8} xxl={6}>
          <Descriptions title="First death" column={1} size="small">
            <Descriptions.Item label="Exchange">
              <ExchangeLink name={message.properties.headers['x-first-death-exchange']} vhost={params.vhost}/>
            </Descriptions.Item>
            <Descriptions.Item label="Queue">
              <QueueLink name={message.properties.headers['x-first-death-queue']} vhost={params.vhost}/>
            </Descriptions.Item>
            <Descriptions.Item label="Reason">
              <ReasonTag reason={message.properties.headers['x-first-death-reason']}/>
            </Descriptions.Item>
          </Descriptions>
        </Col>}
        {(message.properties.headers['x-death'] ?? []).map((death => (
          <Col span={24} md={12} xl={8} xxl={6}>
            <Descriptions title="Death" column={1} size="small">
              <Descriptions.Item label="Count">
                {formatNumber(death.count)}
              </Descriptions.Item>
              <Descriptions.Item label="Exchange">
                <ExchangeLink name={death.exchange} vhost={params.vhost} />
              </Descriptions.Item>
              <Descriptions.Item label="Queue">
                <QueueLink name={death.queue} vhost={params.vhost} />
              </Descriptions.Item>
              <Descriptions.Item label="Reason">
                <ReasonTag reason={death.reason} />
              </Descriptions.Item>
              <Descriptions.Item label="Routing keys">
                {death['routing-keys'].map(routingKey => <pre style={{ margin: '0 10px 0 0', display: 'inline' }}>{routingKey}</pre>)}
              </Descriptions.Item>
              <Descriptions.Item label="Time">
                <Tooltip title={death.time}>{formatDateTime(death.time * 1000)}</Tooltip>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        )))}
      </Row>
    )
  }

  return (
    <Card
      tabList={[
        { key: 'payload', tab: 'Payload' },
        { key: 'headers', tab: 'Headers' },
      ]}
      activeTabKey={tab}
      onTabChange={setTab}
      tabBarExtraContent={[
        message.payload_encoding && <Tooltip title="Encoding" key="encoding"><Tag>{message.payload_encoding}</Tag></Tooltip>,
        message.payload_bytes && <>{formatNumber(message.payload_bytes)} bytes</>
      ]}
    >
      {content}
    </Card>
  )
}
