import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { sizes } from '../../common'
import MinMaxGUIHelper from '../../common/helpers/MinMaxGUIHelper'

export default class Director {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl')
    this.gui = new GUI()
    this.view1Elem = document.querySelector('#view1');
    this.view2Elem = document.querySelector('#view2');

    this.init()
    this.createObjects()
    this.animate()
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas })
    this.camera = new THREE.PerspectiveCamera(45, 2, 5, 100)
    this.camera.position.set(0, 10, 20)

    // 只给第一个视窗中的摄像机分配OrbitControls
    this.controls = new OrbitControls(this.camera, this.view1Elem)
    // OrbitControls 可以围绕某一个点旋转控制相机
    this.controls.target.set(0, 5, 0)
    this.controls.update()

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('black')

    // 创建辅助坐标系
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    // 创建第二个相机
    this.camera2 = new THREE.PerspectiveCamera(
      60,
      2,
      0.1,
      500
    )
    this.camera2.position.set(40, 10, 30)
    this.camera2.lookAt(0, 5, 0)

    const controls2 = new OrbitControls(this.camera2, this.view2Elem)
    controls2.target.set(0, 5, 0)
    controls2.update()

    const cameraHelper = new THREE.CameraHelper(this.camera)
    this.scene.add(cameraHelper)
    this.cameraHelper = cameraHelper
  }

  createObjects() {
    this.gui.add(this.camera, 'fov', 1, 180)
    const minMaxGUIHelper = new MinMaxGUIHelper(this.camera, 'near', 'far', 0.1)
    this.gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near')
    this.gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far')

    {
      const planeSize = 40
      const loader = new THREE.TextureLoader()
      const texture = loader.load('./images/checker.png')
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.magFilter = THREE.NearestFilter
      // texture.colorSpace = THREE.SRGBColorSpace

      const repeats = planeSize / 2
      texture.repeat.set(repeats, repeats)

      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
      const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(planeGeo, planeMat)
      mesh.rotation.x = Math.PI * -.5
      this.scene.add(mesh)
    }

    {
      const cubeSize = 4
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
      const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' })
      const mesh = new THREE.Mesh(cubeGeo, cubeMat)
      mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
      this.scene.add(mesh)
    }

    {
      const sphereRadius = 3
      const sphereWidthDivisions = 32
      const sphereHeightDivisions = 16
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
      const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' })
      const mesh = new THREE.Mesh(sphereGeo, sphereMat)
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
      this.scene.add(mesh)
    }

    {
      const color = 0xFFFFFF
      const intensity = 1
      const light = new THREE.DirectionalLight(color, intensity)
      light.position.set(0, 10, 0)
      light.target.position.set(-5, 0, 0)
      this.scene.add(light)
      this.scene.add(light.target)
    }
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

  updateCamera() {
    this.camera.updateProjectionMatrix()
  }

  // 使用剪刀功能从每个摄影机的视角渲染场景，以仅渲染画布的一部分。
  // 这个函数接受一个元素，计算这个元素在canvas上的重叠面积，这将设置剪刀函数和视角长宽并返回 aspect
  setScissorForElement(elem) {
    const canvasRect = this.canvas.getBoundingClientRect()
    const elemRect = elem.getBoundingClientRect()

    // compute a canvas relative rectangle
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left
    const left  = Math.max(0, elemRect.left - canvasRect.left)
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top
    const top = Math.max(0, elemRect.top - canvasRect.top)

    const width = Math.min(canvasRect.width, right - left)
    const height = Math.min(canvasRect.height, bottom - top)

    // setup the scissor to only render to that part of the canvas
    const positiveYUpBottom = canvasRect.height - bottom
    this.renderer.setScissor(left, positiveYUpBottom, width, height)
    this.renderer.setViewport(left, positiveYUpBottom, width, height)

    // return the aspect
    return width / height
  }

  animate() {
    // if (this.resizeRendererToDisplaySize(this.renderer)) {
    //   this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
    //   this.camera.updateProjectionMatrix()
    // }
    this.resizeRendererToDisplaySize(this.renderer)

    // 启用剪刀函数
    this.renderer.setScissorTest(true)

    {
      // 渲染主视野
      const aspect = this.setScissorForElement(this.view1Elem)

      // 用计算出的 aspect 设置相机参数
      this.camera.aspect = aspect
      this.camera.updateProjectionMatrix()
      this.cameraHelper.update()

      // 来原视野中不要绘制cameraHelper
      this.cameraHelper.visible = false
      this.scene.background.set(0x000000)

      this.renderer.render(this.scene, this.camera)
    }

    {
      // 渲染第二台相机
      const aspect = this.setScissorForElement(this.view2Elem);

      // 调整aspect
      this.camera2.aspect = aspect;
      this.camera2.updateProjectionMatrix();

      // 在第二台摄像机中绘制cameraHelper
      this.cameraHelper.visible = true;

      this.scene.background.set(0x000040);

      this.renderer.render(this.scene, this.camera2);
    }

    requestAnimationFrame(this.animate.bind(this))
  }
}