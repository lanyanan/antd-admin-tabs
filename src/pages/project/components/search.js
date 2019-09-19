import React, { PureComponent } from 'react'
import { Form, Icon, Input, Button, Select } from 'antd'
import request from 'utils/request'
import api from 'api'

const { getCityList } = api
const { Option } = Select

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

@Form.create()
class Search extends React.Component {
  state = {
    CityList: [],
  }
  async componentDidMount() {
    this.props.form.validateFields()
    const data = await request({ url: '/bbc/bbcproject/getcity' })
    if (data.ErrCode === 0) {
      this.setState({
        CityList: data.data,
      })
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const { onSearch } = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onSearch(values)
      }
    })
  }

  createOptions = list => {
    return (
      list &&
      list.map((item, index) => {
        return (
          <Option key={`${item.Id}--${index}`} value={item.Id}>
            {item.Name}
          </Option>
        )
      })
    )
  }

  reset = () => {
    this.props.form.resetFields()
    const { onSearch } = this.props
    onSearch()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { CityList } = this.state
    return (
      <Form
        layout="inline"
        onSubmit={this.handleSubmit}
        style={{ marginBottom: 20 }}
      >
        <Form.Item label="项目名称">
          {getFieldDecorator('Name', {})(<Input placeholder="项目名称" />)}
        </Form.Item>
        <Form.Item label="城市">
          {getFieldDecorator('City', {})(
            <Select style={{ width: 168 }} placeholder="状态">
              {this.createOptions(CityList)}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="项目交付类型">
          {getFieldDecorator('Type', {})(
            <Select style={{ width: 168 }} placeholder="项目交付类型">
              <Option key={0} value={0}>
                毛坯
              </Option>
              <Option key={1} value={1}>
                精装
              </Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="负责人">
          {getFieldDecorator('UserName', {})(<Input placeholder="负责人" />)}
        </Form.Item>
        <Form.Item label="基础包收费">
          {getFieldDecorator('BasicPriceType', {})(
            <Select style={{ width: 168 }} placeholder="基础包收费">
              <Option key={0} value={0}>
                计价
              </Option>
              <Option key={1} value={1}>
                不计价
              </Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="项目状态">
          {getFieldDecorator('State', {})(
            <Select style={{ width: 168 }} placeholder="项目状态">
              <Option key={0} value={0}>
                待上线
              </Option>
              <Option key={1} value={1}>
                进行中
              </Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={this.reset}>
            重置
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
export default Search
