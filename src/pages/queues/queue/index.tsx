import React, { FC } from 'react'
import { Menu, message, PageHeader } from 'antd'
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
import { QueueTag } from '../../../components/QueueTag'

export const Queue: FC<{
  match: Match<{ vhost: string; queueName: string }>
}> = ({ match }) => {
  const history = useHistory()
  const { vhost, queueName } = match.params
  const activeRoute = useActiveChildRoute()
  const { data } = useFetchQueue({
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
        title={decodeURIComponent(queueName)}
        onBack={() => history.push('/queues')}
        style={{ marginRight: '30px' }}
        tags={[
          <QueueTag name="Durable" key="d" abbr="D" value={data?.durable} />,
          <QueueTag
            name="Message TTL"
            key="ttl"
            abbr="TTL"
            value={data?.arguments['x-message-ttl']}
          />,
          <QueueTag
            name="Dead letter exchange"
            key="dlx"
            abbr="DLX"
            value={data?.arguments['x-dead-letter-exchange']}
          />,
          <QueueTag
            name="Dead letter rounting key"
            key="dlk"
            abbr="DLK"
            value={data?.arguments['x-dead-letter-routing-key']}
          />,
          <QueueTag
            name="Auto Delete"
            key="ad"
            abbr="AD"
            value={data?.auto_delete}
          />,
          <QueueTag
            name="Exclusive"
            key="e"
            abbr="E"
            value={data?.exclusive}
          />,
          <QueueTag
            name="Single active consumer"
            key="sac"
            abbr="SAC"
            value={data?.arguments['x-single-active-consumer']}
          />,
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
        <Menu.Item key="/">Overview</Menu.Item>
        <Menu.Item key="/forecast">Forecast</Menu.Item>
        <Menu.Item key="/publish">Publish</Menu.Item>
        <Menu.Item key="/get">Consume</Menu.Item>
      </Menu>
      <Switch>
        <Route path={match.path + '/forecast'} component={Forecast} />
        <Route path={match.path + '/publish'} component={Publish} />
        <Route path={match.path + '/get'} component={Get} />
        <Route path={match.path} exact component={Overview} />
      </Switch>
    </>
  )
}
