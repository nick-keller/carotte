import React, { FC, useContext } from 'react'
import { CredentialsContext } from '../../providers/CredentialsProvider'
import { CachePolicies, useFetch } from 'use-http'
import { Alert, Button, Form, Input, Result } from 'antd'
import { FullPageLoader } from '../../components/FullPageLoader'

export const CheckCredentials: FC = ({ children }) => {
  const { username, setUsername, password, setPassword } = useContext(
    CredentialsContext
  )
  const { loading, error, get } = useFetch(
    '/whoami',
    { cachePolicy: CachePolicies.NO_CACHE, persist: false },
    [username, password]
  )

  if (loading) {
    return <FullPageLoader />
  }

  if (error) {
    return (
      <Result
        status="info"
        title="Login"
        icon={null}
        extra={
          <Form
            initialValues={{
              username,
              password,
            }}
            layout="vertical"
            style={{ maxWidth: '300px', margin: 'auto' }}
            onFinish={(values) => {
              if (
                values.username !== username ||
                values.password !== password
              ) {
                setUsername(values.username)
                setPassword(values.password)
              } else {
                setTimeout(() => get(), 100)
              }
            }}
          >
            {error && username && (
              <Form.Item>
                <Alert
                  message="Incorect username or password"
                  type="error"
                  showIcon
                />
              </Form.Item>
            )}
            <Form.Item label="Username" name="username">
              <Input />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                style={{ width: '100%' }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        }
      />
    )
  }

  return <>{children}</>
}
