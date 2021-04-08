import React, { FC } from 'react'
import { Col, Row } from 'antd'
import { Box } from '@xstyled/styled-components'
import { match as Match } from 'react-router-dom'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-plain_text'
import 'ace-builds/src-noconflict/theme-monokai'
import { useFetchQueueBindings } from '../../../hooks/useFetchQueueBindings'
import { BindingsTable } from '../../../components/BindingsTable'
import { useFetchQueue } from '../../../hooks/useFetchQueue'
import { RabbitBinding } from '../../../types'

export const Routing: FC<{
  match: Match<{ vhost: string; queueName: string }>
}> = ({ match }) => {
  const { vhost, queueName } = match.params
  const { bindings } = useFetchQueueBindings({
    vhost,
    queueName,
    live: true,
  })
  const { data } = useFetchQueue({ vhost, queueName, live: true })

  return (
    <Box m={20}>
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <BindingsTable show="source" vhost={decodeURIComponent(vhost)} bindings={bindings} />
        </Col>
        <Col span={12}>
          <BindingsTable show="destination" vhost={decodeURIComponent(vhost)} bindings={data?.arguments['x-dead-letter-exchange'] ? [{
            destination: data?.arguments['x-dead-letter-exchange'],
            destination_type: 'exchange',
            vhost: decodeURIComponent(vhost),
            routing_key: data?.arguments['x-dead-letter-routing-key'],
            dl: true
          } as RabbitBinding & { dl: boolean }] : []} />
        </Col>
      </Row>
    </Box>
  )
}
