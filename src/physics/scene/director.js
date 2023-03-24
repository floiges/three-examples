import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import Template from '../../common/Template';
import { addAmbientLight, addDirectionalLight } from './light'
import { addOrbitControls } from '../../common/control/orbitControls'
import { addAxesHelper } from '../../common/helper'
import Ground from '../objects/Ground'
import { Gui } from '../tools/gui'

export default class Director extends Template {
  constructor() {
    super()

    this.PCamera.fov = 75
    this.cameraPosition = new THREE.Vector3(5, 4, 5)

    this.init()

    // 开启阴影
    this.renderer.shadowMap.enabled = true

    addAmbientLight(this.scene)
    addDirectionalLight(this.scene)

    addOrbitControls(this.camera, this.renderer.domElement)
    addAxesHelper(this.scene)

    this.parameters = Gui({
      onFinishChange: this.onGuiChange.bind(this),
      createShape: () => {
        this.createSphere(
          Math.random() *  0.5,
          {x: (Math.random() - 0.5) * 3, y: 3, z: (Math.random() - 0.5) * 3}
        )
      },
      createBox: () => {
        this.createBox(
          Math.random(),
          Math.random(),
          Math.random(),
          { x: (Math.random() - 0.5) * 3, y: 3, z: (Math.random() - 0.5) * 3 }
        )
      },
      reset: () => {
        for (const object of this.objectsToUpdate) {
          // object.body.removeEventListener('collide')
          this.world.removeBody(object.body)
          this.scene.remove(object.mesh)
        }
      }
    })

    this.clock = new THREE.Clock()
    this.lastElapsedTime = 0

    this.defaultMaterial = new CANNON.Material('default')
    this.objectsToUpdate = []

    this.sphereGeometry = new THREE.SphereGeometry(1, 20, 20),
    this.sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      color: '#fff'
      // envMap:
    })

    this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
    this.boxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      color: '#fff'
    })

    this.addGround()
    // this.addBall()
    this.addPhysicsWorld()
    this.createSphere(0.5, { x: 0, y: 3, z: 0 })

    this.animate()
  }

  addGround() {
    const ground = new Ground(20, 20, 1)
    ground.setRotation(-Math.PI / 2, 0, 0)
    ground.addToScene(this.scene)

    this.groundMaterial = ground.groundMaterial
  }

  addBall() {
    const ball = new Ball()
    ball.addToScene(this.scene)
    this.ball = ball.instance
  }

  addPhysicsWorld() {
    // create 物理世界
    this.world = new CANNON.World()
    this.cannonDebugger = new CannonDebugger(this.scene, this.world, {
      // options...
    })
    // 添加重力
    this.world.gravity.set(0, -9.82, 0) //
    // 当我们在检测物体间的碰撞时，一个朴素的方法检测每个 Body 和其他Body 的碰撞，但是这对性能是不好的。这个检测碰撞的过程就是 Broadphase，
    // NaiveBroadphase 是默认的，推荐切换到性能更好的SAPBroadphase
    this.world.broadphase = new CANNON.SAPBroadphase(this.world)

    // 即使我们使用了更好的 broadphase 算法，所有的body 仍会被检测，即使它们不再移动了。
    // 当 Body 速度很低时，Body 可以进入睡眠状态，除非有足够大的力被施加，否则不会进行检测碰撞。
    this.world.allowSleep = true

    // 通过创建 Material 材料改变摩擦力和弹性
    const concretePlasticContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7
      }
    )
    this.world.addContactMaterial(concretePlasticContactMaterial)

    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body({
      material: this.defaultMaterial
    })
    // 平面会保持静止状态
    floorBody.mass = 0
    floorBody.addShape(floorShape)
    this.world.addBody(floorBody)
    // 默认情况下，平面的法向量是(0，0，1)。如果我们想让它朝向其他方向，我们必须改变实体的方向
    // 物理世界中的平面是竖直的,需要
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
  }

  createSphere(radius, position) {
    // threejs mesh
    const mesh = new THREE.Mesh(
      this.sphereGeometry,
      this.sphereMaterial
    )

    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    this.scene.add(mesh)

    // cannon's body
    // 创建一个shape，物理世界中球体半径和 Three.js 中的需要保持一致
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
      material: this.defaultMaterial
    })
    body.position.copy(position)
    this.world.addBody(body)

    // 施加一个力
    // 小球从高空落下，并且向x正方向走去。
    // body.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))

    this.objectsToUpdate.push({
      mesh,
      body
    })
  }

  createBox(width, height, depth, position) {
    const mesh = new THREE.Mesh(this.boxGeometry, this.boxMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    this.scene.add(mesh)

    // 在Cannon.js是从中心计算长宽高的
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2))
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
      material: this.defaultMaterial
    })
    body.position.copy(position)
    // 我们可以监听 Body 的事件，比如colide，sleep，wakeup
    // body.addEventListener('collide', (collision) => {
    //   const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    //   if (impactStrength > 1.5) {
    //     console.log('collide')
    //   }
    // })
    this.world.addBody(body)

    this.objectsToUpdate.push({
      mesh,
      body
    })
  }

  onGuiChange() {
    this.groundMaterial.color = new THREE.Color(this.parameters.groundColor)
  }

  animate() {
    const elapsedTime = this.clock.getElapsedTime()
    const deltaTime = elapsedTime - this.lastElapsedTime
    this.lastElapsedTime = elapsedTime

    // 在更新物理世界前，我们可以通过applyForce() 模拟风的感觉
    // this.sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), this.sphereBody.position)
    // 小球从高空落下，并且向x正方形走去，由于风的作用，小球最终向-x方向滚走
    // 更新物理世界
    this.world.step(1 / 60, deltaTime, 3)
    // 更新 threejs 场景中的球体
    for (const object of this.objectsToUpdate) {
      object.mesh.position.copy(object.body.position)
      // 更新旋转
      object.mesh.quaternion.copy(object.body.quaternion)
    }

    this.cannonDebugger.update()
    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}