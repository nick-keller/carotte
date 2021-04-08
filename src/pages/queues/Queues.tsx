import React, { FC, useEffect, useState } from 'react'
import { Input, PageHeader, Space, Switch, Table, Typography } from 'antd'
import { match as Match } from 'react-router-dom'
import { SearchOutlined, StarOutlined, StarTwoTone } from '@ant-design/icons'
import { formatNumber } from '../../utils/format'
import { MoveQueuesButton } from '../../actions/moveQueues/MoveQueuesButton'
import useLocalStorage from 'use-local-storage'
import { PurgeQueuesButton } from '../../actions/purgeQueues/PurgeQueuesButton'
import { DeleteQueuesButton } from '../../actions/deleteQueues/DeleteQueuesButton'
import { useFetchQueues } from '../../hooks/useFetchQueues'
import { NewQueueButton } from '../../actions/newQueue/NewQueueButton'
import { queueTags } from './queue'
import { QueueTypeTag } from '../../components/QueueTypeTag'
import { QueueLink } from '../../components/QueueLink'

export const Queues: FC<{ match: Match }> = ({ match }) => {
  const { data, loading } = useFetchQueues({ live: true })

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any[]>([])
  const [starredOnly, setStarredOnly] = useLocalStorage('starredOnly', false)
  const [starredQueues, setStarredQueues] = useLocalStorage<string[]>(
    'starredQueues',
    []
  )

  useEffect(() => {
    if (
      !loading &&
      starredOnly &&
      data?.every(({ name }) => !starredQueues.includes(name))
    ) {
      setStarredQueues([])
      setStarredOnly(false)
    }
  }, [
    loading,
    starredOnly,
    data,
    starredQueues,
    setStarredOnly,
    setStarredQueues,
  ])

  if (!data) {
    return null
  }

  return (
    <>
      <PageHeader
        title="Queues"
        style={{ marginRight: '30px' }}
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
            <MoveQueuesButton
              vhost={data[0]?.vhost}
              queues={selected}
              key="move"
            />
          ),
          !!selected.length && (
            <PurgeQueuesButton
              vhost={data[0]?.vhost}
              queues={selected}
              key="purge"
            />
          ),
          !!selected.length && (
            <DeleteQueuesButton
              vhost={data[0]?.vhost}
              queues={selected}
              key="delete"
            />
          ),
          !selected.length && !!starredQueues.length && (
            <span key="starredOnly">
              <Switch checked={starredOnly} onChange={setStarredOnly} /> Starred
              only
            </span>
          ),
          !selected.length && (
            <Input
              key="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search..."
              style={{ width: '300px' }}
            />
          ),
          !selected.length && <NewQueueButton key="new" />,
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
          ({ name }) =>
            name.toLowerCase().includes(search.toLowerCase()) &&
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

                <QueueLink name={name} vhost={vhost} />
              </Space>
            ),
          },
          {
            title: 'Options',
            render: (value) => queueTags(value),
            responsive: ['xl']
          },
          {
            title: 'Type',
            render: (value) => <QueueTypeTag type={value.type} />,
            responsive: ['lg']
          },
          {
            title: 'Messages',
            dataIndex: 'messages',
            sorter: (a, b) => (a.messages > b.messages ? 1 : -1),
            showSorterTooltip: false,
            sortDirections: ['descend', 'ascend'],
            render: (value) => (
              <Typography.Text type={!value ? 'secondary' : undefined}>
                {formatNumber(value)}
              </Typography.Text>
            ),
            responsive: ['sm']
          },
          {
            title: 'Consumers',
            dataIndex: 'consumers',
            sorter: (a, b) => (a.consumers > b.consumers ? 1 : -1),
            showSorterTooltip: false,
            sortDirections: ['descend', 'ascend'],
            render: (value) => (
              <Typography.Text type={!value ? 'secondary' : undefined}>
                {formatNumber(value)}
              </Typography.Text>
            ),
            responsive: ['sm']
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
