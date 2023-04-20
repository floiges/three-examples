import * as THREE from 'three'

export const addHemisphereLight = (scene) => {
  const light = new THREE.HemisphereLight(0xffffff);
  light.position.set(0, 40, 0);
  scene.add(light);
}

export const addDirectionalLight = (scene) => {
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 40, -10)
  scene.add(light)
}