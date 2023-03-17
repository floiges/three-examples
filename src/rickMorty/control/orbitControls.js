import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export const addOrbitControls = (camera, canvasEl) => {
  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true
  controls.enablePan = false
  // 限制垂直旋转角度
  controls.minPolarAngle = .5
  controls.maxPolarAngle = 2.5
  // 限制水平旋转角度
  controls.minAzimuthAngle = -1
  controls.maxAzimuthAngle = 1

  return controls
}