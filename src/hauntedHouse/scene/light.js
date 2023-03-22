import { AmbientLight, DirectionalLight } from 'three'

export const addAmbientLight = (scene) => {
  const light = new AmbientLight(0xb9d6ff, 0.12)
  scene.add(light)
}

export const addDirectionalLight = (scene) => {
  const light = new DirectionalLight(0xb9d5ff, 0.12)
  light.castShadow = true
  light.position.set(50, 200, 100)
  scene.add(light)
}