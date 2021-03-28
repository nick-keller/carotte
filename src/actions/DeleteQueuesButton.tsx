import React, { FC } from 'react'
import { Button, message, Modal } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useDeleteQueues } from '../hooks/useDeleteQueues'

const { confirm } = Modal

export const DeleteQueuesButton: FC<{
  vhost: string
  queues: string[]
  onDone?: () => void
}> = ({ vhost, queues, onDone = () => null }) => {
  const { del } = useDeleteQueues({ vhost, queues })

  return (
    <Button
      type="primary"
      danger
      icon={<DeleteOutlined />}
      onClick={() => {
        confirm({
          title: `Delete queues?`,
          icon: <ExclamationCircleOutlined />,
          content: `You are about tu delete ${queues.length} queues`,
          onOk: async () => {
            try {
              await del()
              message.success('Deleted queues')
              onDone()
            } catch (error) {
              message.error('Could not delete queues. ' + error.message)
            }
          },
          okText: 'Delete',
          okType: 'danger',
        })
      }}
    >
      Delete
    </Button>
  )
}
