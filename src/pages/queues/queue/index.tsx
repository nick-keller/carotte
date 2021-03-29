import React, { FC } from 'react'
import { Menu, PageHeader, message } from 'antd'
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

export const Queue: FC<{
  match: Match<{ vhost: string; queueName: string }>
}> = ({ match }) => {
  const history = useHistory()
  const { vhost, queueName } = match.params
  const activeRoute = useActiveChildRoute()
  useFetchQueue({
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
        onClick={(e) => history.push(match.url + String(e.key))}
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
