import { GUI } from 'dat.gui'

export function Gui(onFinishChange) {
  const parameters = {
    materialColor: '#ffeded'
  }

  const gui = new GUI()
  const f = gui.addFolder('scroll-based-animation')
  f.addColor(parameters, 'materialColor').onFinishChange(onFinishChange).name('颜色')
  f.open()

  return parameters
}