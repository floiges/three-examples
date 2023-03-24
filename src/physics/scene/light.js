import { AmbientLight, DirectionalLight } from 'three'

export const addAmbientLight = (scene) => {
  const light = new AmbientLight(0xffffff)
  scene.add(light)
}

export const addDirectionalLight = (scene) => {
  const light = new DirectionalLight(0xffffff)
  light.castShadow = true
  light.position.set(50, 200, 100)
  scene.add(light)
}