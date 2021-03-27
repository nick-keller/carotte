import React, { FC } from 'react'
import { Button, message, Modal } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useDeleteQueue } from '../hooks/useDeleteQueue'

const { confirm } = Modal

export const DeleteButton: FC<{
  vhost: string
  queues: string[]
  onDone?: () => void
}> = ({ vhost, queues, onDone = () => null }) => {
  const { del } = useDeleteQueue({ vhost, queues })

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
            } catch (error) {
              message.error('Could not delete queues. ' + error.message)
            }

            onDone()
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
