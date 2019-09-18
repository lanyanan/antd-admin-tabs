/* global window */

import { router } from 'utils'
import { stringify } from 'qs'
import store from 'store'
import { ROLE_TYPE } from 'utils/constant'
import { queryLayout, pathMatchRegexp } from 'utils'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import database from '../../config/menu.config'
import api from 'api'
import config from 'config'

const { getUserInfo, logout } = api

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'guest',
  DEVELOPER: 'developer',
}

const userPermission = {
  DEFAULT: {
    visit: ['1', '2', '21', '7', '5', '51', '52', '53'],
    role: EnumRoleType.DEFAULT,
  },
  ADMIN: {
    role: EnumRoleType.ADMIN,
  },
  DEVELOPER: {
    role: EnumRoleType.DEVELOPER,
  },
}

const { queryRouteList, logoutUser, queryUserInfo } = api

export default {
  namespace: 'app',
  state: {
    currentOpenTabKey: '',
    currentOpenTabProps: '',
    routeList: [
      {
        id: '1',
        icon: 'laptop',
        name: 'Dashboard',
        zhName: '仪表盘',
        router: '/dashboard',
      },
    ],
    locationPathname: '',
    locationQuery: {},
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    notifications: [
      {
        title: 'New User is registered.',
        date: new Date(Date.now() - 10000000),
      },
      {
        title: 'Application has been approved.',
        date: new Date(Date.now() - 50000000),
      },
    ],
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'query' })
    },
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setupRequestCancel({ history }) {
      history.listen(() => {
        const { cancelRequest = new Map() } = window

        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE)
            cancelRequest.delete(key)
          }
        })
      })
    },
  },
  effects: {
    *openNewTabs({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          currentOpenTabKey: payload.key,
          currentOpenTabProps: payload,
        },
      })
    },
    *query({ payload }, { call, put, select }) {
      // store isInit to prevent query trigger by refresh
      // const isInit = store.get('isInit')
      // if (isInit) return
      const { locationPathname } = yield select(_ => _.app)
      const queryUserInfo = {
        // g_tk: ,
        g_ty: 'bbc',
        _dc: 1568172025216,
      }
      const data = yield call(getUserInfo, queryUserInfo)
      // if (success && user) {
      if (data.ErrCode == 0) {
        // const { list } = yield call(queryRouteList);
        const list = database
        //const { permissions } = user;
        const permissions = userPermission.ADMIN

        // let routeList = list
        let routeList = database
        if (
          permissions.role === ROLE_TYPE.ADMIN ||
          permissions.role === ROLE_TYPE.DEVELOPER
        ) {
          permissions.visit = list.map(item => item.id)
        } else {
          routeList = list.filter(item => {
            const cases = [
              permissions.visit.includes(item.id),
              item.mpid
                ? permissions.visit.includes(item.mpid) || item.mpid === '-1'
                : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }
        store.set('routeList', routeList)
        store.set('permissions', permissions)
        store.set('user', data)
        store.set('isInit', true)
        if (pathMatchRegexp(['/', '/login'], window.location.pathname)) {
          router.push({
            pathname: '/home',
          })
        }
      } else if (queryLayout(config.layouts, locationPathname) !== 'public') {
        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          }),
        })
      }
    },

    *signOut({ payload }, { call, put }) {
      const data = yield call(logout)
      if (data.ErrCode === 0) {
        store.set('routeList', [])
        store.set('permissions', { visit: [] })
        store.set('user', {})
        store.set('isInit', false)
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      console.log(payload)
      return {
        ...state,
        ...payload,
      }
    },

    handleThemeChange(state, { payload }) {
      store.set('theme', payload)
      state.theme = payload
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload)
      state.collapsed = payload
    },

    allNotificationsRead(state) {
      state.notifications = []
    },
  },
}
