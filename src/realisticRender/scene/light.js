import { AmbientLight, DirectionalLight } from 'three'

export const addAmbientLight = (scene) => {
  scene.add(new AmbientLight(0x666666))
}

export const addDirectionalLight = (scene) => {
  const light = new DirectionalLight(0xffffff, 3)
  light.position.set(0.25, 3, -2.25)
  light.castShadow = true
  scene.add(light)

  return light
}