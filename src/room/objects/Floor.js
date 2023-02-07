import { Mesh, MeshLambertMaterial, PlaneGeometry, RepeatWrapping, TextureLoader } from 'three';
import BaseObject from './Base';

export default class Floor extends BaseObject {
  constructor() {
    super()

    const floorGeometry = new PlaneGeometry(...arguments)

    const floorTexture = new TextureLoader().load('./images/room/floor.png')
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping
    floorTexture.repeat.set(25, 25)
    floorTexture.anisotropy = 16

    const floorMaterial = new MeshLambertMaterial({
      map: floorTexture
    })

    this.instance = new Mesh(floorGeometry, floorMaterial)
  }
}