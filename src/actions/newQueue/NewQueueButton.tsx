import React, { FC, useState } from 'react'
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Switch,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { NewQueueParams, useNewQueue } from './useNewQueue'
import { InputMs } from '../../components/InputMs'
import { InputBytes } from '../../components/InputBytes'
import { useHistory } from 'react-router-dom'
import { CachePolicies, useFetch } from 'use-http'

export const NewQueueButton: FC = () => {
  const [form] = Form.useForm<NewQueueParams>()
  const [visible, setVisible] = useState(false)
  const [values, setValues] = useState<NewQueueParams | undefined>()
  const { create, creating } = useNewQueue()
  const history = useHistory()
  const { data } = useFetch<{ name: string }[]>(
    '/vhosts',
    {
      cachePolicy: CachePolicies.NO_CACHE,
      persist: false,
      data: [],
    },
    []
  )

  const close = () => {
    form.resetFields()
    setVisible(false)
  }

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setVisible(true)}
      >
        New
      </Button>
      <Modal
        visible={visible}
        title="New queue"
        okText="Create"
        confirmLoading={creating}
        onOk={() => {
          form.validateFields().then(async (values) => {
            values.vhost = values.vhost || data?.[0]?.name || ''

            try {
              await create(values)
              message.success(`Queue ${values.name} created!`)
              history.push(
                `/queues/${encodeURIComponent(
                  values.vhost
                )}/${encodeURIComponent(values.name)}`
              )
              close()
            } catch (error) {
              message.error(error.message)
            }
          })
        }}
        onCancel={close}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={
            {
              vhost: data?.[0]?.name ?? '',
              name: '',
              autoDelete: false,
              durable: true,
              ttl: null,
              messagesTtl: null,
              singleActiveConsumer: false,
              lazy: false,
              type: 'classic',
              maxLength: null,
              maxLengthBytes: null,
              overflow: 'drop-head',
            } as NewQueueParams
          }
          onValuesChange={(_, v) => {
            setValues(v)
          }}
          requiredMark="optional"
        >
          <Form.Item
            name="type"
            label="Type"
            required
            tooltip={
              <>
                Quorum queues are durable, replicated FIFO queues where data
                safety is a top priority.{' '}
                <a href="https://www.rabbitmq.com/quorum-queues.html">
                  More info
                </a>
              </>
            }
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="classic">Classic</Radio.Button>
              <Radio.Button value="quorum">Quorum</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {(data?.length ?? 0) > 1 && (
            <Form.Item name="vhost" label="V-Host" required>
              <Select
                options={data?.map(({ name }) => ({
                  label: name,
                  value: name,
                }))}
              />
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input />
          </Form.Item>
          <Divider>Options</Divider>
          <Form.Item className="switch-group" required>
            <Form.Item
              name="durable"
              valuePropName="checked"
              label="Durable"
              required
              tooltip={
                <>
                  Durable queues will be recovered on node boot, including
                  messages in them.{' '}
                  <a href="https://www.rabbitmq.com/queues.html#durability">
                    More info
                  </a>
                </>
              }
            >
              <Switch disabled={values?.type === 'quorum'} />
            </Form.Item>
            <Form.Item
              name="autoDelete"
              valuePropName="checked"
              label="Auto delete"
              required
              tooltip={
                <>
                  Queue that has had at least one consumer is deleted when last
                  consumer unsubscribes.
                </>
              }
            >
              <Switch disabled={values?.type === 'quorum'} />
            </Form.Item>
            <Form.Item
              name="singleActiveConsumer"
              valuePropName="checked"
              label="Single active consumer"
              required
              tooltip={
                <>
                  Only one consumer at a time is consuming the queue and it
                  fails over to another registered consumer in case the active
                  one is cancelled or dies.{' '}
                  <a href="https://www.rabbitmq.com/consumers.html#single-active-consumer">
                    More info
                  </a>
                </>
              }
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="lazy"
              valuePropName="checked"
              label="Lazy"
              required
              tooltip={
                <>
                  Lazy queues move their contents to disk as early as
                  practically possible, and only load them in RAM when requested
                  by consumers.{' '}
                  <a href="https://www.rabbitmq.com/lazy-queues.html">
                    More info
                  </a>
                </>
              }
            >
              <Switch disabled={values?.type === 'quorum'} />
            </Form.Item>
          </Form.Item>
          <Divider>Time-to-live</Divider>
          <Form.Item
            name="ttl"
            label="Queue TTL"
            tooltip={
              <>
                Queues will expire after a period of time only when they are not
                used (e.g. do not have consumers).{' '}
                <a href="https://www.rabbitmq.com/ttl.html#queue-ttl">
                  More info
                </a>
              </>
            }
          >
            <InputMs min={1} disabled={values?.type === 'quorum'} />
          </Form.Item>
          <Form.Item
            name="messagesTtl"
            label="Messages TTL"
            tooltip={
              <>
                Messages added to the queue will live in the queue for N second
                or until it is delivered to a consumer.{' '}
                <a href="https://www.rabbitmq.com/ttl.html#per-queue-message-ttl">
                  More info
                </a>
              </>
            }
          >
            <InputMs disabled={values?.type === 'quorum'} />
          </Form.Item>
          <Divider>Length limit</Divider>
          <Form.Item
            name="maxLength"
            label="Max messages length"
            tooltip={
              <>
                Maximum number of messages in the queue.{' '}
                <a href="https://www.rabbitmq.com/maxlength.html">More info</a>
              </>
            }
          >
            <InputNumber min={0} precision={0} style={{ width: '150px' }} />
          </Form.Item>
          <Form.Item
            name="maxLengthBytes"
            label="Max bytes size"
            tooltip={
              <>
                Maximum size of the queue.{' '}
                <a href="https://www.rabbitmq.com/maxlength.html">More info</a>
              </>
            }
          >
            <InputBytes />
          </Form.Item>
          <Form.Item
            name="overflow"
            label="Overflow behaviour"
            required
            tooltip={
              <>
                Quorum queues are durable, replicated FIFO queues where data
                safety is a top priority.{' '}
                <a href="https://www.rabbitmq.com/maxlength.html#default-behaviour">
                  More info
                </a>
              </>
            }
          >
            <Radio.Group
              buttonStyle="solid"
              disabled={
                (values?.maxLength === null &&
                  values?.maxLengthBytes === null) ||
                values?.type === 'quorum'
              }
            >
              <Radio.Button value="drop-head">Drop head</Radio.Button>
              <Radio.Button value="reject-publish">Reject publish</Radio.Button>
              <Radio.Button value="reject-publish-dlx">
                Reject publish DLX
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
