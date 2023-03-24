import * as THREE from 'three'
import BaseObject from '../../common/objects/Base';

export default class Ground extends BaseObject {
  constructor() {
    super()

    const groundGeometry = new THREE.PlaneGeometry(...arguments)
    this.groundMaterial = new THREE.MeshStandardMaterial({
      color: '#433d3d'
    })
    const ground = new THREE.Mesh(groundGeometry, this.groundMaterial)
    ground.receiveShadow = true
    this.instance = ground
  }
}