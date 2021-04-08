import React, { FC } from 'react'
import { Col, Row } from 'antd'
import { Box } from '@xstyled/styled-components'
import { match as Match } from 'react-router-dom'
import { useFetchExchange } from '../../../hooks/useFetchExchange'
import { BindingsTable } from '../../../components/BindingsTable'
import { useFetchExchangeSource } from '../../../hooks/useFetchExchangeSource'
import { useFetchExchangeDestination } from '../../../hooks/useFetchExchangeDestination'

export const Routing: FC<{
  match: Match<{ vhost: string; exchangeName: string }>
}> = ({ match }) => {
  const { vhost, exchangeName } = match.params

  const { data } = useFetchExchange({
    vhost,
    exchangeName,
    live: true,
  })

  const { source } = useFetchExchangeSource({
    vhost,
    exchangeName,
    live: true,
  })

  const { destination, destinationAlternateExchanges, destinationDeadLetters } = useFetchExchangeDestination({
    vhost,
    exchangeName,
    live: true,
  })

  return (
    <Box m={20}>
      <Row gutter={[20, 20]}>
        <Col span={24} lg={12}>
          <BindingsTable
            bindings={destination}
            show="source"
            destinationAlternateExchanges={destinationAlternateExchanges}
            destinationDeadLetters={destinationDeadLetters}
          />
        </Col>

        <Col span={24} lg={12}>
          <BindingsTable
            bindings={source}
            show="destination"
            alternateExchange={data?.arguments['alternate-exchange']}
            vhost={data?.vhost}
          />
        </Col>
      </Row>
    </Box>
  )
}
