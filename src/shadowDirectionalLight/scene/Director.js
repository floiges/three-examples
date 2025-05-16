import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { sizes } from '../../common'
import ColorGUIHelper from '../../common/helpers/ColorGUIHelper'
import DimensionGUIHelper from '../../common/helpers/DimensionGUIHelper'
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
    this.renderer.shadowMap.enabled = true

    const fov = 45
    const aspect = 2
    const near = 0.1
    const far = 100
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    this.camera.position.set(0, 10, 20)

    this.controls = new OrbitControls(this.camera, this.canvas)
    // OrbitControls 可以围绕某一个点旋转控制相机
    this.controls.target.set(0, 5, 0)
    this.controls.update()

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('black')

    // 创建辅助坐标系
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
  }

  createObjects() {
    const loader = new THREE.TextureLoader()

    {
      const planeSize = 40
      const texture = loader.load('./images/checker.png')
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.magFilter = THREE.NearestFilter
      texture.colorSpace = THREE.SRGBColorSpace

      const repeats = planeSize / 2
      texture.repeat.set(repeats, repeats)

      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
      const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide
      })
      // 将颜色设置为1.5, 1.5, 1.5，这将是棋盘纹理的颜色倍增 1.5，1.5，1.5。
      // 也就是说纹理原本的颜色是 0x808080 和 0xC0C0C0，是灰色和浅灰色，现在灰色和浅灰色乘以 1.5 将得到白色和浅灰色的棋盘
      planeMat.color.setRGB(1.5, 1.5, 1.5)
      const mesh = new THREE.Mesh(planeGeo, planeMat)
      mesh.receiveShadow = true
      mesh.rotation.x = Math.PI * -.5
      this.scene.add(mesh)
    }

    {
      const cubeSize = 4
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
      const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' })
      const mesh = new THREE.Mesh(cubeGeo, cubeMat)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.position.set(cubeSize / 2, cubeSize / 2, 0)
      this.scene.add(mesh)
    }

    {
      const sphereRadius = 3
      const sphereWidthDivisions = 32
      const sphereHeightDivisions = 16
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
      const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' })
      const mesh = new THREE.Mesh(sphereGeo, sphereMat)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
      this.scene.add(mesh)
    }

    {
      const color = 0xFFFFFF
      const intensity = 1
      const light = new THREE.DirectionalLight(color, intensity)
      light.castShadow = true
      light.position.set(0, 10, 0)
      light.target.position.set(-4, 0, -4)
      this.scene.add(light)
      this.scene.add(light.target)

      const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
      this.scene.add(cameraHelper);

      const helper = new THREE.DirectionalLightHelper(light)
      this.scene.add(helper)

      const updateCamera = () => {
        // update the light target's matrixWorld because it's needed by the helper
        light.target.updateMatrixWorld()
        helper.update()
        // update the light's shadow camera's projection matrix
        light.shadow.camera.updateProjectionMatrix()
        // and now update the camera helper we're using to show the light's shadow camera
        cameraHelper.update()
      }
      updateCamera()

      this.gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
      this.gui.add(light, 'intensity', 0, 10, 0.01)

      {
        const folder = this.gui.addFolder('Shadow Camera')
        folder.open()
        folder.add(new DimensionGUIHelper(light.shadow.camera, 'left', 'right'), 'value', 1, 100)
          .name('width')
          .onChange(updateCamera)

        folder.add(new DimensionGUIHelper(light.shadow.camera, 'bottom', 'top'), 'value', 1, 100)
          .name('height')
          .onChange(updateCamera)

        const minMaxGUIHelper = new MinMaxGUIHelper(light.shadow.camera, 'near', 'far', 0.1)
        folder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera)
        folder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera)
        folder.add(light.shadow.camera, 'zoom', 0.01, 1.5, 0.01).onChange(updateCamera)
      }

      this.makeXYZGUI(light.position, 'position', updateCamera)
      this.makeXYZGUI(light.target.position, 'target', updateCamera)
    }
  }

  makeXYZGUI(vector3, name, onChangeFn) {
    const folder = this.gui.addFolder(name)
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn)
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn)
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn)
    folder.open()
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

    this.resizeRendererToDisplaySize(this.renderer)

    {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
      this.camera.updateProjectionMatrix()
    }

    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}
