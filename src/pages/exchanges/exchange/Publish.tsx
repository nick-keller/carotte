import React, { FC, useState } from 'react'
import {
  AutoComplete,
  Button,
  Divider,
  Form,
  message,
  Select,
  Space,
} from 'antd'
import { Box } from '@xstyled/styled-components'
import { match as Match } from 'react-router-dom'
import AceEditor from 'react-ace'
import useLocalStorage from 'use-local-storage'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-plain_text'
import 'ace-builds/src-noconflict/theme-monokai'
import { CachePolicies, useFetch } from 'use-http'
import { ToTopOutlined } from '@ant-design/icons'
import { Message } from '../../../components/Message'
import { RabbitMessage } from '../../../types'
import { useFetchExchange } from '../../../hooks/useFetchExchange'

export const Publish: FC<{
  match: Match<{ vhost: string; exchangeName: string }>
}> = ({ match }) => {
  const { vhost, exchangeName } = match.params
  const { data } = useFetchExchange({ vhost, exchangeName })

  const [publishMessage, setPublishMessage] = useLocalStorage(
    `publish_${exchangeName}`,
    ''
  )
  const [routingKey, setRoutingKey] = useLocalStorage(
    `routing_key_${exchangeName}`,
    ''
  )
  const [lastPublished, setLastPublished] = useState<string[]>([])
  const [mode, setMode] = useLocalStorage(`publishMode`, 'json')

  const { response, post, loading } = useFetch(
    `/exchanges/${vhost}/${exchangeName}/publish`,
    {
      cachePolicy: CachePolicies.NO_CACHE,
      persist: false,
    }
  )

  const publish = async () => {
    await post({
      delivery_mode: '2',
      headers: {},
      name: decodeURIComponent(exchangeName),
      payload: publishMessage,
      payload_encoding: 'string',
      properties: { delivery_mode: 2, headers: {} },
      props: {},
      routing_key: routingKey,
      vhost: decodeURIComponent(vhost),
    })

    if (response.ok) {
      setLastPublished((a) => [publishMessage, ...a])
      message.success('Published message')
    } else {
      message.success('Could not publish message')
    }
  }

  return (
    <Box m={20}>
      <Form layout="vertical" onFinish={publish}>
        <Form.Item label="Routing key">
          <AutoComplete
            value={routingKey}
            onChange={setRoutingKey}
            style={{ width: '400px' }}
            options={data?.source
              ?.map(({ routing_key }) => ({ value: routing_key }))
              .filter(
                ({ value }) =>
                  value &&
                  value.toLowerCase().includes(routingKey.toLowerCase())
              )}
          />
        </Form.Item>

        <Form.Item label="Message">
          <Select
            value={mode}
            onChange={setMode}
            options={[
              { label: 'JSON', value: 'json' },
              { label: 'Plain text', value: 'plain_text' },
            ]}
            style={{ width: '200px', marginBottom: '20px' }}
          />
          <AceEditor
            mode={mode}
            theme="monokai"
            name="publish-message-json"
            onChange={setPublishMessage}
            fontSize={14}
            width="100%"
            height="300px"
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            value={publishMessage}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            loading={loading}
            htmlType="submit"
            icon={<ToTopOutlined />}
          >
            Publish
          </Button>
        </Form.Item>
      </Form>

      <Divider orientation="left" plain>
        {lastPublished.length} messages published
      </Divider>

      <Space direction="vertical" style={{ width: '100%' }}>
        {lastPublished.map((message) => (
          <Message message={{ payload: message } as RabbitMessage} />
        ))}
      </Space>
    </Box>
  )
}
