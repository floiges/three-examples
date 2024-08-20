/**
 * 我们还需要一个类，将 "123" 这样的字符串转换为 123 这样的数字，
 * 因为three.js的枚举设置需要数字，比如 wrapS 和 wrapT，
 * 但lil-gui只使用字符串来设置枚举。
 */

export default class StringToNumberHelper {
  constructor(obj, prop) {
    this.obj = obj
    this.prop = prop
  }

  get value() {
    return this.obj[this.prop]
  }

  set value(v) {
    this.obj[this.prop] = parseFloat(v)
  }
}