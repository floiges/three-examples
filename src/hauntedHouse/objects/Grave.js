import * as THREE from 'three'
import BaseObject from '../../common/objects/Base';

export default class Grave extends BaseObject {
  constructor() {
    super()

    // 墓碑组
    const graves = new THREE.Group()

    const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
    const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" })

    // 我们希望在房屋地周围随机地创建一些坟墓，但是不能超出地面地范围或生成在房间里面。
    // 随机创建50个墓碑，并且旋转墓碑使其倾斜一点的角度，让它看起来更破旧
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * 6
      const x = Math.sin(angle) * radius
      const z = Math.cos(angle) * radius

      const grave = new THREE.Mesh(graveGeometry, graveMaterial)
      grave.castShadow = true
      grave.position.set(x, 0.3, z)
      grave.rotation.z = (Math.random() - 0.5) * 0.4
      grave.rotation.y = (Math.random() - 0.5) * 0.4

      graves.add(grave)
    }

    this.instance = graves
  }
}