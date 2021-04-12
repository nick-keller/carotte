import React, { FC } from 'react'
import { Button, message, Popconfirm, } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useUnBind } from './useUnBind'
import { RabbitBinding } from '../../types'

export const UnBindButton: FC<{ binding: RabbitBinding }> = ({ binding }) => {
  const {unBind, unBinding } = useUnBind()

  return (
    <Popconfirm
      title="Delete binding?"
      onConfirm={async () => {
        try {
          await unBind(binding)
          message.success('Binding deleted!')
        } catch (error) {
          message.error(`Could not delete binding. ${error.message}`)
        }
      }}
      okText="Delete"
      okType="danger"
      okButtonProps={{ loading: unBinding }}
    >
      <Button
        loading={unBinding}
        icon={<DeleteOutlined />}
        shape="circle"
        danger
        size="small"
      />
    </Popconfirm>
  )
}
