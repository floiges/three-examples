import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';

export function initSphere(scene, cubeCamera) {
  // 通过创建一个物体所处环境的纹理来伪装镜面反射，并将它应用到指定的对象上
  const sphereMaterial = new MeshBasicMaterial({
    // 环境贴图
    //cubeCamera生成的纹理作为球体的环境贴图
    envMap: cubeCamera.renderTarget.texture
  })

  const sphereGeometry = new SphereGeometry(20, 30, 30)

  const sphere = new Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(0, 0, 0)
  scene.add(sphere)
}