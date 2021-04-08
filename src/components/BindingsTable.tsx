import React, { FC } from 'react'
import { Button, Space, Table, Tag, Tooltip } from 'antd'
import { RabbitBinding, RabbitExchange } from '../types'
import { Link } from 'react-router-dom'
import { DeleteOutlined } from '@ant-design/icons'

export const BindingsTable: FC<{
  bindings?: RabbitBinding[]
  show: 'source' | 'destination'
  alternateExchange?: string
  destinationAlternateExchanges?: RabbitExchange[]
  vhost?: string
}> = ({
  bindings,
  show,
  alternateExchange,
  vhost,
  destinationAlternateExchanges,
}) => {
  return (
    <Table
      dataSource={[
        ...(bindings ?? []),
        ...(alternateExchange
          ? [
              {
                destination_type: 'exchange',
                destination: alternateExchange,
                vhost,
                ae: true,
              },
            ]
          : []),
        ...(destinationAlternateExchanges ?? []).map((e) => ({
          source: e.name,
          vhost: e.vhost,
          ae: true,
        })),
      ]}
      columns={[
        {
          title: show === 'source' ? 'From' : 'To',
          render: ({
            destination,
            destination_type,
            source,
            vhost,
          }: RabbitBinding) => {
            const type =
              show === 'source' || destination_type === 'exchange'
                ? 'exchange'
                : 'queue'
            const name = show === 'source' ? source : destination

            return (
              <Space>
                <Link
                  to={`/${
                    type === 'exchange' ? 'exchanges' : 'queues'
                  }/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`}
                >
                  {name}
                </Link>
                <Tag color={type === 'exchange' ? 'orange' : 'blue'}>
                  {type}
                </Tag>
              </Space>
            )
          },
        },
        {
          title: 'Routing key',
          dataIndex: 'routing_key',
          render: (value, binding) =>
            'ae' in binding ? (
              <Tooltip
                title={
                  <>
                    When the exchange cannot route a message to any queue, it
                    publishes the message to this alternate exchange instead.{' '}
                    <a href="https://www.rabbitmq.com/ae.html">More info</a>
                  </>
                }
              >
                <Tag color="red">Alternate Exchange</Tag>
              </Tooltip>
            ) : (
              <pre style={{ margin: 0 }}>{value}</pre>
            ),
        },
        {
          width: 1,
          render: (value) =>
            !('ae' in value) && (
              <Button
                icon={<DeleteOutlined />}
                shape="circle"
                danger
                size="small"
                disabled
              />
            ),
        },
      ]}
      pagination={{
        position: ['bottomCenter'],
        defaultPageSize: 20,
        hideOnSinglePage: true,
        showSizeChanger: true,
      }}
    />
  )
}
