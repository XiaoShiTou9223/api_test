const toString = Object.prototype.toString

export function isDefined (v) {
  return typeof v !== 'undefined'
}

export function isNull (v) {
  return v === null
}

export function isVoid (v) {
  return !isDefined(v) || isNull(v)
}

export function isEmpty (v) {
  return isVoid(v) || v.length === 0
}

export function isBoolean (v) {
  return typeof v === 'boolean'
}

export function isString (v) {
  return typeof v === 'string'
}

export function isNumber (v) {
  return typeof v === 'number' && !isNaN(v)
}

export function isDate (v) {
  return toString.call(v) === '[object Date]'
}

export function isArray (v) {
  return toString.call(v) === '[object Array]'
}

export function isObject (v) {
  return toString.call(v) === '[object Object]'
}

export function isFunction (v) {
  return typeof v === 'function'
}

export function equals (v1, v2) {
  if (!isVoid(v1) && !isVoid(v2)) {
    if (isObject(v1)) {
      if (isObject(v2)) {
        return eachEqual(v1, v2)
      } else {
        return false
      }
    } else if (isArray(v1)) {
      if (isArray(v2)) {
        return eachEqual(v1, v2)
      } else {
        return false
      }
    } else if (v1.toString() === v2.toString()) {
      return true
    } else {
      return false
    }
  } else if (!isVoid(v1) || !isVoid(v2)) {
    return false
  } else {
    return true
  }
}

const eachEqual = (v1, v2) => {
  for (const i in v1) {
    if (!equals(v1[i], v2[i])) {
      return false
    }
  }
  for (const i in v2) {
    if (!equals(v1[i], v2[i])) {
      return false
    }
  }
  return true
}

const DAY_LIST = ['一', '二', '三', '四', '五', '六', '日']

export function parseTime (t, f, k) {
  if (arguments.length === 0) {
    return null
  }
  const format = f || '{y}-{m}-{d} {h}:{i}:{s}'
  let time
  if (isDate(t)) {
    time = t
  } else {
    if (('' + t).length === 10) {
      t = parseInt(t) * 1000
    }
    time = new Date(t)
  }
  const formatObj = {
    y: time.getFullYear(),
    m: time.getMonth() + 1,
    d: time.getDate(),
    h: time.getHours(),
    i: time.getMinutes(),
    s: time.getSeconds(),
    a: time.getDay()
  }
  return format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return DAY_LIST[value - 1]
    if (!k && result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
}

export function copyParameter (obj) {
  if (isObject(obj)) {
    const result = {}
    for (const k in obj) {
      result[k] = copyParameter(obj[k])
    }
    return result
  } else if (isArray(obj)) {
    const result = []
    for (const i in obj) {
      result.push(copyParameter(obj[i]))
    }
    return result
  } else if (isBoolean(obj) || isString(obj) || isNumber(obj) || isDate(obj)) {
    return obj
  } else {
    return undefined
  }
}

export function on (el, evt, fn) {
  if (el && evt && isFunction(fn)) {
    if (el.addEventListener) {
      el.addEventListener(evt, fn, false)
    } else if (el.attachEvent) {
      el.attachEvent('on' + evt, fn)
    } else {
      el['on' + evt] = fn
    }
  }
}

export function blur (evt) {
  if (evt) {
    if (evt.target) {
      evt.target.blur()
    }
    if (evt.currentTarget) {
      evt.currentTarget.blur()
    }
  }
}
