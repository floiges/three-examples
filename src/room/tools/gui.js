import { GUI } from 'dat.gui'

export function Gui() {
  const controls = {
    showAxes: true,
    showRoof: true
  }

  const gui = new GUI()
  const f = gui.addFolder('room')
  f.add(controls, 'showAxes').name('是否显示坐标轴')
  f.add(controls, 'showRoof').name('是否显示屋顶')
  f.open()

  return controls
}