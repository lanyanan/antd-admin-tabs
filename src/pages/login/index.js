import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Icon, Input } from 'antd'
import { GlobalFooter } from 'ant-design-pro'
import { Trans, withI18n } from '@lingui/react'
import { setLocale, router } from 'utils'
import config from 'utils/config'

import styles from './index.less'
const FormItem = Form.Item

@withI18n()
@connect(({ loading }) => ({ loading }))
@Form.create()
class Login extends PureComponent {
  handleOk = () => {
    // router.push('/dashboard')
    const { dispatch, form } = this.props
    const { validateFieldsAndScroll } = form
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      const data = Object.assign(values, {
        g_ty: 'bbc',
        _dc: new Date().getTime(),
        platform: 1,
      })
      dispatch({ type: 'login/login', payload: data })
    })
  }

  render() {
    const { loading, form, i18n } = this.props
    const { getFieldDecorator } = form

    let footerLinks = [
      {
        key: 'github',
        title: <Icon type="github" />,
        href: 'https://github.com/zuiidea/antd-admin',
        blankTarget: true,
      },
    ]

    if (config.i18n) {
      footerLinks = footerLinks.concat(
        config.i18n.languages.map(item => ({
          key: item.key,
          title: (
            <span onClick={setLocale.bind(null, item.key)}>{item.title}</span>
          ),
        }))
      )
    }

    return (
      <Fragment>
        <section className={styles.login}>
          <div className={styles.loginContainer}>
            <div className={styles.loginLogo}>
              <img
                alt="logo-title"
                src={require('../../../assets/login_logo.png')}
              />
              <img
                alt="logo-bg"
                src={require('../../../assets/login_pic.png')}
              />
            </div>
            <div className={styles.loginForm}>
              <div className={styles.form}>
                {/* <div className={styles.logo}>
								<img alt="logo" src={config.logoPath} />
								<span>{config.siteName}</span>
							</div> */}
                <form>
                  <FormItem hasFeedback>
                    {getFieldDecorator('account', {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Input
                        onPressEnter={this.handleOk}
                        placeholder={i18n.t`用户名`}
                      />
                    )}
                  </FormItem>
                  <FormItem hasFeedback>
                    {getFieldDecorator('password', {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Input
                        type="password"
                        onPressEnter={this.handleOk}
                        placeholder={i18n.t`密码`}
                      />
                    )}
                  </FormItem>
                  <Row>
                    <Button
                      type="primary"
                      onClick={this.handleOk}
                      loading={loading.effects.login}
                    >
                      <Trans>登录</Trans>
                    </Button>
                    <p>
                      <span>{/* <Trans>Username</Trans>
											：guest */}</span>
                      <span>
                        <Trans>忘记密码</Trans>
                      </span>
                    </p>
                  </Row>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* <div className={styles.footer}>
          <GlobalFooter links={footerLinks} copyright={config.copyright} />
        </div> */}
      </Fragment>
    )
  }
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Login
