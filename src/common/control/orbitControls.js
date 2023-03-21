import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export function addOrbitControls(camera, el) {
  const controls = new OrbitControls(camera, el)
  //垂直旋转的角度的上限
  controls.maxPolarAngle = Math.PI * 0.45
  // 禁止平移
  controls.enablePan = false

  return controls
}