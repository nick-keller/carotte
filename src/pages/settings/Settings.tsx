import React, { FC, useContext } from 'react'
import { Card, Form, Input } from 'antd'
import { CredentialsContext } from '../../CredentialsProvider'

export const Settings: FC = () => {
  const { uri, setUri, username, setUsername, password, setPassword } = useContext(CredentialsContext)
  return (
    <Card style={{ maxWidth: '600px', margin: 'auto' }} title="Settings">
      <Form layout="horizontal" labelCol={{ span: 4 }}>
        <Form.Item label="URI">
          <Input value={uri} onChange={(e) => setUri(e.target.value)} />
        </Form.Item>
        <Form.Item label="Username">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Item>
        <Form.Item label="Password">
          <Input value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
      </Form>
    </Card>
  )
}
