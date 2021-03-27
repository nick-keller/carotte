import React, { FC, useContext } from 'react'
import { Card, Form, Input, PageHeader } from 'antd'
import { CredentialsContext } from '../../providers/CredentialsProvider'
import { Box } from '@xstyled/styled-components'

export const Settings: FC = () => {
  const {
    uri,
    setUri,
    username,
    setUsername,
    password,
    setPassword,
  } = useContext(CredentialsContext)
  return (
    <>
    <PageHeader
      title="Settings"
      />
    <Box mt={20}>
      <Card style={{ maxWidth: '600px', margin: 'auto' }}>
        <Form layout="horizontal" labelCol={{ span: 4 }}>
          <Form.Item label="URI">
            <Input value={uri} onChange={(e) => setUri(e.target.value)} />
          </Form.Item>
          <Form.Item label="Username">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Password">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Card>
    </Box>
      </>
  )
}
