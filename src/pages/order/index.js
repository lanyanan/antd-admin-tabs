import React, { PureComponent } from 'react'
import { Card, Row, Col, Table } from 'antd'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import { connect } from 'dva'

const columns = [
  {
    title: '手机号码',
    width: 100,
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '业务类型',
    width: 100,
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '备注',
    dataIndex: 'address',
    key: '1',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'address',
    key: '2',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'address',
    key: '3',
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'address',
    key: '4',
    width: 150,
  },
]

@withI18n()
@connect(({ loading, order }) => ({ loading, order }))
class Order extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch({ type: 'order/list', payload: {} })
  }
  render() {
    const {
      order: { list },
    } = this.props
    return (
      <Page inner>
        <Table columns={columns} dataSource={list}></Table>
      </Page>
    )
  }
}

export default Order
