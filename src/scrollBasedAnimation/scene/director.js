import * as THREE from 'three'
import gsap from 'gsap'
import Template from '../../common/Template';
import { addDirectionalLight } from './light'
import { Gui } from '../tools/gui'
import { sizes } from '../../common';

export default class Director extends Template {
  constructor() {
    super()

    this.PCamera.fov = 35
    this.PCamera.near = 0.1
    this.PCamera.far = 100
    this.cameraPosition.z = 6
    this.init({
      alpha: true
    })

    this.clock = new THREE.Clock()
    this.previousTime = 0
    this.currentSection = 0
    this.scrollY = window.scrollY

    // 通过让相机根据鼠标的运动而垂直和水平移动而应用视差效果。
    this.cursor = {
      x: 0,
      y: 0
    }

    this.parameters = Gui(this.onGuiFinishChange.bind(this))

    this.addCameraGroup()
    this.addMeshes()
    this.addParticles()

    // addAmbientLight(this.scene)
    addDirectionalLight(this.scene)

    window.addEventListener('scroll', this.onScoll.bind(this))
    window.addEventListener('mousemove', this.onMouseMove.bind(this))

    this.animate()
  }

  addParticles() {
    // 一个增加沉浸感的方式是添加一些不同深度的粒子，从而让用户感知到深度。
    const particlesCount = 200
    const positions = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10
      // 对于垂直轴y，让它从最开始的位置到最后一个Meshes都有分布
      positions[i * 3 + 1] = this.objectsDistance * 0.5 - Math.random() * this.objectsDistance * this.sectionMeshes.length
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }

    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    this.particlesMaterial = new THREE.PointsMaterial({
      color: this.parameters.materialColor,
      sizeAttenuation: true,
      size: 0.03
    })

    const particles = new THREE.Points(particlesGeometry, this.particlesMaterial)
    this.scene.add(particles)
  }

  addCameraGroup() {
    this.cameraGroup = new THREE.Group()
    this.cameraGroup.add(this.camera)

    this.scene.add(this.cameraGroup)
  }

  addMeshes() {
    this.objectsDistance = 4

    const textureLoader = new THREE.TextureLoader()
    // 我们的梯度图像由三个像素组成，但是 WebGL 会尝试融合它们，而不是在三个像素中选择一个。
    // 我们需要将纹理的 magFilter 设置为 NearestFilter，当光线强度在像素之间时，WebGL 会选择最近的那个纹理
    const gradientTexture = textureLoader.load('./images/gradient/3.jpg')
    gradientTexture.magFilter = THREE.NearestFilter
    // 默认情况下，MeshToonMaterial 在有光照的部分会显示一个亮色，在无光照的部分会显示一个暗色，我们可以通过梯度纹理来提升它。
    this.material = new THREE.MeshToonMaterial({
      color: this.parameters.materialColor,
      gradientMap: gradientTexture
    })

    this.mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      this.material
    )

    this.mesh2 = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 32),
      this.material
    )

    this.mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      this.material
    )

    this.mesh1.position.y = -this.objectsDistance
     * 0
    this.mesh2.position.y = -this.objectsDistance
     * 1
    this.mesh3.position.y = -this.objectsDistance
     * 2

    this.scene.add(this.mesh1, this.mesh2, this.mesh3)

    this.sectionMeshes = [this.mesh1, this.mesh2, this.mesh3]
  }

  onGuiFinishChange() {
    this.material.color.set(this.parameters.materialColor)
    this.particlesMaterial.color.set(this.parameters.materialColor)
  }

  onScoll() {
    this.scrollY = window.scrollY

    const newSection = Math.round(this.scrollY / sizes.height)

    if (newSection != this.currentSection) {
      this.currentSection = newSection

      gsap.to(this.sectionMeshes[this.currentSection].rotation, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=6',
        y: '+=3'
      })
    }
  }

  onMouseMove(event) {
    // x和y的大小取决于视窗的大小，使用不同分辨率的用户会有不同的结果，
    // 所以，我们需要归一化这些值（从0到1），通过除以视窗的大小
    // 更好的做法是，将x和y的值放置于 [-0.5, 0.5] 的区间
    this.cursor.x = event.clientX / sizes.width - 0.5
    this.cursor.y = event.clientY / sizes.height - 0.5
  }

  animate() {
    const elapsedTime = this.clock.getElapsedTime()
    const deltaTime = elapsedTime - this.previousTime
    this.previousTime = elapsedTime

    this.camera.position.y = -this.scrollY / sizes.height * this.objectsDistance

    // 降低视差效果的幅度，这样物体不至于移动的太多
    const parallaxX = this.cursor.x * 0.5
    const parallaxY = -this.cursor.y * 0.5
    // 由于我们更新了 camera.position.y 两次，第二次将第一次覆盖掉了，为了修复这个问题，我们可以将相机放入 Group 中，然后对组施加视差效果，而不是相机本身
    // 现在的视差有一点机械不是很真实，我们将加入一下 easing (也叫 smoothing 或 lerping)，然后我们将使用一个著名的公式.
    // 在每一帧中，我们将移动1/10到目的地的距离，而不是直接移动到目标，所以离目标越近，移动的也就越慢。
    this.cameraGroup.position.x += (parallaxX - this.cameraGroup.position.x) / 20
    this.cameraGroup.position.y += (parallaxY - this.cameraGroup.position.y) / 20

    for (const mesh of this.sectionMeshes) {
      mesh.rotation.x += deltaTime * 0.1
      mesh.rotation.y += deltaTime * 0.12
    }

    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}