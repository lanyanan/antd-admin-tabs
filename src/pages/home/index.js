import React, { PureComponent } from 'react'
import { Card, Row, Col } from 'antd'
import { withI18n } from '@lingui/react'
import { Page } from 'components'

@withI18n()
class Home extends PureComponent {
  render() {
    return (
      <Page inner>
        <Card title={'文档下载'}>
          <Row>
            <Col span={5}>
              <a href="https://static.xinjiashenghuo.com/dev/bbc/2019/%E6%9C%80%E6%96%B0%E5%90%88%E5%90%8C%E6%A8%A1%E6%9D%BF.docx">
                最新合同模板.doc
              </a>
            </Col>
            <Col span={6}>2019-07-01</Col>
          </Row>
          <Row>
            <Col span={5}>
              <a href="https://static.xinjiashenghuo.com/static/bbc/%E6%96%B0%E5%AE%B6BBC%E7%B3%BB%E7%BB%9F%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C_V2.0_201905.pdf">
                最新合同模板.doc
              </a>
            </Col>
            <Col span={6}>2019-07-01</Col>
          </Row>
        </Card>
      </Page>
    )
  }
}

export default Home
