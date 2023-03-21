import { AmbientLight, DirectionalLight, DirectionalLightHelper } from 'three'

export const addAmbientLight = (scene) => {
  scene.add(new AmbientLight(0x666666))
}

export const addDirectionalLight = (scene) => {
  const light = new DirectionalLight(0xdfebff, 1)
  light.position.set(50, 200, 100)
  // light.castShadow = true
  scene.add(light)

  // DirectionalLightHelper：可视化平行光
//   const dirLightHelper = new DirectionalLightHelper(light, 100, 0xff0000);
//   scene.add(dirLightHelper);
}