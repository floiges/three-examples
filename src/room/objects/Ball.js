import { Mesh, MeshLambertMaterial, SphereGeometry, TextureLoader } from 'three';
import BaseObject from '../../common/objects/Base';

export default class Ball extends BaseObject {
  constructor() {
    super()

    const sphereGeometry = new SphereGeometry(...arguments)
    const sphereTexture = new TextureLoader().load('./images/room/soccer.jfif')
    const sphereMaterial = new MeshLambertMaterial({ map: sphereTexture })
    const sphere = new Mesh(sphereGeometry, sphereMaterial)
    this.instance = sphere
  }
}