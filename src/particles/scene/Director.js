import * as THREE from 'three'
import { addOrbitControls } from '../../common/control/orbitControls';
import Template from '../../common/Template';
import { addAmbientLight, addDirectionalLight } from './light'
import { addAxesHelper } from '../../common/helper'

export default class Director extends Template {
  constructor() {
    super()

    this.init()

    addAmbientLight(this.scene)
    addDirectionalLight(this.scene)

    addOrbitControls(this.camera, this.renderer.domElement)
    addAxesHelper(this.scene)

    this.count = 5000
    this.addParticle()

    this.clock = new THREE.Clock()

    this.animate()
  }

  addParticle() {
    // 第一种：创建一个 SphereGeometry，指定其半径和细分网格数量，几何体的每一个顶点都会变成一个粒子
    // const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)

    // 第二种：自定义几何体
    const particlesGeometry = new THREE.BufferGeometry()

    // 每个 vertex 有三个 points
    const positions = new Float32Array(this.count * 3)
    const colors = new Float32Array(this.count * 3)
    for (let i = 0; i < this.count * 3; i++) {
      // x, y, z 属于 [-5, 5] 区间
      positions[i] = (Math.random() - 0.5) * 10
      colors[i] = Math.random()
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    this.particlesGeometry = particlesGeometry

    // 创建一个 PointsMaterial 点材质，size 属性控制着粒子的小大，sizeAttenuation 属性指定了远处的粒子应该比近处的粒子更小。
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      sizeAttenuation: true
    })

    // 修改 particlesMaterial 的 color
    // particlesMaterial.color = new THREE.Color('#ff88cc')
    particlesMaterial.vertexColors = true

    const textureLoader = new THREE.TextureLoader()
    const particleTexture = textureLoader.load('./images/symbol_01.png')

    // particlesMaterial.map = particleTexture

    // 粒子的黑色的纹理部分挡住了后方的粒子，所以我们需要激活透明度并且使用 alphaMap 属性，
    particlesMaterial.alphaMap = particleTexture
    particlesMaterial.transparent = true

    // 然后，有一些粒子的边缘挡住了后方的粒子，而有些粒子的边缘则没有挡住，
    // 这是因为粒子是按照它们被创建的顺序绘制的，所以 WebGL 并不知道哪个粒子会在哪个粒子的前面，有几个办法来解决这个问题，

    // 我们可以设置 alphaTest 透明度测试，
    // particlesMaterial.alphaTest = 0.001

    // 我们还可以设置 depthTest，
    // 片元（Fragment）在绘制过程中，会将像素的深度值与当前深度缓冲区中的值进行比较，
    // 如果大于等于深度缓冲区中值，则丢弃这部分;否则利用这个像素对应的深度值和颜色值，分别更新深度缓冲区和颜色缓冲区。
    // 这一过程称之为深度测试(Depth Test)
    // particlesMaterial.depthTest = false
    // 已经绘制的元素的深度被存储在深度缓冲区（depth buffer）中，除了完全关闭 depthTest，我们还可以告诉 WebGL 不用将粒子的深度信息写入缓冲区（depthWrite）。
    // particlesMaterial.depthWrite = false
    // 设置 blending 属性，我们可以告诉 WebGL 将颜色添加在已经绘制的颜色之上，并且将粒子数量提升一个数量级，
    // particlesMaterial.blending = THREE.AdditiveBlending

    // 实例化一个 Points 类，将几何体和材质传入，并将 Points 实例加入到场景中
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    this.scene.add(particles)

    // 然而，取消 depthTest 会导致其他 bug，如果在你的场景中有其他物体或者其他颜色的粒子，
    // 关闭 depthTest 后，WebGL 不会计算深度，所以我们可以看见在方块之后的心心。
    // const cube = new THREE.Mesh(
    //   new THREE.BoxGeometry(),
    //   new THREE.MeshBasicMaterial()
    // )
    // this.scene.add(cube)
  }

  animate() {
    const elapsedTime = this.clock.getElapsedTime()

    // Update particles
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3
      const x = this.particlesGeometry.attributes.position.array[i3 + 0]
      this.particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    this.particlesGeometry.attributes.position.needsUpdate = true

    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}