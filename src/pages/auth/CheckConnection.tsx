import React, { FC, useContext, useEffect, useState } from 'react'
import { CredentialsContext } from '../../providers/CredentialsProvider'
import { Button, List, Result, Space } from 'antd'
import { FullPageLoader } from '../../components/FullPageLoader'
import {
  checkConnection,
  ConnectionStatus,
  connectionStatusText,
} from '../../actions/newConnection/checkConnection'
import { NewConnectionButton } from '../../actions/newConnection/NewConnectionButton'
import { ArrowRightOutlined } from '@ant-design/icons'

export const CheckConnection: FC = ({ children }) => {
  const {
    selectConnection,
    setSelectConnection,
    connections,
    baseUrl,
    setBaseUrl,
    username,
    setUsername,
    password,
    setPassword,
  } = useContext(CredentialsContext)
  const [status, setStatus] = useState(ConnectionStatus.LOADING)
  const [retryCounter, setRetryCounter] = useState(0)

  useEffect(() => {
    setStatus(ConnectionStatus.LOADING)
    checkConnection({ baseUrl, username, password }).then((s) => {
      setStatus(s)
    })
  }, [baseUrl, username, password, retryCounter])

  if (status === ConnectionStatus.LOADING) {
    return <FullPageLoader />
  }

  if (status !== ConnectionStatus.OK || selectConnection) {
    const error = status !== ConnectionStatus.NO_BASE_URL

    return (
      <>
        <Result
          status={error ? 'warning' : 'success'}
          title={error ? 'Connection error' : 'Select connection'}
          subTitle={
            error ? (
              connectionStatusText(status)
            ) : (
              <>
                To start using Carotte,{' '}
                {connections.length ? 'select' : 'create'} a connection and make
                sure{' '}
                <a href="https://github.com/nick-keller/carotte#cors-issues">
                  CORS is enabled
                </a>
              </>
            )
          }
        />
        <Space
          direction="vertical"
          align="center"
          style={{ margin: 'auto', display: 'flex', alignItems: 'stretch', maxWidth: '400px' }}
          size="large"
        >
          <List
            dataSource={connections}
            size="large"
            style={{ width: '100%' }}
            renderItem={(connection) => (
              <List.Item
                actions={[
                  error && connection.baseUrl === baseUrl ? (
                    <Button
                      shape="round"
                      onClick={() => {
                        setSelectConnection(false)
                        setRetryCounter((c) => c + 1)
                      }}
                    >
                      Retry
                    </Button>
                  ) : (
                    <Button
                      shape={'circle'}
                      icon={<ArrowRightOutlined />}
                      onClick={() => {
                        setBaseUrl(connection.baseUrl)
                        setUsername(connection.username)
                        setPassword(connection.password)
                        setSelectConnection(false)
                      }}
                    />
                  ),
                ]}
              >
                <List.Item.Meta
                  title={connection.name}
                  description={`${connection.baseUrl} • ${connection.username}`}
                />
              </List.Item>
            )}
          />
          <NewConnectionButton />
        </Space>
      </>
    )
  }

  return <>{children}</>
}
