import React from 'react'
import { match as Match } from 'react-router-dom'
import { PageHeader, Spin } from 'antd'
import { useFetchExchanges } from '../../hooks/useFetchExchanges'
import { useFetchQueues } from '../../hooks/useFetchQueues'
import { RoutingMap } from '../../components/routing/RoutingMap'
import { useFetchBindings } from '../../hooks/useFetchBindings'
import { Box } from '@xstyled/styled-components'

export const RoutingIndex = ({ match }: { match: Match }) => {
  const { exchanges, loading: loadingExchanges } = useFetchExchanges({})
  const { queues, loading: loadingQueues } = useFetchQueues({})
  const { bindings, loading: loadingBindings } = useFetchBindings({})

  const loading = loadingExchanges || loadingQueues || loadingBindings

  return (
    <>
      <PageHeader title="Routing" />
      {loading && (
        <Box
          w="100%"
          h="400px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spin size="large" />
        </Box>
      )}
      {!loading && (
        <RoutingMap
          queues={queues}
          bindings={bindings}
          exchanges={exchanges.filter(
            (exchange) => !exchange.name.startsWith('amq.') && exchange.name !== ''
          )}
        />
      )}
    </>
  )
}
