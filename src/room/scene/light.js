import { AmbientLight, DirectionalLight } from 'three'

export const addAmbientLight = (scene) => {
  scene.add(new AmbientLight(0x666666))
}

export const addDirectionalLight = (scene) => {
  const light = new DirectionalLight(0xdfebff, 1)
  light.position.set(50, 200, 100)
  light.castShadow = true
  scene.add(light)
}