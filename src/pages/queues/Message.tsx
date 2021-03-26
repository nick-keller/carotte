import React, { FC } from 'react'
import { PageHeader, Space, Card, Button, Form, Select, InputNumber, Radio, Switch } from 'antd'
import { Box } from '@xstyled/styled-components'
import { Link, match as Match, Route, useHistory } from 'react-router-dom'
import { DeleteOutlined, PlusOutlined, SyncOutlined, SearchOutlined } from '@ant-design/icons'
import { useFetch } from 'use-http'
import ReactJson from 'react-json-view'

type RabbitMessage = {
  exchange: string
  message_count: number
  payload: string
  payload_bytes: number
  payload_encoding: string
  properties: Record<string, any>
  redelivered: boolean
  routing_key: string

}

export const Message: FC<{ message: RabbitMessage }> = ({ message }) => {
  let json: any = undefined

  try {
    json = JSON.parse(message.payload)
  } catch (error) {
    // Do nothing
  }

  return (
    <Card>
      {json === undefined && <pre>{message.payload}</pre>}
      {json !== undefined && <ReactJson src={json} name={false} />}
    </Card>
  )
}
