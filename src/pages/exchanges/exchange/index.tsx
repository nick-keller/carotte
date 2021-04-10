import React, { FC } from 'react'
import { Menu, message, PageHeader } from 'antd'
import { match as Match, Route, Switch, useHistory } from 'react-router-dom'
import { OptTag } from '../../../components/OptTag'
import { RabbitExchange } from '../../../types'
import { useFetchExchange } from '../../../hooks/useFetchExchange'
import { SwapOutlined, ToTopOutlined } from '@ant-design/icons'
import { useActiveChildRoute } from '../../../hooks/useActiveChildRoute'
import { Routing } from './Routing'
import { ExchangeTypeTag } from '../../../components/ExchangeTypeTag'
import { Publish } from './Publish'

export const exchangeTags = (exchange?: RabbitExchange) => [
  <OptTag name="Durable" key="d" abbr="D" value={exchange?.durable} />,
  <OptTag
    name="Auto Delete"
    key="ad"
    abbr="AD"
    value={exchange?.auto_delete}
  />,
  <OptTag name="Internal" key="i" abbr="I" value={exchange?.internal} />,
]

export const Exchange: FC<{
  match: Match<{ vhost: string; exchangeName: string }>
}> = ({ match }) => {
  const history = useHistory()
  const { vhost, exchangeName } = match.params
  const activeRoute = useActiveChildRoute()
  const { exchange } = useFetchExchange({
    vhost,
    exchangeName,
    live: true,
    onNotFound: () => {
      history.push('/exchanges')
      message.error(
        `Exchange ${decodeURIComponent(exchangeName)} does not exist`
      )
    },
  })

  return (
    <>
      <PageHeader
        title={decodeURIComponent(exchangeName)}
        onBack={() => history.push('/exchanges')}
        style={{ marginRight: '30px' }}
        tags={[
          <ExchangeTypeTag type={exchange?.type} key="type" />,
          ...exchangeTags(exchange),
        ]}
      />

      <Menu
        mode="horizontal"
        onClick={(e) =>
          history.push(e.key === '/' ? match.url : match.url + String(e.key))
        }
        selectedKeys={[activeRoute]}
      >
        <Menu.Item key="/" icon={<SwapOutlined />}>
          Routing
        </Menu.Item>
        <Menu.Item key="/publish" icon={<ToTopOutlined />}>
          Publish
        </Menu.Item>
      </Menu>

      <Switch>
        <Route path={match.path + '/publish'} component={Publish} />
        <Route path={match.path} exact component={Routing} />
      </Switch>
    </>
  )
}
