import { ExtrudeGeometry, Mesh, MeshLambertMaterial, Shape } from 'three';
import BaseObject from './Base';

export default class SideWall extends BaseObject {
  constructor() {
    super()

    const wallGeometry = this.drawShape()
    const wallMaterial = new MeshLambertMaterial({
      color: 0xe5d890,
      // wireframe: true //线条模式渲染mesh对应的三角形数据
    })
    this.instance = new Mesh(wallGeometry, wallMaterial)
  }

  drawShape() {
    const shape = new Shape()
    shape.moveTo(-400, 0)
    shape.lineTo(400, 0)
    shape.lineTo(400, 400)
    shape.lineTo(0, 500)
    shape.lineTo(-400, 400)

    const extrudeSettings = {
      depth: 8,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1
    }

    const geometry = new ExtrudeGeometry(shape, extrudeSettings)
    return geometry
  }
}