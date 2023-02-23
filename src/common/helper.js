import { AxesHelper, CameraHelper } from 'three'

export const addAxesHelper = (scene) => {
  const axesHelper = new AxesHelper(1000)
  scene.add(axesHelper)
}

export const addCameraHelper = (scene, camera) => {
  const helper = new CameraHelper(camera)
  scene.add(helper)
}