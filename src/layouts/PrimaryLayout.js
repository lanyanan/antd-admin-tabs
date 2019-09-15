/* global window */
/* global document */
import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import withRouter from 'umi/withRouter'
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom'
import { connect } from 'dva'
import { MyLayout } from 'components'
import {
  BackTop,
  Layout,
  Drawer,
  Tabs,
  Button,
  Dropdown,
  Menu,
  Icon,
} from 'antd'
import { GlobalFooter } from 'ant-design-pro'
import { enquireScreen, unenquireScreen } from 'enquire-js'
import { config, pathMatchRegexp, langFromPath, getRoutes } from 'utils'
import Error from '../pages/404'
import styles from './PrimaryLayout.less'
import store from 'store'
import Home from '../pages/home/index.js'
import MenuData from '../../config/menu.config'

const { TabPane } = Tabs
const { Content } = Layout
const { Header, Bread, PanelTabs, Sider } = MyLayout

@withRouter
@connect(({ app, loading }) => ({ app, loading }))
class PrimaryLayout extends PureComponent {
  state = {
    isMobile: false,
    tabList: [
      {
        closable: false,
        content: Home,
        exact: true,
        key: '/home',
        name: 'Home',
        path: '/home',
      },
    ],
    tabListKey: ['/home'],
    activeKey: '/home',
  }

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    const { currentOpenTabKey, currentOpenTabProps } = nextProps.app
    console.log(this.props.app, nextProps)
    if (this.props.app.currentOpenTabKey != currentOpenTabKey) {
      this.openNewTabs(currentOpenTabProps)
    }
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler)
  }

  openNewTabs = props => {
    console.log(props)
    const { tabListKey, tabList } = this.state
    // dispatch({
    //   type:'app/'
    // })
    if (tabListKey.indexOf(props.key) > -1) {
      this.setState({
        activeKey: props.key,
      })
      return false
    }
    this.setState({
      activeKey: props.key,
    })
    tabList.push(props)
    this.setState({
      tabListKey: tabList.map(va => va.key),
      tabList,
    })
  }

  onCollapseChange = collapsed => {
    this.props.dispatch({
      type: 'app/handleCollapseChange',
      payload: collapsed,
    })
  }

  onHandlePage = e => {
    //点击左侧菜单
    console.log(this.props)
    const { location } = this.props
    const { tabListKey, tabList } = this.state
    const key = location.pathname
      ? location.pathname.substring(3, location.pathname.length)
      : ''
    const tabLists = getRoutes(
      location.pathname
        ? location.pathname.substring(3, location.pathname.length)
        : '',
      MenuData,
      tabListKey
    )

    if (tabLists) {
      this.setState({
        activeKey: key,
      })
      if (typeof tabLists === 'object') {
        this.setState({
          activeKey: key,
        })
        tabList.push(tabLists)
      }
    } else {
      return false
    }

    // tabList.push(tabLists)
    // tabLists.map(v => {
    //   if (v.key === key) {
    //     if (tabList.length === 0) {
    //       v.closable = false
    //       this.state.tabList.push(v)
    //     } else {
    //       if (!tabListKey.includes(v.key)) {
    //         if (v.content) {
    //           v.content = {
    //             ...v.content,
    //             props: Object.assign({}, v.content.props, {
    //               onHandlePage: this.onHandlePage,
    //             }),
    //           }
    //         }
    //         this.state.tabList.push(v)
    //       }
    //     }
    //   }
    // })
    this.setState({
      tabListKey: tabList.map(va => va.key),
      tabList,
    })
  }
  // 切换 tab页 router.push(key);
  onChange = key => {
    this.setState({ activeKey: key })
    this.props.history.push({ pathname: key })
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  remove = targetKey => {
    let { activeKey } = this.state
    let lastIndex
    this.state.tabList.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1
      }
    })
    const tabList = []
    this.state.tabList.map(pane => {
      if (pane.key !== targetKey) {
        tabList.push(pane)
      }
    })
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = tabList[lastIndex].key
    }

    this.props.history.push({ pathname: activeKey })
    this.setState({ tabList, activeKey, tabListKey: tabList.map(va => va.key) })
  }

  onClickHover = e => {
    // message.info(`Click on item ${key}`);
    let { key } = e,
      { activeKey, tabList, tabListKey } = this.state
    if (key === '1') {
      tabList = tabList.filter(v => v.key !== activeKey || v.key === '/home')
      tabListKey = tabListKey.filter(v => v !== activeKey || v === '/home')
      this.setState({
        activeKey: '/home',
        tabList,
        tabListKey,
      })
    } else if (key === '2') {
      tabList = tabList.filter(v => v.key === activeKey || v.key === '/home')
      tabListKey = tabListKey.filter(v => v === activeKey || v === '/home')
      this.setState({
        activeKey,
        tabList,
        tabListKey,
      })
    } else if (key === '3') {
      tabList = tabList.filter(v => v.key === '/home')
      tabListKey = tabListKey.filter(v => v === '/home')
      this.setState({
        activeKey: '/home',
        tabList,
        tabListKey,
      })
    }
  }

  render() {
    const { app, location, dispatch, children } = this.props
    const { theme, collapsed, notifications } = app
    const user = store.get('user') || {}
    const permissions = store.get('permissions') || {}
    const routeList = store.get('routeList') || []
    const { isMobile } = this.state
    const { onCollapseChange } = this

    // Localized route name.

    const lang = langFromPath(location.pathname)
    const newRouteList =
      lang !== 'en'
        ? routeList.map(item => {
            const { name, ...other } = item
            return {
              ...other,
              name: (item[lang] || {}).name || name,
            }
          })
        : routeList

    // Find a route that matches the pathname.
    const currentRoute = newRouteList.find(
      _ => _.route && pathMatchRegexp(_.route, location.pathname)
    )

    // Query whether you have permission to enter this page
    const hasPermission = currentRoute
      ? permissions.visit.includes(currentRoute.id)
      : false

    // MenuParentId is equal to -1 is not a available menu.
    const menus = newRouteList.filter(_ => _.menuParentId !== '-1')

    const headerProps = {
      menus,
      collapsed,
      notifications,
      onCollapseChange,
      avatar: user.avatar,
      username: user.username,
      fixed: config.fixedHeader,
      onAllNotificationsRead() {
        dispatch({ type: 'app/allNotificationsRead' })
      },
      onSignOut() {
        dispatch({ type: 'app/signOut' })
      },
    }

    const siderProps = {
      theme,
      menus,
      isMobile,
      collapsed,
      onCollapseChange,
      onThemeChange(theme) {
        dispatch({
          type: 'app/handleThemeChange',
          payload: theme,
        })
      },
      onHandlePage: this.onHandlePage,
    }

    const menu = (
      <Menu onClick={this.onClickHover}>
        <Menu.Item key="1">关闭当前标签页</Menu.Item>
        <Menu.Item key="2">关闭其他标签页</Menu.Item>
        <Menu.Item key="3">关闭全部标签页</Menu.Item>
      </Menu>
    )

    const operations = (
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" href="#">
          Hover me
          <Icon type="down" />
        </a>
      </Dropdown>
    )

    const { tabList } = this.state

    return (
      <Fragment>
        <Layout>
          {isMobile ? (
            <Drawer
              maskClosable
              closable={false}
              onClose={onCollapseChange.bind(this, !collapsed)}
              visible={!collapsed}
              placement="left"
              width={200}
              style={{
                padding: 0,
                height: '100vh',
              }}
            >
              <Sider {...siderProps} collapsed={false} />
            </Drawer>
          ) : (
            <Sider {...siderProps} />
          )}
          <div
            className={styles.container}
            style={{ paddingTop: config.fixedHeader ? 72 : 0 }}
            id="primaryLayout"
          >
            <Header {...headerProps} />
            <Content className={styles.content}>
              {/* <Bread routeList={newRouteList} /> */}
              <Tabs
                // className={styles.tabs}
                activeKey={this.state.activeKey}
                onChange={this.onChange}
                tabBarExtraContent={operations}
                tabBarStyle={{ background: '#fff' }}
                tabPosition="top"
                tabBarGutter={-1}
                hideAdd
                type="editable-card"
                onEdit={this.onEdit}
              >
                {tabList.map(item => (
                  <TabPane
                    tab={item.name}
                    key={item.key}
                    closable={item.closable}
                  >
                    {item.content ? (
                      <Route component={item.content}></Route>
                    ) : (
                      <Error />
                    )}
                  </TabPane>
                ))}
              </Tabs>
              {/* {hasPermission ? children : <Error />} */}
            </Content>
            <BackTop
              className={styles.backTop}
              target={() => document.querySelector('#primaryLayout')}
            />
            <GlobalFooter
              className={styles.footer}
              copyright={config.copyright}
            />
          </div>
        </Layout>
      </Fragment>
    )
  }
}

PrimaryLayout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default PrimaryLayout
