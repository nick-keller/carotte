import React, { FC, useContext, useState } from 'react'
import { Alert, Button, Form, Input, Modal } from 'antd'
import {
  Connection,
  CredentialsContext,
} from '../../providers/CredentialsProvider'
import {
  checkConnection,
  ConnectionStatus,
  connectionStatusText,
} from './checkConnection'
import parseUrl from 'url-parse'

export const NewConnectionButton: FC = () => {
  const { setConnections } = useContext(CredentialsContext)
  const [form] = Form.useForm<Connection>()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<ConnectionStatus | null>(null)

  const close = () => {
    form.resetFields()
    setVisible(false)
    setLoading(false)
    setStatus(null)
  }

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        New connection
      </Button>
      <Modal
        visible={visible}
        title="New connection"
        okText="Create"
        confirmLoading={loading}
        onOk={() => {
          form.validateFields().then(async (values) => {
            const connection: Connection = {
              ...values,
              baseUrl: parseUrl(values.baseUrl).origin,
            }

            setStatus(null)
            setLoading(true)
            const s = await checkConnection(connection)
            setLoading(false)

            if (s === ConnectionStatus.OK) {
              setConnections((c) => [...c, connection])
              close()
            } else {
              setStatus(s)
            }
          })
        }}
        onCancel={close}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: '', baseUrl: '', username: '', password: '' }}
          requiredMark={false}
        >
          {status !== null && (
            <Form.Item>
              <Alert
                showIcon
                type="error"
                message={connectionStatusText(status)}
              />
            </Form.Item>
          )}
          <Form.Item
            name="baseUrl"
            label="Host"
            rules={[
              { required: true, message: 'Required' },
              {
                pattern: /^https?:\/\//i,
                message: 'Must start with http:// or https://',
                validateTrigger: 'onBlur',
              },
            ]}
          >
            <Input placeholder="http://localhost:15672" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Username">
            <Input placeholder="guest" />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input.Password placeholder="guest" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
