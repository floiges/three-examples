import { GUI } from 'dat.gui'

export function Gui(onFinishChange) {
  const parameters = {
    count: 100000,
    size: 0.01,
    radius: 5, // 半径
    branches: 3,
    spin: 1, // 让粒子根据离中心位置的距离进行旋转，距离原点越远的，旋转角度越大
    randomness: 0.2,
    randomnessPower: 3, // 随机曲线
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
  }

  const gui = new GUI()
  const f = gui.addFolder('galaxy')
  f.add(parameters, 'count')
    .min(100)
    .max(100000)
    .step(100)
    .onFinishChange(onFinishChange)
    .name('粒子数量')
  f.add(parameters, 'size')
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .onFinishChange(onFinishChange)
    .name('粒子大小')
  f.add(parameters, 'radius')
    .min(0.01)
    .max(20)
    .step(0.01)
    .onFinishChange(onFinishChange)
    .name('粒子大小')
  f.add(parameters, 'branches')
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(onFinishChange)
    .name('分支')
  f.add(parameters, 'spin')
    .min(-5)
    .max(5)
    .step(0.001)
    .onFinishChange(onFinishChange)
    .name('旋转')
  f.add(parameters, 'randomness')
    .min(0)
    .max(2)
    .step(0.001)
    .onFinishChange(onFinishChange)
    .name('扩散')
  f.add(parameters, 'randomnessPower')
    .min(1)
    .max(10)
    .step(0.001)
    .onFinishChange(onFinishChange)
    .name('随机曲线')
  f.addColor(parameters, 'insideColor')
    .onFinishChange(onFinishChange)
    .name('insideColor')
  f.addColor(parameters, 'outsideColor')
    .onFinishChange(onFinishChange)
    .name('outsideColor')
  f.open()

  return parameters
}