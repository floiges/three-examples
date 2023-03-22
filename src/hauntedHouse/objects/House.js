import * as THREE from 'three'
import BaseObject from '../../common/objects/Base';

export default class House extends BaseObject {
  constructor() {
    super()

    // 组
    const house = new THREE.Group()

    // 墙体
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({ color: '#ac8e82' })
    )

    walls.position.y = 1.25
    house.add(walls)

    // 房顶
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 1 ,4),
      new THREE.MeshStandardMaterial({ color: '#b35f45' })
    )

    roof.rotation.y = Math.PI * 0.25 // 逆时针旋转45度
    roof.position.y = 3
    house.add(roof)

    // 门
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshStandardMaterial({ color: '#aa7b7b' })
    )

    door.position.y = 1
    door.position.z = 2 + 0.01

    house.add(door)
    // 在门上添加一个暖色的点光源，
    // 将点光源添加到 house 组上。这里的参数1为光的强度，7为fade距离。
    const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
    doorLight.castShadow = true
    doorLight.position.set(0, 2.2, 2.7)
    house.add(doorLight)

    // 灌木丛
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
    const bushMaterial  = new THREE.MeshStandardMaterial({ color: '#89c854' })

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush1.castShadow = true
    bush1.scale.set(0.5, 0.5, 0.5)
    bush1.position.set(0.8, 0.2, 2.2)

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush2.castShadow = true
    bush2.scale.set(0.25, 0.25, 0.25)
    bush2.position.set(1.4, 0.1, 2.1)

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush3.castShadow = true
    bush3.scale.set(0.4, 0.4, 0.4)
    bush3.position.set(-1, 0.1, 2.2)

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush4.castShadow = true
    bush4.scale.set(0.15, 0.15, 0.15)
    bush4.position.set(-1, 0.05, 2.6)

    house.add(bush1, bush2, bush3, bush4)

    this.instance = house
  }
}