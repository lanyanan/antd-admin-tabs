import React, { PureComponent } from 'react'
import { Card, Row, Col, Table } from 'antd'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import { connect } from 'dva'

const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    id: i,
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  })
}

@withI18n()
@connect(({ app, loading }) => ({ app, loading }))
class Project extends PureComponent {
  columns = [
    {
      title: 'id',
      width: 100,
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
    },
    {
      title: 'Full Name',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      render: (value, row) => {
        return (
          <a onClick={() => this.openTabs(row)} href="javascript:">
            窗口打开的链接
          </a>
        )
      },
    },
    {
      title: 'Age',
      width: 100,
      dataIndex: 'age',
      key: 'age',
      fixed: 'left',
    },
    {
      title: 'Column 1',
      dataIndex: 'address',
      key: '1',
      width: 150,
    },
    {
      title: 'Column 2',
      dataIndex: 'address',
      key: '2',
      width: 150,
    },
    {
      title: 'Column 3',
      dataIndex: 'address',
      key: '3',
      width: 150,
    },
    {
      title: 'Column 4',
      dataIndex: 'address',
      key: '4',
      width: 150,
    },
    {
      title: 'Column 5',
      dataIndex: 'address',
      key: '5',
      width: 150,
    },
    {
      title: 'Column 6',
      dataIndex: 'address',
      key: '6',
      width: 150,
    },
    {
      title: 'Column 7',
      dataIndex: 'address',
      key: '7',
      width: 150,
    },
    { title: 'Column 8', dataIndex: 'address', key: '8' },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <a>action</a>,
    },
  ]
  openTabs = row => {
    const { dispatch } = this.props
    console.log('dakaixinchuangkou')
    const path = '/project/details'
    dispatch({
      type: 'app/openNewTabs',
      payload: {
        exact: true,
        content: require('./details').default,
        key: path + `/${row.id}`,
        name: '项目详情' + `${row.id}`,
        path: path + `/${row.id}`,
      },
    })
  }
  render() {
    // const {onHandlePage} = this.props;
    return (
      <Page inner>
        <Table
          columns={this.columns}
          dataSource={data}
          scroll={{ x: 1500, y: 300 }}
        ></Table>
      </Page>
    )
  }
}

export default Project
