import React, { FC } from 'react'
import { Menu, message, PageHeader, Typography } from 'antd'
import { match as Match, Route, Switch, useHistory } from 'react-router-dom'
import { Get } from './Get'
import { MoveQueuesButton } from '../../../actions/moveQueues/MoveQueuesButton'
import { Overview } from './Overview'
import { Publish } from './Publish'
import { PurgeQueuesButton } from '../../../actions/purgeQueues/PurgeQueuesButton'
import { DeleteQueuesButton } from '../../../actions/deleteQueues/DeleteQueuesButton'
import { Forecast } from './Forecast'
import { useActiveChildRoute } from '../../../hooks/useActiveChildRoute'
import { useFetchQueue } from '../../../hooks/useFetchQueue'
import { OptTag } from '../../../components/OptTag'
import {
  DashboardOutlined,
  StockOutlined,
  SwapOutlined,
  ToTopOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons'
import { RabbitQueue } from '../../../types'
import { QueueTypeTag } from '../../../components/QueueTypeTag'
import { Routing } from './Routing'

export const queueTags = (queue?: RabbitQueue) => [
  <OptTag name="Durable" key="d" abbr="D" value={queue?.durable} />,
  <OptTag name="Auto Delete" key="ad" abbr="AD" value={queue?.auto_delete} />,
  <OptTag name="Exclusive" key="e" abbr="E" value={queue?.exclusive} />,
  <OptTag
    name="Single active consumer"
    key="sac"
    abbr="SAC"
    value={queue?.arguments['x-single-active-consumer']}
  />,
  <OptTag
    name="Lazy"
    key="lazy"
    abbr="L"
    value={queue?.arguments['x-queue-mode'] === 'lazy'}
  />,
]

export const Queue: FC<{
  match: Match<{ vhost: string; queueName: string }>
}> = ({ match }) => {
  const history = useHistory()
  const { vhost, queueName } = match.params
  const activeRoute = useActiveChildRoute()
  const { queue } = useFetchQueue({
    vhost,
    queueName,
    onNotFound: () => {
      history.push('/queues')
      message.error(`Queue ${decodeURIComponent(queueName)} does not exist`)
    },
  })

  return (
    <>
      <PageHeader
        title={<Typography.Text copyable>{decodeURIComponent(queueName)}</Typography.Text>}
        onBack={() => history.push('/queues')}
        style={{ marginRight: '30px' }}
        tags={[
          <QueueTypeTag type={queue?.type} key="type" />,
          ...queueTags(queue),
        ]}
        extra={[
          <MoveQueuesButton
            vhost={decodeURIComponent(vhost)}
            queues={[decodeURIComponent(queueName)]}
            key="move"
          />,
          <PurgeQueuesButton
            vhost={decodeURIComponent(vhost)}
            queues={[decodeURIComponent(queueName)]}
            key="purge"
          />,
          <DeleteQueuesButton
            vhost={decodeURIComponent(vhost)}
            queues={[decodeURIComponent(queueName)]}
            key="delete"
            onDone={() => history.push('/queues')}
          />,
        ]}
      />

      <Menu
        mode="horizontal"
        onClick={(e) =>
          history.push(e.key === '/' ? match.url : match.url + String(e.key))
        }
        selectedKeys={[activeRoute]}
      >
        <Menu.Item key="/" icon={<DashboardOutlined />}>
          Overview
        </Menu.Item>
        <Menu.Item key="/forecast" icon={<StockOutlined />}>
          Forecast
        </Menu.Item>
        <Menu.Item key="/publish" icon={<ToTopOutlined />}>
          Publish
        </Menu.Item>
        <Menu.Item key="/get" icon={<VerticalAlignBottomOutlined />}>
          Consume
        </Menu.Item>
        <Menu.Item key="/routing" icon={<SwapOutlined />}>
          Routing
        </Menu.Item>
      </Menu>
      <Switch>
        <Route path={match.path + '/forecast'} component={Forecast} />
        <Route path={match.path + '/publish'} component={Publish} />
        <Route path={match.path + '/get'} component={Get} />
        <Route path={match.path + '/routing'} component={Routing} />
        <Route path={match.path} exact component={Overview} />
      </Switch>
    </>
  )
}
