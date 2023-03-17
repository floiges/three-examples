import { Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { addResizeEventListener, sizes } from '.'

export default class Template {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl')
    this.PCamera = {
      fov: 45,
      aspect: sizes.width / sizes.height,
      near: 1,
      far: 1000
    }
    this.cameraPosition = new Vector3(0, 0, 1)
    this.cameraLookAt = new Vector3(0, 0, 0)
    this.rendererColor = new Color(0x000000)
  }

  initScene() {
    this.scene = new Scene()
  }

  initPerspectiveCamera() {
    this.camera = new PerspectiveCamera(
      this.PCamera.fov,
      this.PCamera.aspect,
      this.PCamera.near,
      this.PCamera.far
    )
    this.camera.position.copy(this.cameraPosition)
    this.camera.lookAt(this.cameraLookAt)
    this.scene.add(this.camera)
  }

  initRenderer(parameters = {}) {
    this.renderer = new WebGLRenderer({ canvas: this.canvas, ...parameters });
    this.renderer.setSize(sizes.width, sizes.height);
    // 设置 canvas 的像素比为当前的屏幕像素比，避免高分屏下出现模糊情况
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(this.rendererColor)
  }

  init(parameters = {}) {
    this.initScene()
    this.initPerspectiveCamera()
    this.initRenderer(parameters)
    addResizeEventListener(this.renderer, this.camera)
  }
}