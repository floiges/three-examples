import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { sizes } from '../../common'
import MinMaxGUIHelper from '../../common/helpers/MinMaxGUIHelper'

export default class Director {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl')
    this.gui = new GUI()

    this.init()
    this.createObjects()
    this.animate()
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas })

    const left = 0
    const right = 300
    const top = 0
    const bottom = 150
    const near = -1
    const far = 1
    // 正交摄像机 OrthographicCamera，
    // 和指定一个视锥不同的是，它需要设置left，right top，bottom，near，和far指定一个长方体，使得视野是平行的而不是透视的
    this.camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far)
    // 用zoom属性来调整相机到底展现多少的单位大小
    this.camera.zoom = 1
    // this.camera.position.set(0, 10, 20)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('black')

    // 创建辅助坐标系
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
  }

  createObjects() {
    const loader = new THREE.TextureLoader()
    const textures = [
      loader.load('./images/flower-1.jpg'),
      loader.load('./images/flower-2.jpg'),
      loader.load('./images/flower-3.jpg'),
      loader.load('./images/flower-4.jpg'),
      loader.load('./images/flower-5.jpg'),
      loader.load('./images/flower-6.jpg'),
    ]
    this.planeSize = 256
    const planeGeo = new THREE.PlaneGeometry(this.planeSize, this.planeSize)
    this.planes = textures.map(texture => {
      // 把每一个平面绑定到父对象THREE.Object3D上，以便调整每个平面和左上角原点的相对关系
      const planePivot = new THREE.Object3D()
      this.scene.add(planePivot)
      texture.magFilter = THREE.NearestFilter
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      })
      const mesh = new THREE.Mesh(planeGeo, planeMat)
      planePivot.add(mesh)
      // move plane so top left corner is origin
      mesh.position.set(this.planeSize / 2, this.planeSize / 2, 0)
      return planePivot
    })
  }

  resizeRendererToDisplaySize( renderer ) {
		const canvas = renderer.domElement;
    const width = sizes.width
    const height = sizes.height
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {
			renderer.setSize( width, height, false );
		}
		return needResize;
	}

  animate(time) {
    time *= 0.001 // convert to seconds

    if (this.resizeRendererToDisplaySize(this.renderer)) {
      this.camera.right = this.canvas.width
      this.camera.bottom = this.canvas.height
      this.camera.updateProjectionMatrix()
    }

    const distAcross = Math.max(20, this.canvas.width - this.planeSize)
    const distDown = Math.max(20, this.canvas.height - this.planeSize)

    // total distance to move across and back
    const xRange = distAcross * 2
    const yRange = distDown * 2
    const speed = 180

    this.planes.forEach((plane, ndx) => {
      // compute a unique time for each plane
      const t = time * speed + ndx * 300
      // get a value between 0 and range
      const xt = t % xRange
      const yt = t % yRange

      // set our position going forward if 0 to half of range
      // and backward if half of range to range
      const x = xt < distAcross ? xt : xRange - xt
      const y = yt < distDown ? yt : yRange - yt

      plane.position.set(x, y, 0)
    })

    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}