import React, { FC } from 'react'
import { Space, Table, Tag, Tooltip } from 'antd'
import { RabbitBinding, RabbitExchange, RabbitQueue } from '../types'
import { ExchangeLink } from './ExchangeLink'
import { QueueLink } from './QueueLink'
import { UnBindButton } from '../actions/unBind/UnBindButton'

export const BindingsTable: FC<{
  bindings?: (RabbitBinding & { ae?: boolean; dl?: boolean })[]
  show: 'source' | 'destination'
  alternateExchange?: string
  destinationAlternateExchanges?: RabbitExchange[]
  destinationDeadLetters?: RabbitQueue[]
  vhost?: string
}> = ({
  bindings = [],
  show,
  alternateExchange,
  vhost,
  destinationAlternateExchanges = [],
  destinationDeadLetters = [],
}) => {
  return (
    <Table
      dataSource={[
        ...bindings,
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
        ...destinationAlternateExchanges.map((e) => ({
          source: e.name,
          vhost: e.vhost,
          ae: true,
        })),
        ...destinationDeadLetters.map((q) => ({
          source: q.name,
          vhost: q.vhost,
          routing_key: q.arguments['x-dead-letter-routing-key'],
          dl: true,
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
            ae,
            dl,
          }: RabbitBinding & { ae?: boolean; dl?: boolean }) => {
            const type =
              (show === 'source' && !dl) || destination_type === 'exchange'
                ? 'exchange'
                : 'queue'
            const name = show === 'source' ? source : destination

            return (
              <Space>
                {type === 'exchange' && (
                  <ExchangeLink name={name} vhost={vhost} />
                )}
                {type === 'queue' && (
                  <QueueLink name={name} vhost={vhost} tab="/routing" />
                )}
                <span>
                  <Tag color={type === 'exchange' ? 'orange' : 'blue'}>
                    {type}
                  </Tag>
                  {ae && (
                    <Tooltip
                      title={
                        <>
                          When the exchange cannot route a message to any queue,
                          it publishes the message to this alternate exchange
                          instead.{' '}
                          <a href="https://www.rabbitmq.com/ae.html">
                            More info
                          </a>
                        </>
                      }
                    >
                      <Tag color="red">Alternate Exchange</Tag>
                    </Tooltip>
                  )}
                  {dl && (
                    <Tooltip
                      title={
                        <>
                          A message is republished to this exchange when it is
                          negatively acknowledged, it expires, or it is dropped
                          because its queue exceeded a length limit.{' '}
                          <a href="https://www.rabbitmq.com/dlx.html">
                            More info
                          </a>
                        </>
                      }
                    >
                      <Tag color="red">Dead letter</Tag>
                    </Tooltip>
                  )}
                </span>
              </Space>
            )
          },
        },
        {
          title: 'Routing key',
          dataIndex: 'routing_key',
          render: (value) => <pre style={{ margin: 0 }}>{value}</pre>,
        },
        {
          width: 1,
          render: (value) =>
            !value.ae && value.source !== '' &&
            !value.dl && (
              <UnBindButton binding={value} />
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
