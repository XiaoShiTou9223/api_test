import Axios from 'axios'
//import Router from '@/router'
import { Message } from 'element-ui'
import { isVoid, isArray, isObject, isFunction } from '@/utils/tools'
import { formatBoolean } from '@/utils/formatter'

const Path = require('path')
const Base64 = require('js-base64').Base64

const instance = Axios.create({
  baseURL: location.protocol + '//' + location.host,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  },
  maxContentLength: 2048,
  validateStatus: status => {
    return status === 200
  }
})

export function formatRequestUrl(root, path, model) {
  if (!isVoid(root) && !isVoid(path)) {
    const rootIndex = root.indexOf('//')
    if (rootIndex >= 0) {
      if (model) {
        return root.substring(0, rootIndex) + '//' + Path.join(root.substring(rootIndex + 2), model, path)
      } else {
        return root.substring(0, rootIndex) + '//' + Path.join(root.substring(rootIndex + 2), path)
      }
    } else {
      if (model) {
        return Path.join(root, model, path)
      } else {
        return Path.join(root, path)
      }
    }
  } else if (isVoid(root)) {
    if (model) {
      return Path.join(model, path)
    } else {
      return path
    }
  } else if (isVoid(path)) {
    return root
  }
  return null
}

export function jsonGetData(url, data, done, fail, always) {
  const params = {}
  if (data) {
    params.data = data
  }
  jsonAjax(url, 'get', params, isFunction(done) ? result => {
    done(result.data)
  } : null, fail, always)
}

export function jsonGetList(url, data, page, size, done, fail, always) {
  const params = {}
  if (data) {
    params.data = data
  }
  if (page && page > 1) {
    params.page = page
  }
  if (size && size > 0) {
    params.size = size
  }
  jsonAjax(url, 'get', params, isFunction(done) ? result => {
    done(result.data, result.total)
  } : null, fail, always)
}

export function jsonPostData(url, data, done, fail, always) {
  const params = {}
  if (data) {
    params.data = data
  }
  jsonAjax(url, 'post', params, isFunction(done) ? result => {
    done(result.data, result.message)
  } : null, fail, always)
}

export function jsonAjax(url, method, params, done, fail, always) {
  const config = {
    url: url,
    method: method.toLowerCase()
  }
  const data = {}
  if (params) {
    for (const key in params) {
      if (isArray(params[key]) || isObject(params[key])) {
        data[key] = JSON.stringify(params[key])
      } else {
        data[key] = params[key]
      }
    }
  }
  if (formatBoolean(process.env.VUE_APP_AJAX_ENCODE) && data.data) {
    data.data = Base64.encode(data.data)
  }
  switch (config.method) {
    case 'get':
      config.params = data
      config.params.dt = new Date().getTime()
      break
    case 'post':
      config.data = JSON.stringify(data)
      break
  }
  instance(config).then(response => {
    if (response.data && response.data.success) {
      if (isFunction(done)) {
        done(response.data)
      } else {
        Message({
          type: 'success',
          title: '成功',
          message: '操作成功!'
        })
      }
    } else {
      let msg
      if (response.data) {
        if (response.data.message) {
          msg = response.data.message
        } else if (response.data.error) {
          switch (response.data.error) {
            case 'InvalidIdentification':
              msg = '缺少身份认证信息，无法进行该操作!'
              break
            case 'AuthorizingMissing':
              msg = '缺少相关权限，无法进行该操作!'
              break
            default:
              msg = '操作失败!'
          }
        }
      } else {
        msg = '操作失败!'
      }
      if (isFunction(fail)) {
        if (response.data) {
          fail(msg, response.data.error)
        } else {
          fail(msg)
        }
      } else {
        if (response.data && response.data.error) {
          console.error(response.data.error)
        }
        Message({
          type: 'error',
          title: '错误',
          message: msg
        })
      }
    }
    if (isFunction(always)) {
      always()
    }
    if (response.data && response.data.error) {
      switch (response.data.error) {
        case 'InvalidIdentification':
          Message({
            type: 'error',
            title: 'InvalidIdentification',
            message: '未登录'
          })
          // if (Router.app && Router.app.$route && Router.app.$route.name) {
          //   if (!Router.app.$route.meta || !Router.app.$route.meta.open) {
          //     Router.push({
          //       name: 'Login'
          //     })
          //   }
          // }
          break
        case 'AuthorizingMissing':
          Message({
            type: 'error',
            title: 'AuthorizingMissing',
            message: '403 无权限'
          })
          // Router.push({
          //   name: '403'
          // })
          break
        default:
      }
    }
  }).catch(error => {
    const msg = '服务异常!'
    if (isFunction(fail)) {
      fail(msg, error.message)
    } else {
      if (error.message) {
        console.error(error.message)
      }
      Message({
        type: 'error',
        title: '错误',
        message: msg
      })
    }
    if (isFunction(always)) {
      always()
    }
  })
}
