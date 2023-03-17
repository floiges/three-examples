import { BoxGeometry, ExtrudeGeometry, Group, Mesh, MeshLambertMaterial, Path, Shape, TextureLoader } from 'three';
import BaseObject from '../../common/objects/Base';

export default class Door extends BaseObject {
  constructor() {
    super()

    this.initFrame()
    this.initDoor()

    const group = new Group()
    group.add(this.frame)
    group.add(this.door)
    this.instance = group
  }

  initFrame() {
    const frameGeometry = this.drawShape()
    const frameMaterial = new MeshLambertMaterial({
      color: 0x8d7159
    })
    const frame = new Mesh(frameGeometry, frameMaterial)
    this.frame = frame
  }

  initDoor() {
    const doorGeometry = new BoxGeometry(100, 210, 4)
    const doorTexture = new TextureLoader().load('./images/room/wood.jpg')
    const doorMaterial = new MeshLambertMaterial({ map: doorTexture })
    const door = new Mesh(doorGeometry, doorMaterial)

    this.params = {
      positionX: 60,
      positionZ: 0,
      rotationY: 0
    }
    door.position.set(this.params.positionX, 105, this.params.positionZ)
    door.rotation.y = this.params.rotationY
    this.door = door
    this.status = 'closed'
  }

  drawShape() {
    const shape = new Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0, 220)
    shape.lineTo(120, 220)
    shape.lineTo(120, 0)

    const door = new Path()
    door.moveTo(10, 0)
    door.lineTo(10, 210)
    door.lineTo(110, 210)
    door.lineTo(110, 0)
    shape.holes.push(door)

    const extrudeSettings = {
      depth: 8, // 挤出的形状的深度
      bevelEnabled: true, // 对挤出的形状应用是否斜角
      bevelSegments: 2, // 斜角的分层段数
      steps: 2, // 用于沿着挤出样条的深度细分的点的数量
      bevelSize: 1, // 斜角与原始形状轮廓之间的延伸距离
      bevelThickness: 6 // 设置原始形状上斜角的厚度
    };

    // 挤压缓冲几何体
    const geometry = new ExtrudeGeometry(shape, extrudeSettings);
    return geometry
  }

  onUpdate(params) {
    this.door.position.x = params.positionX
    this.door.position.z = params.positionZ
    this.door.rotation.y = params.rotationY
  }

  animate() {
    if (this.status === 'closed') {
      this.params.positionX = 10
      this.params.positionZ = 50
      this.params.rotationY = -Math.PI/2
      this.status= 'open'
    } else {
      this.params.positionX = 60
      this.params.positionZ = 0
      this.params.rotationY = 0
      this.status= 'closed'
    }
    this.onUpdate(this.params)
  }
}