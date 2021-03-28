import React, { FC, useContext, useState } from 'react'
import { CredentialsContext } from '../../providers/CredentialsProvider'
import { CachePolicies, useFetch } from 'use-http'
import { Button, Input, Result, Space } from 'antd'
import { useLocation } from 'react-router-dom'
import parseUrl from 'url-parse'
import { FullPageLoader } from '../../components/FullPageLoader'

export const CheckBaseUrl: FC = ({ children }) => {
  const { baseUrl, setBaseUrl } = useContext(CredentialsContext)
  const [newBaseUrl, setNewBaseUrl] = useState(baseUrl)
  const { pathname } = useLocation()
  const { loading, error, get } = useFetch(
    '/auth',
    { cachePolicy: CachePolicies.NO_CACHE, persist: false },
    [baseUrl]
  )

  if (loading) {
    return <FullPageLoader />
  }

  if (error) {
    return (
      <Result
        status="info"
        title="Could not reach host"
        subTitle={`Either the host is not reachable, or it does not accept requests from ${
          parseUrl(pathname).host
        } (CORS). You can use a proxy to bypass this restriction.`}
        extra={
          <Space>
            <Input
              value={newBaseUrl}
              onChange={(e) => setNewBaseUrl(e.target.value)}
              style={{ width: '400px' }}
              size="large"
            />
            <Button
              type="primary"
              key="retry"
              onClick={() => {
                const origin = parseUrl(newBaseUrl).origin

                if (baseUrl !== origin) {
                  setBaseUrl(origin)
                } else {
                  get()
                }
              }}
              size="large"
            >
              Retry
            </Button>
          </Space>
        }
      />
    )
  }

  return <>{children}</>
}
