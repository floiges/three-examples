import { Mesh, MeshLambertMaterial, PlaneGeometry, RepeatWrapping, TextureLoader } from 'three';
import BaseObject from '../../common/objects/Base';

export default class Ground extends BaseObject {
  constructor() {
    super()

    const groundGeometry = new PlaneGeometry(...arguments)
    const groundTexture = new TextureLoader().load('./images/room/grass.jpg')
    groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping
		groundTexture.repeat.set(50, 50)
    // anisotropy： 沿通过具有最高纹理像素密度的像素的坐标轴取样的数量。
    // 默认情况下，此值为1.较高的值会产生比基本mipmap更少的模糊结果，但需要使用更多纹理样本。
    // 使用renderer.getMaxAnisotropy（）来查找GPU的最大有效各向异性值; 这个值通常是2的幂。
    // 这样能实现什么效果呢：如果大家想让物体缩小的时候，仍然比较清晰，可以将 anisotropy： 设大；
		groundTexture.anisotropy = 16
    const groundMaterial = new MeshLambertMaterial({
      map: groundTexture
    })
    this.instance = new Mesh(groundGeometry, groundMaterial)
  }
}