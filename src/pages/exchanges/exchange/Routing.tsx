import React, { FC } from 'react'
import { Col, Row } from 'antd'
import { Box } from '@xstyled/styled-components'
import { match as Match } from 'react-router-dom'
import { useFetchExchange } from '../../../hooks/useFetchExchange'
import { BindingsTable } from '../../../components/BindingsTable'

export const Routing: FC<{
  match: Match<{ vhost: string; exchangeName: string }>
}> = ({ match }) => {
  const { vhost, exchangeName } = match.params

  const { data } = useFetchExchange({
    vhost,
    exchangeName,
  })

  return (
    <Box m={20}>
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <BindingsTable
            bindings={data?.destination}
            show="source"
            destinationAlternateExchanges={data?.destinationAlternateExchanges}
          />
        </Col>

        <Col span={12}>
          <BindingsTable
            bindings={data?.source}
            show="destination"
            alternateExchange={data?.arguments['alternate-exchange']}
            vhost={data?.vhost}
          />
        </Col>
      </Row>
    </Box>
  )
}
