import { AmbientLight, DirectionalLight } from 'three'

export const addAmbientLight = (scene) => {
  scene.add(new AmbientLight(0x666666))
}

export const addDirectionalLight = (scene) => {
  const light = new DirectionalLight('#ffffff', 1)
  light.position.set(1, 1, 0)
  scene.add(light)
}