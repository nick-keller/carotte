import React, { useState } from 'react'
import { Table, Typography, Row, Col, Button, Input, Space, PageHeader } from 'antd'
import { Box } from '@xstyled/styled-components'
import { useFetch } from 'use-http'
import { Link, match as Match } from 'react-router-dom'
import { DeleteOutlined, PlusOutlined, SyncOutlined, SearchOutlined } from '@ant-design/icons'
import { formatNumber } from '../../format'
import { MoveButton } from '../../MoveButton'

export const Queues = ({ match }: { match: Match }) => {
  const [ counter, setCounter ] = useState(0)
  const { data, loading, cache } = useFetch('/queues', { data: [], onNewData: (_, newData) => {
      setTimeout(() => setCounter(x => x + 1), 2000)
      return newData
    }}, [counter])

  const [ search, setSearch ] = useState('')
  const [ selected, setSelected ] = useState<any[]>([])

  return (
    <>
      <PageHeader
        title="Queues"
        subTitle={selected.length ? <><b>{formatNumber(selected.length)}</b> selected</> : <><b>{formatNumber(data.length)}</b> queues</>}
        extra={[
          !!selected.length && <MoveButton vhost={data[0].vhost} queues={selected} />,
          !!selected.length && <Button type="primary" icon={<SyncOutlined />} danger>
            Purge
          </Button>,
          !!selected.length && <Button type="primary" icon={<DeleteOutlined />} danger>
            Delete
          </Button>,
          !selected.length && <Input value={search} onChange={(e) => setSearch(e.target.value)} allowClear prefix={<SearchOutlined />} placeholder="Search..." style={{ width: '300px' }} />,
          !selected.length && <Button type="primary" icon={<PlusOutlined />}>New</Button>,
        ]}
      />
      <Table
        size="small"
        loading={loading && !data.length}
        rowKey="name"
        rowSelection={{
          selectedRowKeys: selected,
          onChange: setSelected,
        }}
        dataSource={data.filter(({ name }: { name: string }) => name.includes(search))}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name > b.name ? 1 : -1,
            defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            render: (name, { vhost, }) => <Link to={match.url + `/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`}>{name}</Link>
          },
          {
            title: 'Messages',
            dataIndex: 'messages',
            sorter: (a, b) => a.messages > b.messages ? 1 : -1,
            showSorterTooltip: false,
            render: (value) => <Typography.Text type={!value ? 'secondary' : undefined}>{formatNumber(value)}</Typography.Text>
          },
          {
            title: 'Consumers',
            dataIndex: 'consumers',
            sorter: (a, b) => a.consumers > b.consumers ? 1 : -1,
            showSorterTooltip: false,
            render: (value) => <Typography.Text type={!value ? 'secondary' : undefined}>{formatNumber(value)}</Typography.Text>
          },
        ]}
        pagination={{
          position: ['bottomCenter'],
          defaultPageSize: 20,
          hideOnSinglePage: true,
          showSizeChanger: true,
        }}
      />
    </>
  )
}
