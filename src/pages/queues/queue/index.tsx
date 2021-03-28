import React, { FC } from 'react'
import { Menu, PageHeader } from 'antd'
import { match as Match, Route, Switch, useHistory } from 'react-router-dom'
import { Get } from './Get'
import { MoveQueuesButton } from '../../../actions/MoveQueuesButton'
import { Overview } from './Overview'
import { Publish } from './Publish'
import { PurgeQueuesButton } from '../../../actions/PurgeQueuesButton'
import { DeleteQueuesButton } from '../../../actions/DeleteQueuesButton'
import { Forecast } from './Forecast'

export const Queue: FC<{
  match: Match<{ vhost: string; queueName: string }>
}> = ({ match }) => {
  const history = useHistory()
  const { vhost, queueName } = match.params

  return (
    <>
      <PageHeader
        title={queueName}
        onBack={() => history.push('/queues')}
        extra={[
          <MoveQueuesButton vhost={vhost} queues={[queueName]} key="move" />,
          <PurgeQueuesButton vhost={vhost} queues={[queueName]} key="purge" />,
          <DeleteQueuesButton
            vhost={vhost}
            queues={[queueName]}
            key="delete"
            onDone={() => history.push('/queues')}
          />,
        ]}
      />

      <Menu mode="horizontal" onClick={(e) => history.push(String(e.key))}>
        <Menu.Item key={match.url}>Overview</Menu.Item>
        <Menu.Item key={match.url + '/forecast'}>Forecast</Menu.Item>
        <Menu.Item key={match.url + '/publish'}>Publish</Menu.Item>
        <Menu.Item key={match.url + '/get'}>Consume</Menu.Item>
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
