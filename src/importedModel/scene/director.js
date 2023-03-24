import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Template from '../../common/Template';
import { addAmbientLight, addDirectionalLight } from './light'
import { addAxesHelper } from '../../common/helper'
import { addOrbitControls } from '../../common/control/orbitControls'

export default class Director extends Template {
  constructor() {
    super()

    this.PCamera.fov = 75
    this.cameraPosition = new THREE.Vector3(5, 4, 5)
    this.init()

    addAmbientLight(this.scene)
    addDirectionalLight(this.scene)

    addOrbitControls(this.camera, this.renderer.domElement)
    addAxesHelper(this.scene)

    this.setup()

    this.animate()
  }

  setup() {
    const groundGeometry = new THREE.PlaneGeometry(20, 20, 1)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: '#433d3d'
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    this.scene.add(ground)

    const gltfLoader = new GLTFLoader()
    // gltfLoader.load('./models/Duck/glTF/Duck.gltf',
    //   (gltf) => {
    //     console.log(gltf)
    //     // 将 scene 的children 加入到场景中，然后忽略 PerspectiveCamera
    //     this.scene.add(gltf.scene.children[0])
    //   },
    //   (progress) => {
    //     console.log("success")
    //     // console.log(progress)
    //   },
    //   (error) => {
    //       console.log("error")
    //       console.log(error)
    //   }
    // )
    gltfLoader.load('./models/Fox/glTF/Fox.gltf',
      (gltf) => {
        this.scene.add(gltf.scene)
        gltf.scene.scale.set(0.025, 0.025, 0.025)

        // 在 gltf 对象中，animations 属性由很多个 AnimationClip 组成，我们需要创建AnimationMixer，它是一个播放器，可以包含一个或多个AnimationClips
        this.mixer = new THREE.AnimationMixer(gltf.scene)
        // 将一个 AnimationClips 添加到mixer 中，方法将返回 AnimationAction
        const action = this.mixer.clipAction(gltf.animations[0])
        action.play()
      },
      (progress) => {
        console.log("success")
        // console.log(progress)
      },
      (error) => {
          console.log("error")
          console.log(error)
      }
    )
  }

  animate() {
    if (this.mixer) {
      this.mixer.update(1 / 60)
    }
    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}