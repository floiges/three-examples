import { AmbientLight } from 'three'

export const addAmbientLight = (scene) => {
  scene.add(new AmbientLight(0xffffff))
}