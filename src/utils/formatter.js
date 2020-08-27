import { isDefined, isEmpty, isArray, isDate, parseTime } from '@/utils/tools'

export function formatBoolean (v) {
  if (v === undefined || v === true || v === false) {
    return v
  } else if (v !== null) {
    const str = v.toString().toLowerCase()
    if (str === '1' || str === 'true') {
      return true
    } else if (str === '0' || str === 'false') {
      return false
    }
  }
  return undefined
}

export function formatNonnegativeNumber (v) {
  const result = Number(v)
  if (result < 0) {
    return 0
  } else {
    return result
  }
}

export function formatPositiveNumber (v) {
  const result = Number(v)
  if (result < 1) {
    return 1
  } else {
    return result
  }
}

export function formatArray (v) {
  if (isArray(v)) {
    return v
  } else if (!isEmpty(v)) {
    const str = v.toString()
    if (str.indexOf(',') < 0) {
      return [str]
    } else {
      return str.split(',')
    }
  } else {
    return []
  }
}

export function formatBinary (value) {
  const v = formatBoolean(value)
  if (isDefined(v)) {
    if (v) {
      return '是'
    } else {
      return '否'
    }
  } else {
    return ''
  }
}

const CURRENT = new Date()

export function formatAge (t) {
  if (t) {
    let time
    if (isDate(t)) {
      time = t
    } else {
      if (('' + t).length === 10) {
        t = parseInt(t) * 1000
      }
      time = new Date(t)
    }
    let years = CURRENT.getFullYear() - time.getFullYear()
    if (years >= 0) {
      if (CURRENT.getMonth() < time.getMonth() || (CURRENT.getMonth() === time.getMonth() && CURRENT.getDate() < time.getDate())) {
        years -= 1
      }
    }
    return years
  } else {
    return null
  }
}

export function formatDate (v) {
  if (v) {
    try {
      return parseTime(v, '{y}年{m}月{d}日')
    } catch (ex) {
    }
  }
  return ''
}

export function formatDateTime (v) {
  if (v) {
    try {
      return parseTime(v, '{y}年{m}月{d}日 {h}:{i}')
    } catch (ex) {
    }
  }
  return ''
}
