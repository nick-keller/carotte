import React, { FC } from 'react'
import { Button, Menu, PageHeader } from 'antd'
import { match as Match, Route, Switch, useHistory } from 'react-router-dom'
import { DeleteOutlined, SyncOutlined } from '@ant-design/icons'
import { Get } from './Get'
import { MoveButton } from '../../actions/MoveButton'
import { Overview } from './Overview'
import { Publish } from './Publish'
import { PurgeButton } from '../../actions/PurgeButton'
import { DeleteButton } from '../../actions/DeleteButton'

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
          <MoveButton vhost={vhost} queues={[queueName]} key="move" />,
          <PurgeButton vhost={vhost} queues={[queueName]} key="purge" />,
          <DeleteButton
            vhost={vhost}
            queues={[queueName]}
            key="delete"
            onDone={() => history.push('/queues')}
          />,
        ]}
      />

      <Menu mode="horizontal" onClick={(e) => history.push(String(e.key))}>
        <Menu.Item key={match.url}>Overview</Menu.Item>
        <Menu.Item key={match.url + '/publish'}>Publish</Menu.Item>
        <Menu.Item key={match.url + '/get'}>Consume</Menu.Item>
      </Menu>
      <Switch>
        <Route path={match.path + '/publish'} component={Publish} />
        <Route path={match.path + '/get'} component={Get} />
        <Route path={match.path} exact component={Overview} />
      </Switch>
    </>
  )
}
