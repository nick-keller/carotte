import React, { FC, useEffect, useState } from 'react'
import {
  Button,
  Input,
  PageHeader,
  Space,
  Switch,
  Table,
  Typography,
} from 'antd'
import { useFetch } from 'use-http'
import { Link, match as Match } from 'react-router-dom'
import {
  PlusOutlined,
  SearchOutlined,
  StarOutlined,
  StarTwoTone,
} from '@ant-design/icons'
import { formatNumber } from '../../utils/format'
import { MoveButton } from '../../actions/MoveButton'
import { MessageStat, Queue } from '../../types'
import useLocalStorage from 'use-local-storage'
import { PurgeButton } from '../../actions/PurgeButton'
import { DeleteButton } from '../../actions/DeleteButton'

export const Queues: FC<{ match: Match }> = ({ match }) => {
  const { data, loading, get } = useFetch<
    Omit<
      Queue<Pick<MessageStat, 'rate'>>,
      'consumer_details' | 'message_stats'
    >[]
  >('/queues', { data: [] }, [])

  useEffect(() => {
    if (!loading) {
      setTimeout(get, 2000)
    }
  }, [get, loading])

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any[]>([])
  const [starredOnly, setStarredOnly] = useLocalStorage('starredOnly', false)
  const [starredQueues, setStarredQueues] = useLocalStorage<string[]>(
    'starredQueues',
    []
  )

  if (!data) {
    return null
  }

  return (
    <>
      <PageHeader
        title="Queues"
        subTitle={
          selected.length ? (
            <>
              <b>{formatNumber(selected.length)}</b> selected
            </>
          ) : (
            <>
              <b>{formatNumber(data.length)}</b> queues
            </>
          )
        }
        extra={[
          !!selected.length && (
            <MoveButton vhost={data[0].vhost} queues={selected} key="move" />
          ),
          !!selected.length && (
            <PurgeButton vhost={data[0].vhost} queues={selected} key="purge" />
          ),
          !!selected.length && (
            <DeleteButton
              vhost={data[0].vhost}
              queues={selected}
              key="delete"
            />
          ),
          !selected.length && !!starredQueues.length && (
            <>
              <Switch checked={starredOnly} onChange={setStarredOnly} /> Starred
              only
            </>
          ),
          !selected.length && (
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search..."
              style={{ width: '300px' }}
            />
          ),
          !selected.length && (
            <Button type="primary" icon={<PlusOutlined />}>
              New
            </Button>
          ),
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
        dataSource={data.filter(
          ({ name }: { name: string }) =>
            name.includes(search) &&
            (!starredOnly || starredQueues.includes(name))
        )}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => (a.name > b.name ? 1 : -1),
            defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            render: (name, { vhost }) => (
              <Space>
                {starredQueues.includes(name) ? (
                  <StarTwoTone
                    twoToneColor="#ffa940"
                    onClick={() =>
                      setStarredQueues(starredQueues.filter((n) => n !== name))
                    }
                  />
                ) : (
                  <Typography.Text type="secondary">
                    <StarOutlined
                      onClick={() => setStarredQueues([...starredQueues, name])}
                    />
                  </Typography.Text>
                )}

                <Link
                  to={
                    match.url +
                    `/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`
                  }
                >
                  {name}
                </Link>
              </Space>
            ),
          },
          {
            title: 'Messages',
            dataIndex: 'messages',
            sorter: (a, b) => (a.messages > b.messages ? 1 : -1),
            showSorterTooltip: false,
            render: (value) => (
              <Typography.Text type={!value ? 'secondary' : undefined}>
                {formatNumber(value)}
              </Typography.Text>
            ),
          },
          {
            title: 'Consumers',
            dataIndex: 'consumers',
            sorter: (a, b) => (a.consumers > b.consumers ? 1 : -1),
            showSorterTooltip: false,
            render: (value) => (
              <Typography.Text type={!value ? 'secondary' : undefined}>
                {formatNumber(value)}
              </Typography.Text>
            ),
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
