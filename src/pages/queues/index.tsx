import React from 'react'
import { match as Match, Route, Switch } from 'react-router-dom'
import { Queues } from './Queues'
import { Queue } from './queue'

export const QueuesIndex = ({ match }: { match: Match }) => {
  return (
    <Switch>
      <Route path={match.path + '/:vhost/:queueName'} component={Queue} />
      <Route path={match.path} component={Queues} />
    </Switch>
  )
}
