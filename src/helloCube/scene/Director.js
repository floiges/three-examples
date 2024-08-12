import * as THREE from 'three'
import { sizes } from '../../common'

export default class Director {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl')
    this.objects = []
    this.spread = 15

    this.init()
    this.animate()
  }


  init() {
    this.initScene()
    this.initPerspectiveCamera()
    this.initRenderer()

    this.addDirectionalLight()
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas })
    this.renderer.setSize(sizes.width, sizes.height)
    // 设置 canvas 的像素比为当前的屏幕像素比，避免高分屏下出现模糊情况
    // 之后任何对renderer.setSize的调用都会神奇地使用您请求的大小乘以您传入的像素比例. 强烈不建议这样。
    // this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.render(this.scene, this.camera)
  }

  initPerspectiveCamera() {
    // const fov = 75; // 视野范围，垂直方向75度
    const fov = 40;
    const aspect = 2; // 相机默认值, 画布宽高比，在默认情况下 画布是300x150像素，所以宽高比为300/150或者说2
    const near = 0.1; // 近平面。near和far代表近平面和远平面，它们限制了摄像机面朝方向的可绘区域。 任何距离小于或超过这个范围的物体都将被裁剪掉(不绘制)。
    // const far = 5; // 远平面
    const far = 1000;
    // 这四个参数定义了一个视锥。视锥是指一个被削去顶部的金字塔形状。
    // 近平面和远平面的高度由视野范围决定，宽度由视野范围和宽高比决定。
    this.camera = new THREE.PerspectiveCamera(
      fov,
      aspect,
      near,
      far
    )
    // 摄像机默认指向Z轴负方向，上方向朝向Y轴正方向
    // 这里将会把立方体放置在坐标原点，所以我们需要往后移一下摄像机才能显示出物体
    // this.camera.position.z = 2

    this.camera.position.z = 120
  }

  initScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xAAAAAA)
    // 几乎所有希望在three.js中显示的物体都需要一个包含了组成三维物体的顶点信息的几何体
    const boxWidth = 1
    const boxHeight = 1
    const boxDepth = 1
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
    // MeshBasicMaterial材质不会受到灯光的影响。我们将他改成会受灯光影响的MeshPhongMaterial材质。
    // const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 })
    // this.cube = new THREE.Mesh(geometry, material)
    // this.scene.add(this.cube)

    this.cubes = [
      this.makeInstance(geometry, 0x44aa88, 0),
      this.makeInstance(geometry, 0x8844aa, -2),
      this.makeInstance(geometry, 0xaa8844, 2)
    ]
  }

  addDirectionalLight() {
    const color = 0xFFFFFF
    const intensity = 3
    const light = new THREE.DirectionalLight(color, intensity)
    // 平行光有一个位置和目标点。默认值都为(0, 0, 0)。
    // 我们这里 将灯光的位置设为(-1, 2, 4)，让它位于摄像机前面稍微左上方一点的地方。目标点还是(0, 0, 0)，让它朝向坐标原点方向。
    light.position.set(-1, 2, 4)
    this.scene.add(light)
  }

  makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color })
    const cube = new THREE.Mesh(geometry, material)
    this.scene.add(cube)

    cube.position.x = x

    return cube
  }

  /**
   * 一个canvas的内部尺寸，它的分辨率，通常被叫做绘图缓冲区(drawingbuffer)尺寸。
   * 在three.js中我们可以通过调用renderer.setSize来设置canvas的绘图缓冲区。
   * 我们应该选择什么尺寸? 最显而易见的是"和canvas的显示尺寸一样"。 即可以直接用canvas的clientWidth和clientHeight属性。
   */
  resizeRendererToDisplaySize() {
    const pixelRatio = window.devicePixelRatio
    const width = Math.floor(this.canvas.clientWidth * pixelRatio)
    const height = Math.floor(this.canvas.clientHeight * pixelRatio)
    const needResize = this.canvas.width !== width || this.canvas.height !== height
    if (needResize) {
      // 一旦我们知道了是否需要调整大小我们就调用renderer.setSize然后 传入新的宽高。在末尾传入false很重要。
      // render.setSize默认会设置canvas的CSS尺寸但这并不是我们想要的。
      // 我们希望浏览器能继续工作就像其他使用CSS来定义尺寸的其他元素。我们不希望 three.js使用canvas和其他元素不一样。
      this.renderer.setSize(width, height, false)
    }
    return needResize
  }

  addObject(x, y ,obj) {
    obj.position.x = x * this.spread
    obj.position.y = y * this.spread
  }

  animate(time) {
    // requestAnimationFrame会将页面开始加载到函数运行所经历的时间当作入参传给回调函数，单位是毫秒数。但我觉得用秒会更简单所以我将它转换成了秒。
    // 然后我们把立方体的X轴和Y轴方向的旋转角度设置成这个时间。这些旋转角度是弧度制。一圈的弧度为2Π，所以我们的立方体在每个方向旋转一周的时间为6.28秒。

    time *= 0.001

    if (this.resizeRendererToDisplaySize(this.renderer)) {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
      this.camera.updateProjectionMatrix()
    }

    // this.cube.rotation.x = time
    // this.cube.rotation.y = time
    this.cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1
      const rot = time * speed
      cube.rotation.x = rot
      cube.rotation.y = rot
    })


    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}