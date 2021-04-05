import React, { FC, useContext, useState } from 'react'
import { Alert, Button, Form, Input, Modal } from 'antd'
import {
  Connexion,
  CredentialsContext,
} from '../../providers/CredentialsProvider'
import {
  checkConnexion,
  ConnexionStatus,
  connexionStatusText,
} from './checkConnexion'
import parseUrl from 'url-parse'

export const NewConnexionButton: FC = () => {
  const {
    setConnexions,
  } = useContext(CredentialsContext)
  const [form] = Form.useForm<Connexion>()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<ConnexionStatus | null>(null)

  const close = () => {
    form.resetFields()
    setVisible(false)
    setLoading(false)
    setStatus(null)
  }

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        New connexion
      </Button>
      <Modal
        visible={visible}
        title="New connexion"
        okText="Create"
        confirmLoading={loading}
        onOk={() => {
          form.validateFields().then(async (values) => {
            const connexion: Connexion = {
              ...values,
              baseUrl: parseUrl(values.baseUrl).origin,
            }

            setStatus(null)
            setLoading(true)
            const s = await checkConnexion(connexion)
            setLoading(false)

            if (s === ConnexionStatus.OK) {
              setConnexions((c) => [...c, connexion])
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
                message={connexionStatusText(status)}
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
