import * as THREE from 'three'
import BaseObject from '../../common/objects/Base';

export default class Ground extends BaseObject {
  constructor() {
    super()

    // 地面
    const groundGeometry = new THREE.PlaneGeometry(...arguments)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#89a04b')
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.receiveShadow = true
    this.instance = ground
  }
}