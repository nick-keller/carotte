import React, { FC, useState } from 'react'
import { Input, PageHeader, Table } from 'antd'
import { match as Match } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import { formatNumber } from '../../utils/format'
import { useFetchExchanges } from '../../hooks/useFetchExchanges'
import { exchangeTags } from './exchange'
import { ExchangeTypeTag } from '../../components/ExchangeTypeTag'
import { ExchangeLink } from '../../components/ExchangeLink'

export const Exchanges: FC<{ match: Match }> = ({ match }) => {
  const { data, loading } = useFetchExchanges({ live: true })
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any[]>([])

  if (!data) {
    return null
  }

  return (
    <>
      <PageHeader
        title="Exchanges"
        style={{ marginRight: '30px' }}
        subTitle={
          selected.length ? (
            <>
              <b>{formatNumber(selected.length)}</b> selected
            </>
          ) : (
            <>
              <b>{formatNumber(data.length)}</b> exchanges
            </>
          )
        }
        extra={[
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
        dataSource={data.filter(({ name }) =>
          name.toLowerCase().includes(search.toLowerCase())
        )}
        columns={[
          {
            title: 'Name',
            sorter: (a, b) => (a.name > b.name ? 1 : -1),
            defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            render: ({ name, vhost }) => (
              <ExchangeLink name={name} vhost={vhost} />
            ),
          },
          {
            title: 'Options',
            render: (value) => exchangeTags(value),
            responsive: ['md']
          },
          {
            title: 'Type',
            dataIndex: 'type',
            render: (value) => <ExchangeTypeTag type={value} />,
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
