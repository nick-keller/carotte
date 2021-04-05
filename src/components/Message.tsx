import React, { FC } from 'react'
import { Card } from 'antd'
import ReactJson from 'react-json-view'
import { RabbitMessage } from '../types'

export const Message: FC<{ message: RabbitMessage }> = ({ message }) => {
  let json: any = undefined

  try {
    json = JSON.parse(message.payload)

    if (typeof json !== 'object' || json === null) {
      json = undefined
    }
  } catch (error) {
    // Do nothing
  }

  return (
    <Card>
      {json === undefined && <pre style={{ margin: 0 }}>{message.payload}</pre>}
      {json !== undefined && <ReactJson src={json} name={false} />}
    </Card>
  )
}
