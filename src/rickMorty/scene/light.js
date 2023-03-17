import { AmbientLight, DirectionalLight } from 'three'

export const addDirectionalLight = (scene) => {
  const directionalLight = new DirectionalLight(0xffffff, 4)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.normalBias = 0.05
  directionalLight.position.set(.25, 3, -1.25)
  scene.add(directionalLight)
}

export const addAmbientLight = (scene) => {
  const ambientLight = new AmbientLight(0xffffff, 1.2)
  scene.add(ambientLight)
}