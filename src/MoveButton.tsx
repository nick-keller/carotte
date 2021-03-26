import React, { FC, useState } from 'react'
import { Button, Form, message, Modal, Select } from 'antd'
import { CachePolicies, useFetch } from 'use-http'
import { SwapRightOutlined } from '@ant-design/icons'
import { useMove } from './hooks/useMove'

export const MoveButton: FC<{ vhost: string, queues: string[] }> = ({ vhost, queues }) => {
  const [moveModal, setMoveModal] = useState(false)
  const [destinationQueue, setDestinationQueue ] = useState('')
  const { data, loading, get } = useFetch('/queues', { data: [], cachePolicy: CachePolicies.CACHE_FIRST })
  const { move, moving } = useMove({ vhost, queues })

  return (
    <>
    <Button type="primary" icon={<SwapRightOutlined/>} key="move" onClick={() => {
      setMoveModal(true)
      get()
    }}>
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
              options={data.map(({name}: any) => ({label: name, value: name}))}
              showSearch
              loading={loading}
              style={{width: '100%'}}
            />
          </Form.Item>
        </Form>
      </Modal>
      </>
  )
}
