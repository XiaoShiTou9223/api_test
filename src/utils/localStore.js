module.exports = {
  /**
   * 写入一条记录,如果写入的内容不是字符串则Json化
   * @param {*} key key
   * @param {*} value value only support string
   */
  lsput (key, value) {
    if (!value) {
      return
    }
    if (typeof value === 'string') {
      localStorage.setItem(key, value)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  },
  /**
   * 获取记录值
   * @param {*} key 
   */
  lsget (key) {
    const cstr = localStorage.getItem(key);
    if (cstr && cstr.length > 0) {
      return cstr
    } else {
      return undefined
    }
  },
  /**
   * 删除一个记录
   * @param {*} key 
   */
  lsremove(key) {
    localStorage.removeItem(key)
  }
};