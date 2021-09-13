import React, { FC, useMemo, useState } from 'react'
import { Button, Form, message, Modal, Select, Tag } from 'antd'
import { CachePolicies, useFetch } from 'use-http'
import { SwapRightOutlined } from '@ant-design/icons'
import { useMoveQueues } from './useMoveQueues'
import { RabbitQueue } from '../../types'

export const MoveQueuesButton: FC<{ vhost: string; queues: string[] }> = ({
  vhost,
  queues,
}) => {
  const [moveModal, setMoveModal] = useState(false)
  const [destinationQueue, setDestinationQueue] = useState('')
  const { data, loading, get } = useFetch<RabbitQueue[]>('/queues', {
    data: [],
    cachePolicy: CachePolicies.CACHE_FIRST,
  })
  const { move, moving } = useMoveQueues({ vhost, queues })
  const suggestions = useMemo<RabbitQueue[]>(() => {
    if (queues.length !== 1) {
      return []
    }

    const startsWith = queues[0].substr(0, queues[0].length * 0.75)

    return (
      data?.filter(
        ({ name }) =>
          name !== queues[0] &&
          (name.startsWith(startsWith) ||
            queues[0].startsWith(name.substr(0, name.length * 0.75)))
      ) ?? []
    )
  }, [data])

  return (
    <>
      <Button
        type="primary"
        icon={<SwapRightOutlined />}
        key="move"
        onClick={() => {
          setMoveModal(true)
          get()
        }}
      >
        Move
      </Button>

      <Modal
        title="Move messages"
        visible={moveModal}
        onOk={async () => {
          try {
            await move(destinationQueue)
            setMoveModal(false)
            message.success('Moved messages')
          } catch (error) {
            message.error('Could not move messages. ' + error.message)
          }
        }}
        onCancel={() => setMoveModal(false)}
        okText="Move"
        confirmLoading={moving}
      >
        <Form layout="vertical">
          <Form.Item label="Destination queue">
            <Select
              value={destinationQueue}
              onChange={setDestinationQueue}
              options={data?.map(({ name }) => ({
                label: name,
                value: name,
              }))}
              showSearch
              loading={loading}
              style={{ width: '100%' }}
            />
          </Form.Item>
          {suggestions.map((suggestion) => (
            <Tag
              style={{ cursor: 'default' }}
              color={suggestion.name === destinationQueue ? 'blue' : undefined}
              onClick={() => setDestinationQueue(suggestion.name)}
            >
              {suggestion.name}
            </Tag>
          ))}
        </Form>
      </Modal>
    </>
  )
}
