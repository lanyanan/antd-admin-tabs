import { router, pathMatchRegexp } from 'utils'
import api from 'api'

const { login } = api

export default {
  namespace: 'project',

  state: {},

  effects: {
    *login({ payload }, { put, call, select }) {
      const data = yield call(login, payload)
      const { locationQuery } = yield select(_ => _.app)
      if (data.ErrCode === 0) {
        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (!pathMatchRegexp('/login', from)) {
          if (['', '/'].includes(from)) router.push('/')
          else router.push(from)
        } else {
          router.push('/')
        }
      } else {
        throw data
      }
    },
  },
}
