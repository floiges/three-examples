import * as THREE from 'three'
import Template from '../../common/Template'
import { addAmbientLight, addDirectionalLight } from './light'
import { addOrbitControls } from '../../common/control/orbitControls'
import { addAxesHelper } from '../../common/helper'
import Ground from '../objects/Ground'
import House from '../objects/House'
import Grave from '../objects/Grave'

export default class Director extends Template {
  constructor() {
    super()

    this.PCamera.fov = 75
    this.cameraPosition = new THREE.Vector3(5, 4, 5)
    this.rendererColor = new THREE.Color('#262837')
    this.init()

    // 开启阴影
    this.renderer.shadowMap.enabled = true

    // 添加光源
    // 环境光
    addAmbientLight(this.scene)
    // 平行光
    addDirectionalLight (this.scene)

    // 轨道控制器
    addOrbitControls(this.camera, this.renderer.domElement)
    // 坐标辅助
    addAxesHelper(this.scene)

    this.addFog()

    this.addGround()
    this.addHouse()
    this.addGrave()
    this.addGhosts()

    this.clock = new THREE.Clock()

    this.animate()
  }

  addGround() {
    const ground = new Ground(20, 20, 1)
    ground.setRotation(-Math.PI / 2, 0, 0)
    ground.addToScene(this.scene)
  }

  addHouse() {
    const house = new House()
    house.addToScene(this.scene)
  }

  addGrave() {
    const grave = new Grave()
    grave.addToScene(this.scene)
  }

  /**
   * 增加雾化效果
   */
  addFog() {
    const fog = new THREE.Fog('#262837', 1, 15)
    this.scene.fog = fog
  }

  /**
   * 添加 ghost，用点光源代替
   */
  addGhosts() {
    this.ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
    // 添加阴影
    this.ghost1.castShadow = true
    this.scene.add(this.ghost1)

    this.ghost2 = new THREE.PointLight("#00ffff", 2, 3)
    this.ghost2.castShadow = true
    this.scene.add(this.ghost2)

    this.ghost3 = new THREE.PointLight("#ffff00", 2, 3)
    this.ghost3.castShadow = true
    this.scene.add(this.ghost3)
  }

  animate() {
    const elapsedTime = this.clock.getElapsedTime()
    const ghost1Angle = elapsedTime * 0.5

    this.ghost1.position.x = Math.cos(ghost1Angle) * 4
    this.ghost1.position.z = Math.sin(ghost1Angle) * 4
    this.ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = -elapsedTime * 0.32
    this.ghost2.position.x = Math.cos(ghost2Angle) * 5
    this.ghost2.position.z = Math.sin(ghost2Angle) * 5
    // 两个不同频率的 sin 函数叠加
    this.ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = -elapsedTime * 0.18
    this.ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    this.ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    this.ghost3.position.y = Math.sin(elapsedTime * 4) +  Math.sin(elapsedTime * 2.5)

    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}