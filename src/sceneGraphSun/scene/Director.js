import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import AxesGridHelper from '../../common/helpers/AxesGridHelper'
import { addResizeEventListener, resizeRendererToDisplaySize } from '../../common'

export default class Director {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl')

    this.objects = []
    this.gui = new GUI()

    this.init()

    this.createObjects()

    this.animate()
  }

  init() {
    this.initPerspectiveCamera()
    this.initScene()
    this.initRenderer()
    this.addPointLight()

    resizeRendererToDisplaySize(this.renderer, this.camera)
    addResizeEventListener(this.renderer, this.camera)
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas })
  }

  /**
   * 为了便于观察，我们要把摄像头放在原点的正上方向下看。
   * 最简单的方法是使用 lookAt 函数。
   * lookAt 函数让摄像机从它的位置“看向”我们传递 lookAt 的位置。
   * 在这样做之前，我们需要告诉摄像机的顶部朝向哪个方向，或者说哪个方向是摄像机的 "上"。
   * 对于大多数情况来说，正 Y 是向上的就足够了，但是由于我们是直视下方，我们需要告诉摄像机正 Z 是向上的。
   */
  initPerspectiveCamera() {
    const fov = 75
    const aspect = 2
    const near = 0.1
    const far = 1000

    this.camera = new THREE.PerspectiveCamera(
      fov,
      aspect,
      near,
      far
    )
    this.camera.position.set(0, 50, 0)
    this.camera.up.set(0, 0, 1)
    this.camera.lookAt(0, 0, 0)
  }

  initScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xAAAAAA)
  }

  addPointLight() {
    const color = 0xffffff
    const intensity = 3
    const light = new THREE.PointLight(color, intensity)
    this.scene.add(light)
  }

  createObjects() {
    const radius = 1
    const widthSegments = 6
    const heightSegments = 6
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    )

    // 空节点，只用来代表一个局部空间
    const solarSystem = new THREE.Object3D()
    this.scene.add(solarSystem)
    this.objects.push(solarSystem)


    // emissive 不受其他光照影响的固有颜色
    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 })
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
    sunMesh.scale.set(5, 5, 5)
    // this.scene.add(sunMesh)
    solarSystem.add(sunMesh)
    this.objects.push(sunMesh)



    const earthOrbit = new THREE.Object3D()
    earthOrbit.position.x = 10
    solarSystem.add(earthOrbit)
    this.objects.push(earthOrbit)


    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244
    })
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
    // 父对象 earthOrbit 已经设置过，这里不用设置了
    // earthMesh.position.x = 10
    // this.scene.add(earthMesh)
    earthOrbit.add(earthMesh)
    /**
     * 如果让 earthMesh 成为 sunMesh 的一个子节点。
     * sunMesh.scale.set(5, 5, 5) 将其比例设置为 5x。
     * 这意味着 sunMesh 的局部空间是 5 倍大。
     * 这表示地球现在大了 5 倍，它与太阳的距离 ( earthMesh.position.x = 10 ) 也是 5 倍。
     */
    // this.sunMesh.add(earthMesh)
    // solarSystem.add(earthMesh)
    this.objects.push(earthMesh)

    const moonOrbit = new THREE.Object3D()
    moonOrbit.position.x = 2
    earthOrbit.add(moonOrbit)

    const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 })
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
    moonMesh.scale.set(.5, .5, .5)
    moonOrbit.add(moonMesh)
    this.objects.push(moonMesh)


    // this.objects.forEach(node => {
    //   const axes = new THREE.AxesHelper()
    //   // 希望轴在球体内部也能出现
    //   axes.material.depthTest = false
    //   // 在所有球体之后被绘制。否则一个球体可能会画在它们上面，把它们遮住
    //   axes.renderOrder = 1
    //   node.add(axes)
    // })

    this.makeAxesGrid(solarSystem, 'solarSystem', 26)
    this.makeAxesGrid(sunMesh, 'sunMesh')
    this.makeAxesGrid(earthOrbit, 'earthOrbit')
    this.makeAxesGrid(earthMesh, 'earthMesh')
    this.makeAxesGrid(moonOrbit, 'moonOrbit')
    this.makeAxesGrid(moonMesh, 'moonMesh')
  }

  makeAxesGrid(node, label, units) {
    const helper = new AxesGridHelper(node, units)
    this.gui.add(helper, 'visible').name(label)
  }

  resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {
			renderer.setSize( width, height, false );
		}

		return needResize;
	}

  animate(time) {
    time *= 0.001

    this.objects.forEach((obj) => {
      obj.rotation.y = time
    })


    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}