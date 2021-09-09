import React, { FC } from 'react'
import { Button, message, Modal } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useDeleteQueues } from './useDeleteQueues'

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
          content: queues.length === 1 ? <>You are about tu delete queue <b>{queues[0]}</b>.</> : <>You are about tu delete {queues.length} queues:<ul>{queues.map((queue, i) => <li key={i}>{queue}</li>)}</ul></>,
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
