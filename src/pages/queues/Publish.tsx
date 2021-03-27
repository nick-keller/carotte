import React, { FC } from 'react'
import { Button, Space, Select, message } from 'antd'
import { Box } from '@xstyled/styled-components'
import { match as Match } from 'react-router-dom'
import AceEditor from 'react-ace'
import useLocalStorage from 'use-local-storage'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-plain_text'
import 'ace-builds/src-noconflict/theme-monokai'
import { CachePolicies, useFetch } from 'use-http'
import { ToTopOutlined } from '@ant-design/icons'

export const Publish: FC<{
  match: Match<{ vhost: string; queueName: string }>
}> = ({ match }) => {
  const { vhost, queueName } = match.params

  const [ publishMessage, setPublishMessage] = useLocalStorage(`publish_${queueName}`, '')
  const [ mode, setMode] = useLocalStorage(`publishMode`, 'json')

  const { response, post, loading } = useFetch(`/exchanges/${vhost}/amq.default/publish`, { cachePolicy: CachePolicies.NO_CACHE, persist: false })

  const publish = async () => {
    await post({
      delivery_mode: "1",
      headers: {},
      name: "amq.default",
      payload: publishMessage,
      payload_encoding: "string",
      properties: {delivery_mode: 1, headers: {}},
      props: {},
      routing_key: queueName,
      vhost,
    })

    if (response.ok) {
      message.success('Published message')
    } else {
      message.success('Could not publish message')
    }
  }

  return (
    <Box m={20}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Select
          value={mode}
          onChange={setMode}
          options={[
            { label: 'JSON', value: 'json' },
            { label: 'Plain text', value: 'plain_text' },
          ]}
          style={{ width: '200px' }}
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
          }}/>
        <Button type="primary" onClick={publish} loading={loading} icon={<ToTopOutlined />}>
          Publish
        </Button>
      </Space>
    </Box>
  )
}
