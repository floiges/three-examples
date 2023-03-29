import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GUI } from 'dat.gui'
import Template from '../../common/Template';
import { addAmbientLight, addDirectionalLight } from './light'
import { addAxesHelper } from '../../common/helper'
import { addOrbitControls } from '../../common/control/orbitControls'

export default class Director extends Template {
  constructor() {
    super()

    this.PCamera.fov = 75
    this.init()

    // Three.js 的光强单位是基于任意单位(arbitrary unit)的，并不反映现实世界中的值。你可能觉得没有关系，但是更好的一种做法让我们得场景使用真实标准值。
    this.renderer.physicallyCorrectLights = true

    addAmbientLight(this.scene)
    const light = addDirectionalLight(this.scene)
    addAxesHelper(this.scene)

    addOrbitControls(this.camera, this.renderer.domElement)

    this.gui = new GUI()
    this.gui.add(light, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
    this.gui.add(light.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
    this.gui.add(light.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
    this.gui.add(light.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')

    this.setup()
    this.animate()
  }

  setup() {
    const gltfLoader = new GLTFLoader()
    // const testSphere = new THREE.Mesh(
    //   new THREE.SphereGeometry(1, 32, 32),
    //   new THREE.MeshStandardMaterial()
    // )
    // this.scene.add(testSphere)

    gltfLoader.load(
      './models/FlightHelmet/glTF/FlightHelmet.gltf',
      (gltf) => {
        console.log(gltf)

        gltf.scene.scale.set(10, 10, 10)
        gltf.scene.position.set(0, -4, 0)
        gltf.scene.rotation.y = Math.PI * 0.5
        this.gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation')
        this.scene.add(gltf.scene)
      }
    )
  }

  animate() {
    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}