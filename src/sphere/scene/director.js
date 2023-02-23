import { CubeCamera, LinearMipMapLinearFilter, RGBAFormat, Vector3, WebGLCubeRenderTarget } from 'three'
import Template from '../../common/Template'
import { addOrbitControls } from '../../common/control/orbitControls'
import { initBox } from '../objects/Box'
import { initSphere } from '../objects/Sphere'

export default class Director extends Template {
  constructor() {
    super()

    this.PCamera.fov = 65
    this.cameraPosition = new Vector3(0, 40, 100)

    this.init()

    addOrbitControls(this.camera, this.renderer.domElement)

    // init cubeCamera
    // 实时反射任何物体
    // cubeCamera会构造一个包含6个PerspectiveCameras（透视摄像机）的立方摄像机， 并将其拍摄的场景渲染到一个WebGLCubeRenderTarget上
    // 可以使用cubeCamera实时为场景中的物体拍摄照片，然后使用这些实时照片创建纹理。将这些纹理作为球体的环境贴图（envMap）就可以模拟实时的反射了
    const cubeRenderTarget = new WebGLCubeRenderTarget(128, {
      format: RGBAFormat,
      generateMipmaps: true,
      minFilter: LinearMipMapLinearFilter
    })
    // //1：近剪切面的距离；1000：远剪切面的距离；cubeRenderTarget:将要创建的纹理对象
    this.cubeCamera = new CubeCamera(1, 100, cubeRenderTarget)
    this.cubeCamera.position.set(0, 0, 0)
    this.scene.add(this.cubeCamera)

    initBox(this.scene)
    initSphere(this.scene, this.cubeCamera)

    this.animate()
  }

  animate() {
    this.renderer.render(this.scene, this.camera)
    this.cubeCamera.update(this.renderer, this.scene)
    requestAnimationFrame(this.animate.bind(this))
  }
}