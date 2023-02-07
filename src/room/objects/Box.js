import { BoxGeometry, Mesh, MeshLambertMaterial } from 'three';
import BaseObject from './Base';

export default class Box extends BaseObject {
  constructor() {
    super()

    const boxGeometry = new BoxGeometry(...arguments)
    const boxMaterial = new MeshLambertMaterial({
      color: 0xe5d890
    })

    this.instance = new Mesh(boxGeometry, boxMaterial)
  }
}