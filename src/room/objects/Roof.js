import { BoxGeometry, Mesh, MeshLambertMaterial, RepeatWrapping, TextureLoader } from 'three';
import BaseObject from './Base';

export default class Roof extends BaseObject {
  constructor() {
    super()

    // BoxGeometry的其中一面用贴图，剩下的五个面使用纯色
    const roofGeometry = new BoxGeometry(...arguments)
    const roofTexture = new TextureLoader().load('./images/room/roof.png')
    roofTexture.wrapS = roofTexture.wrapT = RepeatWrapping
    roofTexture.repeat.set(2, 2)

    const materials = []
    const colorMaterial = new MeshLambertMaterial({ color: 'grey'})
    const textureMaterial = new MeshLambertMaterial({ map: roofTexture })
    for (let i = 0; i < 6; i++) {
      materials.push(colorMaterial)
    }
    materials[5] = textureMaterial
    this.instance = new Mesh(roofGeometry, materials)
  }
}