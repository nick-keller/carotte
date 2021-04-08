import React from 'react'
import { match as Match, Route, Switch } from 'react-router-dom'
import { Exchanges } from './Exchanges'
import { Exchange } from './exchange'

export const ExchangesIndex = ({ match }: { match: Match }) => {
  return (
    <Switch>
      <Route path={match.path + '/:vhost/:exchangeName'} component={Exchange} />
      <Route path={match.path} component={Exchanges} />
    </Switch>
  )
}
