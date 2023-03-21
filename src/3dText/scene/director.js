import * as THREE from 'three'
import Template from '../../common/Template'
import { addOrbitControls } from '../../common/control/orbitControls'
import { addAxesHelper } from '../../common/helper'
import { addDirectionalLight, addAmbientLight } from './light'
import HelloText from '../objects/HelloText'

export default class Director extends Template {
  constructor() {
    super()

    this.PCamera.fov = 75
    this.cameraPosition = new THREE.Vector3(0, 0, 5)
    this.init()

    addDirectionalLight(this.scene)
    addAmbientLight(this.scene)

    this.controls = addOrbitControls(this.camera, this.renderer.domElement)

    addAxesHelper(this.scene)

    this.addHelloText()
    this.addDonuts()

    this.animate()
  }

  addHelloText() {
    this.text = new HelloText(this.scene)
  }

  addDonuts() {
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: this.text.matcapTexture })
    for (let i = 0; i < 100; i++) {
      const donut = new THREE.Mesh(donutGeometry, donutMaterial)

      donut.position.x = (Math.random() - 0.5) * 10
      donut.position.y = (Math.random() - 0.5) * 10
      donut.position.z = (Math.random() - 0.5) * 10

      donut.rotation.x = Math.random() * Math.PI
      donut.rotation.y = Math.random() * Math.PI

      const scale = Math.random()
      donut.scale.x = scale
      donut.scale.y = scale
      donut.scale.z = scale
      this.scene.add(donut)
    }
  }

  animate() {
    this.renderer.render(this.scene, this.camera)

    this.controls && this.controls.update()
    requestAnimationFrame(this.animate.bind(this))
  }
}