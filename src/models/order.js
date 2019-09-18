import { router, pathMatchRegexp } from 'utils'
import api from 'api'

const { getPreOrderList } = api

export default {
  namespace: 'order',

  state: {
    list: [],
  },

  effects: {
    *list({ payload }, { put, call, select }) {
      const data = yield call(getPreOrderList, payload)
      if (data.ErrCode === 0) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.Records,
          },
        })
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
