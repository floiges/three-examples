import { GUI } from 'dat.gui'

export function Gui() {
  const controls = {
    showAxes: true,
    showRoof: true
  }

  const gui = new GUI()
  const f = gui.addFolder('room')
  f.add(controls, 'showAxes')
  f.add(controls, 'showRoof')
  f.open()

  return controls
}