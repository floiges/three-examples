import { ExtrudeGeometry, Mesh, MeshLambertMaterial, Path, Shape } from 'three';
import BaseObject from '../../common/objects/Base';

export default class FrontWall extends BaseObject {
  constructor() {
    super()

    const wallGeometry = this.drawShape()
    const wallMaterial = new MeshLambertMaterial({
      color: 0xe5d890
    })
    this.instance = new Mesh(wallGeometry, wallMaterial)
  }

  /**
   * 前墙是立方体上面挖了门和窗两个洞
   */
  drawShape() {
    const shape = new Shape()
    shape.moveTo(-500, 0)
    shape.lineTo(500, 0)
    shape.lineTo(500, 400)
    shape.lineTo(-500, 400)

    const window  = new Path()
    window.moveTo(100, 100)
    window.lineTo(100, 250)
    window.lineTo(300, 250)
    window.lineTo(300, 100)
    shape.holes.push(window)

    const door = new Path()
    door.moveTo(-330, 30)
    door.lineTo(-330, 250)
    door.lineTo(-210, 250)
    door.lineTo(-210, 30)
    shape.holes.push(door)

    const extrudeSettings = {
      depth: 8,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 5
    }

    // ExtrudeGeometry可以从一个二维图形创建出一个三维图形，
    // 我们可以先画一个二维的形状，ExtrudeGeometry会将这个二维形状不断 “加厚”，得到一个柱体。类比从一个平面圆到一个圆柱体。
    const geometry = new ExtrudeGeometry(shape, extrudeSettings)
    return geometry
  }
}