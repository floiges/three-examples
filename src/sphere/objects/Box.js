import { CubeTextureLoader } from 'three'

export function initBox(scene) {
  //准备6张图片，实现全景的图片也需要满足以下的顺序:
  //X轴正方向、X轴负方向、Y轴正方向、Y轴负方向、Z轴正方向、Z轴负方向
  // Three.js会将这些图片整合到一起来创建一个无缝的纹理
  const urls = [
    '1.jpg',
    '2.jpg',
    '3.jpg',
    '4.jpg',
    '5.jpg',
    '6.jpg',
  ]
  const loader = new CubeTextureLoader()
  // 加载6个图像
  const cubeMap = loader.setPath('./images/reflection-sphere/').load(urls)

  // 图像纹理作为场景的背景
  scene.background = cubeMap
}

// const geometry = new THREE.BoxGeometry(10,10,10)
// geometry.scale(-1, 1, 1)  // 设置scale.x
// // geometry.scale(1, -1, 1)  设置scale.y，会导致画面上下颠倒，所以通常都设置scale.x或者scale.z
// // geometry.scale(1, 1, -1)  设置scale.z

// const materials = []
// for( let i = 0; i < 6; i ++) {
//   const texture = new THREE.TextureLoader().load( `../../images/reflection-sphere/${i+1}.jpg` );
//   materials.push( new THREE.MeshBasicMaterial({
//     map: texture}
//   ));
// }

// const cube = new THREE.Mesh(geometry, materials)
// cube.position.set(0, 0, 0)
// camera.position.set(0, 0, 0.01)
// camera.lookAt(0,0,0)