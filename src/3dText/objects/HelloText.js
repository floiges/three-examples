import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import BaseObject from '../../common/objects/Base';

export default class HelloText extends BaseObject {
  constructor(scene) {
    super()

    const textureLoader = new THREE.TextureLoader()
    this.matcapTexture = textureLoader.load('./images/matcaps/1.png')

    const fontLoader = new FontLoader()
    fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry(
        'Hello Three.js',
        {
          font: font,
          size: 0.5,
          height: 0.2,
          // 创建文本几何体对于计算机来说是昂贵的，我们可以通过减少 curveSegments 和 bevalSegments 降低三角形的数量
          curveSegments: 12,
          bevelSegments: 5,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
        }
      )
      // 居中文本
      // // 默认情况下，Three.js 使用 sphere bounding，使用 box bounding 需要调用 computeBoundingBox() 方法，
      // textGeometry.computeBoundingBox()
      // // 有了 bounding box 的位置信息，使用 translate 平移几何体，
      // // 由于 bevelThickness 和 bevelSize 的原因，文本并不是完全居中的，
      // textGeometry.translate(
      //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
      //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
      //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5,
      // )
      // 更简单的方法
      textGeometry.center()


      const textMaterial = new THREE.MeshMatcapMaterial({ matcap: this.matcapTexture })
      const text = new THREE.Mesh(textGeometry, textMaterial)
      this.instance = text
      scene.add(this.instance)
    })
  }
}