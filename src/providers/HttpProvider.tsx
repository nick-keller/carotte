import React, { FC, useContext } from 'react'
import { CachePolicies, Provider } from 'use-http'
import { CredentialsContext } from './CredentialsProvider'

export const HttpProvider: FC = ({ children }) => {
  const { baseUrl, username, password } = useContext(CredentialsContext)

  return (
    <Provider
      url={baseUrl + '/api'}
      options={{
        cachePolicy: CachePolicies.CACHE_AND_NETWORK,
        cacheLife: 3600000,
        persist: true,
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      }}
    >
      {children}
    </Provider>
  )
}
