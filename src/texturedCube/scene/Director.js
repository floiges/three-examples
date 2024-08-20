import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { sizes } from '../../common'
import StringToNumberHelper from '../../common/helpers/StringToNumberHelper'
import DegRadHelper from '../../common/helpers/DegRadHelper'

export default class Director {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl')

    this.init()

    this.loader = new THREE.TextureLoader()
    this.gui = new GUI()

    this.createObjects()

    this.animate()
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas })
    this.camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5)
    this.camera.position.z = 2

    this.scene = new THREE.Scene()
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

  loadColorTexture(path) {
    const texture = this.loader.load(path)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }

  createObjects() {
    const boxWidth = 1
    const boxHeight = 1
    const boxDepth = 1
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

    this.cubes = []
    const texture = this.loader.load('./images/wall.jpg')
    texture.colorSpace = THREE.SRGBColorSpace
    this.texture = texture
    const material = new THREE.MeshBasicMaterial({ map: texture })
    // const materials = [
    //   new THREE.MeshBasicMaterial({ map: this.loadColorTexture('./images/flower-1.jpg') }),
    //   new THREE.MeshBasicMaterial({ map: this.loadColorTexture('./images/flower-2.jpg') }),
    //   new THREE.MeshBasicMaterial({ map: this.loadColorTexture('./images/flower-3.jpg') }),
    //   new THREE.MeshBasicMaterial({ map: this.loadColorTexture('./images/flower-4.jpg') }),
    //   new THREE.MeshBasicMaterial({ map: this.loadColorTexture('./images/flower-5.jpg') }),
    //   new THREE.MeshBasicMaterial({ map: this.loadColorTexture('./images/flower-6.jpg') }),
    // ]

    const cube = new THREE.Mesh(geometry, material)
    this.scene.add(cube)
    this.cubes.push(cube)

    const wrapModes = {
      // 每条边上的最后一个像素无限重复。
      'ClampToEdgeWrapping': THREE.ClampToEdgeWrapping,
      // 纹理重复
      'RepeatWrapping': THREE.RepeatWrapping,
      // 在每次重复时将进行镜像
      'MirroredRepeatWrapping': THREE.MirroredRepeatWrapping,
    }

    // 默认情况下，three.js中的纹理是不重复的。要设置纹理是否重复，有2个属性，wrapS 用于水平包裹，wrapT 用于垂直包裹
    this.gui.add(new StringToNumberHelper(texture, 'wrapS'), 'value', wrapModes)
      .name('texture.wrapS')
      .onChange(this.updateTexture.bind(this))
    this.gui.add(new StringToNumberHelper(texture, 'wrapT'), 'value', wrapModes)
      .name('texture.wrapT')
      .onChange(this.updateTexture.bind(this))
    this.gui.add(texture.repeat, 'x', 0, 5, .01).name('texture.repeat.x')
    this.gui.add(texture.repeat, 'y', 0, 5, .01).name('texture.repeat.y')
    // 纹理的偏移可以通过设置 offset 属性来完成。纹理的偏移是以单位为单位的，其中1个单位=1个纹理大小。
    // 换句话说，0 = 没有偏移，1 = 偏移一个完整的纹理数量
    this.gui.add(texture.offset, 'x', -2, 2, .01).name('texture.offset.x')
    this.gui.add(texture.offset, 'y', -2, 2, .01).name('texture.offset.y')
    // 通过设置以弧度为单位的 rotation 属性以及用于选择旋转中心的 center 属性，可以设置纹理的旋转。
    // 它的默认值是0,0，从左下角开始旋转。像偏移一样，这些单位是以纹理大小为单位的，所以将它们设置为 .5，.5 将会围绕纹理中心旋转。
    this.gui.add(texture.center, 'x', -5, 1.5, .01).name('texture.center.x')
    this.gui.add(texture.center, 'y', -5, 1.5, .01).name('texture.center.y')
    this.gui.add(new DegRadHelper(texture, 'rotation'), 'value', -360, 360)
      .name('texture.rotation')
  }

  updateTexture() {
    console.log("🚀 ~ Director ~ updateTexture ~ updateTexture:")
    this.texture.needsUpdate = true
  }

  animate(time) {
    time *= 0.001

    if (this.resizeRendererToDisplaySize(this.renderer)) {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
      this.camera.updateProjectionMatrix()
    }

    this.cubes.forEach((cube, idx) => {
      const speed = .2 + idx * .1
      const rot = time * speed
      cube.rotation.x = rot
      cube.rotation.y = rot
    })

    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate.bind(this))
  }
}