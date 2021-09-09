import React, { FC } from 'react'
import { Button, message, Modal } from 'antd'
import { ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { usePurgeQueues } from './usePurgeQueues'

const { confirm } = Modal

export const PurgeQueuesButton: FC<{ vhost: string; queues: string[] }> = ({
  vhost,
  queues,
}) => {
  const { purge } = usePurgeQueues({ vhost, queues })

  return (
    <Button
      type="primary"
      danger
      icon={<SyncOutlined />}
      onClick={() => {
        confirm({
          title: `Purge queues?`,
          icon: <ExclamationCircleOutlined />,
          content: queues.length === 1 ? <>You are about tu purge queue <b>{queues[0]}</b>.</> : <>You are about tu purge {queues.length} queues:<ul>{queues.map((queue, i) => <li key={i}>{queue}</li>)}</ul></>,
          onOk: async () => {
            try {
              await purge()
              message.success('Purged queues')
            } catch (error) {
              message.error('Could not purge queues. ' + error.message)
            }
          },
          okText: 'Purge',
          okType: 'danger',
        })
      }}
    >
      Purge
    </Button>
  )
}
