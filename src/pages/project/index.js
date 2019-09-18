import React, { PureComponent } from 'react'
import { Table } from 'antd'
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
@connect(({ project, app, loading }) => ({ app, project, loading }))
class Project extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch({ type: 'project/list', payload: {} })
  }
  columns = [
    {
      title: '序号',
      width: 100,
      dataIndex: 'Id',
      key: 'Id',
    },
    {
      title: '项目名称',
      dataIndex: 'Name',
      key: 'Name',
      render: (value, row) => {
        return (
          <span onClick={() => this.openTabs(row)} style={{ color: '#1890ff' }}>
            {value}
          </span>
        )
      },
    },
    {
      title: '城市',
      dataIndex: 'CityName',
      key: 'CityName',
    },
    {
      title: '负责人',
      dataIndex: 'UserName',
      key: 'UserName',
    },
    {
      title: '项目交付类型',
      dataIndex: 'Type',
      key: 'Type',
      render: type => (type === 0 ? '毛坯' : '精装'),
    },
    {
      title: '销售周期',
      dataIndex: 'SalesStartTime',
      key: 'SalesStartTime',
      render: time => time,
    },
    {
      title: '施工周期',
      dataIndex: 'ConstructionStartTime',
      key: 'ConstructionStartTime',
      render: time => time,
    },
    {
      title: '基础包是否计费',
      dataIndex: 'BasicPriceType',
      key: 'BasicPriceType',
      render: type => (type === 1 ? '不计价' : '计价'),
    },
    {
      title: '项目状态',
      dataIndex: 'State',
      key: 'State',
      render: type => (type === 0 ? '进行中' : '待上线'),
    },
  ]
  openTabs = row => {
    const { dispatch } = this.props
    const path = '/project/details'
    dispatch({
      type: 'app/openNewTabs',
      payload: {
        exact: true,
        content: require('./details').default,
        key: path + `/${row.Id}`,
        name: `${row.Name}`,
        path: path + `/${row.Id}`,
      },
    })
  }
  render() {
    const {
      project: { list },
    } = this.props
    return (
      <Page inner>
        <Table
          columns={this.columns}
          dataSource={list}
          pagination={{ showSizeChanger: true, showQuickJumper: true }}
        ></Table>
      </Page>
    )
  }
}

export default Project
