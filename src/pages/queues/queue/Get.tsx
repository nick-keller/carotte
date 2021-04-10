import React, { FC } from 'react'
import { Button, Divider, Form, InputNumber, Radio, Space, Switch } from 'antd'
import { Box } from '@xstyled/styled-components'
import { match as Match } from 'react-router-dom'
import { CachePolicies, useFetch } from 'use-http'
import { Message } from '../../../components/Message'
import { RabbitMessage } from '../../../types'
import { VerticalAlignBottomOutlined } from '@ant-design/icons'

export const Get: FC<{
  match: Match<{ vhost: string; queueName: string }>
}> = ({ match }) => {
  const { vhost, queueName } = match.params

  const { data, loading, post } = useFetch<RabbitMessage[]>(
    `/queues/${vhost}/${queueName}/get`,
    { data: [], cachePolicy: CachePolicies.NO_CACHE, persist: false }
  )

  if (!data) {
    return null
  }

  return (
    <Box m={20}>
      <Form
        initialValues={{ ack: true, requeue: true, count: 1 }}
        labelCol={{ span: 4 }}
        onFinish={(values) => {
          post({
            ackmode: `${values.ack ? 'ack' : 'reject'}_requeue_${
              values.requeue ? 'true' : 'false'
            }`,
            count: values.count,
            encoding: 'auto',
            name: decodeURIComponent(queueName),
            truncate: 50000,
            vhost: decodeURIComponent(vhost),
          })
        }}
      >
        <Form.Item label="Mode" name="ack">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={true}>Ack</Radio.Button>
            <Radio.Button value={false}>Reject</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Requeue"
          name="requeue"
          valuePropName="checked"
          tooltip={
            <>
              If requeue is set the message will be put back into the queue in
              place, but <code>redelivered</code> will be set on the message.
              <br />
              If requeue is not set messages will be removed from the queue.
            </>
          }
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>
        <Form.Item label="Messages" name="count">
          <InputNumber min={1} precision={0} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<VerticalAlignBottomOutlined />}
          >
            Get
          </Button>
        </Form.Item>
      </Form>

      <Divider orientation="left" plain>
        {data.length} messages
      </Divider>

      <Space direction="vertical" style={{ width: '100%' }}>
        {data.map((message) => (
          <Message message={message} />
        ))}
      </Space>
    </Box>
  )
}
