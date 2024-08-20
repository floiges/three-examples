import * as THREE from 'three'
/**
 * 一个以度数为单位进行操作的对象，但它将以弧度为单位设置该属性
 */
export default class DegRadHelper {
  constructor(obj, prop) {
    this.obj = obj
    this.prop = prop
  }

  get value() {
    return THREE.MathUtils.radToDeg(this.obj[this.prop])
  }

  set value(v) {
    this.obj[this.prop] = THREE.MathUtils.degToRad(v)
  }
}