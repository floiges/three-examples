import * as THREE from 'three'
import Template from '../../common/Template';
import { addAmbientLight, addDirectionalLight } from './light'
import { addAxesHelper } from '../../common/helper'
import { addOrbitControls } from '../../common/control/orbitControls'
import { Gui } from '../tools/gui'

export default class Director extends Template {
  constructor() {
    super()

    this.cameraPosition = new THREE.Vector3(2, 2, 3)

    this.init()

    addAmbientLight(this.scene)
    addDirectionalLight(this.scene)

    addOrbitControls(this.camera, this.renderer.domElement)
    addAxesHelper(this.scene)

    this.parameters = Gui(this.generateGalaxy.bind(this))
    this.generateGalaxy()

    this.animate()
  }

  generateGalaxy() {
    if (this.points) {
      this.geometry.dispose()
      this.material.dispose()
      this.scene.remove(this.points)
    }

    this.geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(this.parameters.count * 3)
    const colors = new Float32Array(this.parameters.count * 3)

    const colorInside = new THREE.Color(this.parameters.insideColor)
    const colorOutside = new THREE.Color(this.parameters.outsideColor)

    // 创建旋转的星系
    for (let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3

      // 将顶点放置在从中心到半径的直线上
      // radius 为 [0, radius] 随机值
      const radius = Math.random() * this.parameters.radius
      // 让粒子根据离中心位置的距离进行旋转，距离原点越远的，旋转角度越大
      const spinAngle = radius * this.parameters.spin
      const branchAngle = (i % this.parameters.branches) / this.parameters.branches * 2 * Math.PI

      // 让粒子扩散开来，为每个轴创建一个随机值，然后将其应用到位置中
      // const randomX = Math.random() * this.parameters.randomness
      // const randomY = Math.random() * this.parameters.randomness
      // const randomZ = Math.random() * this.parameters.randomness

      // 如果随机值和粒子半径成正比，
      // const randomX = (Math.random() - 0.5) * this.parameters.randomness * radius
      // const randomY = (Math.random() - 0.5) * this.parameters.randomness * radius
      // const randomZ = (Math.random() - 0.5) * this.parameters.randomness * radius

      // 使粒子散布在曲线的两侧，我们需要给 random 值加入一个随机的负号
      const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
      const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
      const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

      positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX
      positions[i3 + 1] = 0 + randomY
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

      // 由于 lerp 插值会让原本的颜色被覆盖，我们需要先用 clone 方法复制 colorInside，
      // 再使用 lerp 方法向目标颜色进行插值，lerp 第一个参数是目标，第二参数是 [0, 1] 之间的系数。
      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radius / this.parameters.radius)

      colors[i3 + 0] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    this.material = new THREE.PointsMaterial({
      size: this.parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    })

    this.points = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.points)
  }

  animate() {
    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}