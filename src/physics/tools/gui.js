import { GUI } from 'dat.gui'

export function Gui({
  onFinishChange,
  createShape,
  createBox,
  reset
}) {
  const parameters = {
    groundColor: '#433d3d',
  }

  const debugObject = {
    createShape,
    createBox,
    reset
  }

  const gui = new GUI()
  const f = gui.addFolder('galaxy')
  f.addColor(parameters, 'groundColor')
    .onFinishChange(onFinishChange)
    .name('地板颜色')
  f.open()

  const d = gui.addFolder('debugger')
  d.add(debugObject, 'createShape')
  d.add(debugObject, 'createBox')
  d.add(debugObject, 'reset')
  d.open()

  return parameters
}