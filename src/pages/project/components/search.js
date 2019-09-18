import React, { PureComponent } from 'react'
import { Form, Icon, Input, Button } from 'antd'

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

@Form.create()
class Search extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
    } = this.props.form

    // Only show error after a field is touched.
    return (
      <Form
        layout="inline"
        onSubmit={this.handleSubmit}
        style={{ marginBottom: 20 }}
      >
        <Form.Item label="项目名称">
          {getFieldDecorator('username', {
            // rules: [{ required: true, message: 'Please input your username!' }],
          })(<Input placeholder="项目名称" />)}
        </Form.Item>
        <Form.Item label={'状态'}>
          {getFieldDecorator('password', {})(<Input placeholder="状态" />)}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            搜索
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
export default Search
