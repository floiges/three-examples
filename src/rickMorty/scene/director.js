import * as THREE from 'three'
import * as dat from 'dat.gui'
// 加载经过压缩的人物模型
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import Template from '../../common/Template'
import { addAmbientLight, addDirectionalLight } from './light'
import { addOrbitControls } from '../control/orbitControls'
import Portals from '../objects/Portals'
import { Clock, Color, LoadingManager, Vector2 } from 'three'
import { sizes } from '../../common'
import { options } from '../objects/options'

export default class Director extends Template {
  constructor() {
    super()

    this.PCamera.fov = 75
    this.PCamera.near = 0.1
    this.PCamera.far = 10000
    this.cameraPosition = new THREE.Vector3(0, 1, 5)
    this.rendererColor = new Color(0xffffff, 0)

    this.init({
      antialias: true,
      alpha: true
    })

    this.renderer.autoClear = false
    this.renderer.setClearAlpha(0)
    this.renderer.physicallyCorrectLights = true
    this.renderer.toneMapping = THREE.ReinhardToneMapping
    this.renderer.toneMappingExposure = 2

    addDirectionalLight(this.scene)
    addAmbientLight(this.scene)

    this.controls = addOrbitControls(this.camera, this.renderer.domElement)

    this.addPortals()
    this.addRenderPass()
    this.addGUI()
    this.addModel()

    this.clock = new Clock()

    this.animate()
  }

  addPortals() {
    const portals = new Portals(8, 8, 1, 1)
    portals.addToScene(this.scene)
    this.portals = portals
  }

  addRenderPass() {
    // 该通道会在当前场景和摄像机的基础上渲染出一个新场景
    const renderScene = new RenderPass(this.scene, this.camera)
    // 4个参数
    // 1、作用范围
    // 2、光晕强度
    // 3、光晕半径
    // 4、光晕阈值 值越小，效果越明显
    // 一个 BloomPass 将它的输入放入一个通常来说更小的 render target 然后对这个结果的表面进行模糊处理，使得场景产生辉光效果。
    const bloomPass = new UnrealBloomPass(new Vector2(sizes.width, sizes.height), 1.5, .4, .85)
    bloomPass.threshold = options.bloomThreshold
    bloomPass.strength = options.bloomStrength
    bloomPass.radius = options.bloomRadius

    const bloomComposer = new EffectComposer(this.renderer)
    // 为了在屏幕上渲染后期处理效果，需要将 EffectComposer 的 renderToScreen 属性设置为 true
    bloomComposer.renderToScreen = true
    bloomComposer.addPass(renderScene)
    bloomComposer.addPass(bloomPass)
    this.bloomComposer = bloomComposer
  }

  addGUI() {
    const gui = new dat.GUI();
    const bloom = gui.addFolder('bloom');
    bloom.add(options, 'bloomStrength', 0.0, 5.0).name('bloomStrength').listen();
    bloom.add(options, 'bloomRadius', .1, 2.0).name('bloomRadius').listen();
    bloom.open();
    const colors = gui.addFolder('Colors');
    colors.addColor(options, 'color0').name('layer0');
    colors.addColor(options, 'color1').name('layer1');
    colors.addColor(options, 'color2').name('layer2');
    colors.addColor(options, 'color3').name('layer3');
    colors.addColor(options, 'color4').name('layer4');
    colors.addColor(options, 'color5').name('layer5');
    colors.open();
  }

  addModel() {
    const loadingManager = new LoadingManager()
    loadingManager.onLoad = () => {}

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./images/rickMorty/draco/')
    dracoLoader.setDecoderConfig({ type: 'js' })
    const loader = new GLTFLoader(loadingManager)
    loader.setDRACOLoader(dracoLoader)

    this.model = null
    // 从网上下载一个免费的瑞克与莫蒂 3D 模型，然后在 Blender 中删除模型多余的部分并转化成 Three.js 支持的 .glb 格式压缩导出。
    // 经过压缩的模型，从原来的 50M 左右变为 2M 左右，有利于节省空间、提高页面加载运行性能。
    // 可从 sketchfab.com 上下载模型
    loader.load('./images/rickMorty/models/rickAndMorty.glb', mesh => {
      if (mesh.scene) {
        mesh.scene.scale.set(.02, .02, .02)
        mesh.scene.position.x = -.5
        mesh.scene.rotation.y = Math.PI
        // 记得要将模型层级设置成与传送门不同的层级，以避免被设置辉光效果
        mesh.scene.layers.set(0)
        this.scene.add(mesh.scene)
        this.model = mesh.scene
      }
    })
  }

  animate(deltaTime) {
    this.portals.updateShaderMaterial(deltaTime)

    // 传送门所在层级
    this.renderer.clear()
    this.camera.layers.set(1)
    this.bloomComposer.render()

    // 模型所在层级
    // 清除深度缓冲区，将摄像机设置为与模型相同的层级，最后再渲染场景和相机
    this.renderer.clearDepth()
    this.camera.layers.set(0)

    this.renderer.render(this.scene, this.camera)

    const elapsedTime = this.clock.getElapsedTime()
    const ghostAngle = elapsedTime * 0.5
    if (this.model) {
      this.model.rotation.x = Math.cos(ghostAngle) * .2
      this.model.rotation.z = Math.sin(ghostAngle) * .1
      this.model.position.z += Math.cos(ghostAngle) * .005
    }

    const scale = Math.cos(ghostAngle) * 2 + 3
    if (this.portals) {
      this.portals.instance.scale.set(scale, scale, scale)
    }

    this.controls && this.controls.update()
    requestAnimationFrame(this.animate.bind(this))
  }
}