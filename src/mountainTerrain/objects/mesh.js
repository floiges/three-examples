import * as THREE from 'three'
import { createNoise2D } from 'simplex-noise'

/**
 * PlaneGeometry 在设置分段之后，会有很多的顶点，构成很多三角形。

 * 我们对这些顶点做下位置的随机变化就可以山脉地形效果。

 * 但是 Math.random() 这种完全随机不行，需要用噪声算法，我们用 simplex-noise 这个库。

 * 噪声算法是生成随机但连续的数的，与位置有关，传入位置 x、y，返回 z

 * 然后想让它起伏，需要用正弦函数，然后以时间作为参数再加上顶点 x 坐标，这样每个顶点就会随时间做正弦规律的起伏。
 */

const geometry = new THREE.PlaneGeometry(3000, 3000, 100, 100)

const noise2D = createNoise2D()

// 随机顶点坐标
const positions = geometry.attributes.position
// 顶点会按照 3 个一组来分组，position.count 是分组数，
// 可以通过 setX、setY、setZ 修改某个分组的 xyz 值
for (let i = 0; i < positions.count; i++) {
  const x = positions.getX(i)
  const y = positions.getY(i)

  // 噪音算法，生成的是与位置有关系的连续的随机数
  // 根据 x 和 y 计算 z 值
  // noise2D 的返回值是 -1 ~ 1 之间的数，乘以 50 让起伏更明显
  // 数值越大，起伏越大
  // 数值越小，起伏越小
  // 除以的数值越大，地形起伏越平缓
  // 除以的数值越小，地形起伏越密集
  const z = noise2D(x / 300, y / 300) * 50
  positions.setZ(i, z)
}

const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color('orange'),
  wireframe: true,
})

const mesh = new THREE.Mesh(geometry, material)

// 绕 x 轴旋转 90 度
mesh.rotateX(Math.PI / 2)

export default mesh

// 正弦值是从 -1 到 1 变化，我们传入时间来计算正弦，得到的就是一个不断变化的 -1 到 1 的值
// 通过这个值来更新顶点的 z 值，就可以让地形动起来
// 起伏效果
export function updatePosition() {
  const positions = geometry.attributes.position

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)

    const z = noise2D(x / 300, y / 300) * 50
    // Math.sin 是从 -1 到 1 变化的，所以 * 10 就是 -10 到 10 变化，这样就有 20 的高度波动
    // 想让每个顶点都不一样，所以 sin 的参数还要传入一个 x 坐标，这样每个顶点变化的值不同，是符合正弦规律的变化
    const sinNum = Math.sin(Date.now() * 0.002 + x * 0.05) * 10
    positions.setZ(i, z + sinNum)
  }
  // 通知 three.js 顶点数据更新了
  positions.needsUpdate = true
}