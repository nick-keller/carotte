import React, { FC, useContext, useEffect, useState } from 'react'
import { CredentialsContext } from '../../providers/CredentialsProvider'
import { Button, List, Result, Space } from 'antd'
import { FullPageLoader } from '../../components/FullPageLoader'
import { checkConnexion, ConnexionStatus, connexionStatusText, } from '../../actions/newConnexion/checkConnexion'
import { NewConnexionButton } from '../../actions/newConnexion/NewConnexionButton'
import { ArrowRightOutlined } from '@ant-design/icons'

export const CheckConnexion: FC = ({ children }) => {
  const {
    selectConnexion,
    setSelectConnexion,
    connexions,
    baseUrl,
    setBaseUrl,
    username,
    setUsername,
    password,
    setPassword,
  } = useContext(CredentialsContext)
  const [status, setStatus] = useState(ConnexionStatus.LOADING)
  const [retryCounter, setRetryCounter] = useState(0)

  useEffect(() => {
    setStatus(ConnexionStatus.LOADING)
    checkConnexion({ baseUrl, username, password }).then((s) => {
      setStatus(s)
    })
  }, [baseUrl, username, password, retryCounter])

  if (status === ConnexionStatus.LOADING) {
    return <FullPageLoader />
  }

  if (status !== ConnexionStatus.OK || selectConnexion) {
    const error = status !== ConnexionStatus.NO_BASE_URL

    return (
      <>
        <Result
          status={error ? 'warning' : 'success'}
          title={error ? 'Connexion error' : 'Select connexion'}
          subTitle={
            error ? (
              connexionStatusText(status)
            ) : (
              <>
                To start using Carotte, {connexions.length ? 'select' : 'create'} a connexion and make sure{' '}
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
          style={{ margin: 'auto', display: 'flex' }}
          size="large"
        >
          <List
            dataSource={connexions}
            size="large"
            style={{ width: '400px' }}
            renderItem={(connexion) => (
              <List.Item
                actions={[
                  error && connexion.baseUrl === baseUrl ? (
                    <Button
                      shape="round"
                      onClick={() => {
                        setSelectConnexion(false)
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
                        setBaseUrl(connexion.baseUrl)
                        setUsername(connexion.username)
                        setPassword(connexion.password)
                        setSelectConnexion(false)
                      }}
                    />
                  ),
                ]}
              >
                <List.Item.Meta
                  title={connexion.name}
                  description={`${connexion.baseUrl} • ${connexion.username}`}
                />
              </List.Item>
            )}
          />
          <NewConnexionButton />
        </Space>
      </>
    )
  }

  return <>{children}</>
}
