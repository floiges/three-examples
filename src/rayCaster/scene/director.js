import * as THREE from 'three'
import Template from '../../common/Template';
import { addAxesHelper } from '../../common/helper'
import { addOrbitControls } from '../../common/control/orbitControls'
import { addAmbientLight, addDirectionalLight } from './light'
import { sizes } from '../../common';

export default class Director extends Template {
  constructor() {
    super()

    this.PCamera.fov = 75
    this.cameraPosition = new THREE.Vector3(0, 0, 8)
    this.init()

    addAmbientLight(this.scene)
    addDirectionalLight(this.scene)
    addAxesHelper(this.scene)

    addOrbitControls(this.camera, this.renderer.domElement)

    this.clock = new THREE.Clock()
    this.mouse = {}
    this.currentIntersect = null

    window.addEventListener('mousemove', (event) => {
      // 我们需要鼠标的坐标，但是不是以像素为坐标的，而是以屏幕中心为原点[-1, 1] 的水平和竖直轴坐标
      this.mouse.x = event.clientX / sizes.width * 2 - 1
      this.mouse.y = 1- event.clientY / sizes.height * 2
    })

    window.addEventListener('click', () => {
      if (!this.currentIntersect) {
        return
      }

      // 现在，我们点击物体就可以显示哪个物体被点击了，使用这个思路我们可以实现射击游戏的命中逻辑。
      switch (this.currentIntersect.object) {
        case this.ball1:
          console.log("click on ball 1")
          break;
        case this.ball2:
          console.log("click on ball 2")
          break;
        case this.ball3:
          console.log("click on ball 3")
          break;
      }
    })

    this.setup()

    this.animate()
  }

  setup() {
    const sphereGeometry = new THREE.SphereGeometry(1)
    this.ball1 = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshStandardMaterial({
        color: '#ff0000'
      })
    )

    this.ball2 = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshStandardMaterial({
        color: '#ff0000'
      })
    )
    this.ball2.position.x = -3

    this.ball3 = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshStandardMaterial({
        color: '#ff0000'
      })
    )
    this.ball3.position.x = 3

    this.scene.add(this.ball1)
    this.scene.add(this.ball2)
    this.scene.add(this.ball3)

    this.objectsToTest = [this.ball1, this.ball2, this.ball3]

    // raycaster
    this.raycaster = new THREE.Raycaster()

    // Cast a ray
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(1, 0, 0)
    // rayDirection.normalize()

    // this.raycaster.set(rayOrigin, rayDirection)
    // // 我们需要定义射线的起点（origin）和方向（direction），方向需要归一化(normalize)，然后使用 set 方法
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(10, 0, 0)
    // rayDirection.normalize()

    // raycaster.set(rayOrigin, rayDirection)

    // // 首先，返回的总是一个数组，即使你只是测试一个对象，这是因为一束射线可以多次穿过相同的物体。
    // const intersect = raycaster.intersectObject(ball2)
    // console.log(intersect)

    // const intersects = raycaster.intersectObjects([ball1, ball2, ball3])
    // console.log(intersects)
  }

  animate() {
    const elapsedTime = this.clock.getElapsedTime()

    // sin 函数 上下移动
    this.ball1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    this.ball2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    this.ball3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // 使用setFromCamera() 方法设置射线，它接受一个 2D 坐标和一个相机，将我们的2D坐标传入
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(this.objectsToTest)

    if (intersects.length) {
      if (this.currentIntersect == null) {
        console.log('mouse enter')
      }

      this.currentIntersect = intersects[0]
    } else {
      if (this.currentIntersect) {
        console.log('mouse leave')
      }
      this.currentIntersect = null
    }

    // const intersects = this.raycaster.intersectObjects(this.objectsToTest)

    // // 我们的小球都变成了蓝色，这是因为只要相交一次就会设置为蓝色，但是我们可以让它和射线相交时变成蓝色，其他时候都为红色，
    for (const object of this.objectsToTest) {
      object.material.color.set("#ff0000")
    }

    for (const intersect of intersects) {
      intersect.object.material.color.set("#0000ff")
    }

    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}