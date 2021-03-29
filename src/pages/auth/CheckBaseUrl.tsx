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
        status={baseUrl ? 'info' : 'success'}
        title={baseUrl ? 'Could not reach host' : 'Setup host'}
        subTitle={
          baseUrl ? (
            <>
              Either the host is not reachable, or it does not accept requests
              from <b>{parseUrl(pathname).host}</b> (CORS).{' '}
              <a href="https://github.com/nick-keller/carotte#cors-issues">
                How to fix?
              </a>
            </>
          ) : (
            <>
              To start using Carotte, setup the host and make sure{' '}
              <a href="https://github.com/nick-keller/carotte#cors-issues">
                CORS is enabled
              </a>
            </>
          )
        }
        extra={
          <Space>
            <Input
              value={newBaseUrl}
              onChange={(e) => setNewBaseUrl(e.target.value)}
              style={{ width: '400px' }}
              size="large"
              placeholder="http://localhost:15672"
            />
            <Button
              type="primary"
              key="retry"
              disabled={!newBaseUrl}
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
              {baseUrl ? 'Retry' : 'Go'}
            </Button>
          </Space>
        }
      />
    )
  }

  return <>{children}</>
}
