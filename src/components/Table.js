/**
 * Table 组件用于切换分页拉取当前分页下的数据
 * @param
 * @author lan
 * @dateTime 2019-09-19
 */

import React from 'react'
import { Table } from 'antd'
import { withRouter } from 'react-router-dom'
import { router } from 'utils'

class TableClone extends React.Component {
  change = (pagination, filters, sorter, extra) => {
    const { history } = this.props
    console.log(pagination, this.props)
    let parmas = {
      page: pagination.current,
      pageSize: pagination.pageSize,
    }
    const pathname = window.location.pathname
    history.push(history.location.pathname, { query: { ...parmas } })
  }
  render() {
    return <Table onChange={this.change} {...this.props}></Table>
  }
}
export default withRouter(TableClone)
