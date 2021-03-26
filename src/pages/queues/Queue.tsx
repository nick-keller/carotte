import React from 'react'
import { Button, Menu, PageHeader } from 'antd'
import { match as Match, Route, Switch, useHistory } from 'react-router-dom'
import { DeleteOutlined, SyncOutlined } from '@ant-design/icons'
import { Get } from './Get'
import { MoveButton } from '../../MoveButton'

export const Queue = ({ match }: { match: Match<{ vhost: string, queueName: string }> }) => {
  const history = useHistory()
  const { vhost, queueName } = match.params

  return (
    <>
      <PageHeader
        title={queueName}
        onBack={() => history.push('/queues')}
        extra={[
          <MoveButton vhost={vhost} queues={[queueName]} />,
          <Button type="primary" danger icon={<SyncOutlined/>} key="purge">
            Purge
          </Button>,
          <Button type="primary" danger icon={<DeleteOutlined/>} key="delete">
            Delete
          </Button>
        ]}
      />

          <Menu mode="horizontal" onClick={(e) => history.push(String(e.key))}>
          <Menu.Item key={match.url}>
          Overview
          </Menu.Item>
          <Menu.Item key={match.url + '/publish'}>
          Publish
          </Menu.Item>
          <Menu.Item key={match.url + '/get'}>
          Consume
          </Menu.Item>
          </Menu>
          <Switch>
          <Route path={match.path + '/get'} component={Get} />
          </Switch>
          </>
          )
          }
