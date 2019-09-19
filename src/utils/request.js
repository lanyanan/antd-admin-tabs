import axios from 'axios'
import { cloneDeep, isEmpty } from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { CANCEL_REQUEST_MESSAGE, HOST } from 'utils/constant'
import qs from 'qs'

axios.defaults.withCredentials = true
const { CancelToken } = axios
window.cancelRequest = new Map()

export default function request(options) {
  let { data, url, method = 'get' } = options
  const cloneData = cloneDeep(data)
  url = HOST + url + `?g_ty=bbc&_dc=${new Date().getTime()}`
  if (method.toLowerCase() === 'get') {
    let parmasUrl = ''
    data &&
      Object.keys(data).length > 0 &&
      Object.entries(data).map(([key, val]) => {
        if (val) {
          parmasUrl = `${parmasUrl}&${key}=${val}`
        }
      })
    url = url + parmasUrl
  }
  // 设置请求头和设置cors模式
  options['headers'] = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Sec-Fetch-Mode': 'cors',
  }

  options.url = url
  options.data = qs.stringify(cloneData)

  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    })
  })

  return axios(options)
    .then(response => {
      const { statusText, status, data } = response

      let result = {}
      if (typeof data === 'object') {
        result = data
        if (Array.isArray(data)) {
          result.list = data
        }
      } else {
        result.data = data
      }

      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...result,
      })
    })
    .catch(error => {
      const { response, message } = error

      if (String(message) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
        }
      }

      let msg
      let statusCode

      if (response && response instanceof Object) {
        const { data, statusText } = response
        statusCode = response.status
        msg = data.message || statusText
      } else {
        statusCode = 600
        msg = error.message || 'Network Error'
      }

      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      })
    })
}
