import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js'
import ColorGUIHelper from '../../common/helpers/ColorGUIHelper'
import DegRadHelper from '../../common/helpers/DegRadHelper'
import { sizes } from '../../common'

export default class Director {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl')
    this.gui = new GUI()

    this.init()

    this.createObjects()

    this.animate()
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas })
    this.camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100)
    this.camera.position.set(0, 10, 20)

    this.controls = new OrbitControls(this.camera, this.canvas)
    // OrbitControls 可以围绕某一个点旋转控制相机
    this.controls.target.set(0, 5, 0)
    this.controls.update()

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('black')

    // 创建辅助坐标系
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    // 先初始化
    RectAreaLightUniformsLib.init()
  }

  createObjects() {
    {
      const planeSize = 40

      const loader = new THREE.TextureLoader()
      const texture = loader.load('./images/checker.png')
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      // 采样模式
      texture.magFilter = THREE.NearestFilter
      texture.colorSpace = THREE.SRGBColorSpace
      const repeats = planeSize / 2
      texture.repeat.set(repeats, repeats)

      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
      // RectAreaLight 只能影响 MeshStandardMaterial 和 MeshPhysicalMaterial，所以我们把所有的材质都改为 MeshStandardMaterial。
      const planeMat = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide
      })
      const mesh = new THREE.Mesh(planeGeo, planeMat)
      mesh.rotation.x = Math.PI * -.5
      this.scene.add(mesh)
    }

    {
      const cubeSize = 4
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
      // RectAreaLight 只能影响 MeshStandardMaterial 和 MeshPhysicalMaterial，所以我们把所有的材质都改为 MeshStandardMaterial。
      const cubeMat = new THREE.MeshStandardMaterial({ color: '#8AC' })
      const mesh = new THREE.Mesh(cubeGeo, cubeMat)
      mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
      this.scene.add(mesh)
    }

    {
      const sphereRadius = 3
      const sphereWdithDivisions = 32
      const sphereHeightDivisions = 16
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWdithDivisions, sphereHeightDivisions)
      // RectAreaLight 只能影响 MeshStandardMaterial 和 MeshPhysicalMaterial，所以我们把所有的材质都改为 MeshStandardMaterial。
      const sphereMat = new THREE.MeshStandardMaterial({ color: '#CA8' })
      const mesh = new THREE.Mesh(sphereGeo, sphereMat)
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
      this.scene.add(mesh)
    }

    // {
    //   // 这就是环境光，它没有方向，无法产生阴影，场景内任何一点受到的光照强度都是相同的，除了改变场景内所有物体的颜色以外，不会使物体产生明暗的变化，看起来并不像真正意义上的光照。
    //   // 通常的作用是提亮场景，让暗部不要太暗。
    //   const color = 0xFFFFFF
    //   const intensity = 1
    //   const light = new THREE.AmbientLight(color, intensity)
    //   this.scene.add(light)

    //   this.gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    //   this.gui.add(light, 'intensity', 0, 5, 0.01)
    // }

    // {
    //   // 半球光（HemisphereLight）的颜色是从天空到地面两个颜色之间的渐变，与物体材质的颜色作叠加后得到最终的颜色效果。
    //   // 一个点受到的光照颜色是由所在平面的朝向（法向量）决定的 —— 面向正上方就受到天空的光照颜色，面向正下方就受到地面的光照颜色，其他角度则是两个颜色渐变区间的颜色
    //   // 半球光 （HemisphereLight） 与其他类型光照结合使用，可以很好地表现天空和地面颜色照射到物体上时的效果。
    //   // 所以最好的使用场景就是与其他光照结合使用，或者作为环境光（AmbientLight）的一种替代方案。
    //   const skyColor = 0xB1E1FF // light blue
    //   const groundColor = 0xB97A20 // brownish orange
    //   const intensity = 1
    //   const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
    //   this.scene.add(light)

    //   this.gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor')
    //   this.gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor')
    //   this.gui.add(light, 'intensity', 0, 2, 0.01)
    // }

    // {
    //   // 方向光常常用来表现太阳光照的效果
    //   const color = 0xFFFFFF
    //   const intensity = 1
    //   // 方向光表示的是来自一个方向上的光，并不是从某个点发射出来的，而是从一个无限大的平面内，发射出全部相互平行的光线
    //   const light = new THREE.DirectionalLight(color, intensity)
    //   light.position.set(0, 10, 0)
    //   light.target.position.set(-5, 0, 0)
    //   // 注：不仅 light，light.target 也添加到了场景中
    //   // 方向光的方向是从它的位置照向目标点的位置
    //   this.scene.add(light)
    //   this.scene.add(light.target)
    //   this.light = light

    //   // 使用 DirectionalLightHelper，它会绘制一个方形的小平面代表方向光的位置，一条连接光源与目标点的直线，代表了光的方向。
    //   // 创建对象时，传入光源对象作为参数，然后添加到场景中，就可以呈现。
    //   const helper = new THREE.DirectionalLightHelper(light)
    //   this.scene.add(helper)
    //   this.helper = helper

    //   this.gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    //   this.gui.add(light, 'intensity', 0, 2, 0.01)
    //   // this.gui.add(light.target.position, 'x', -10, 10)
    //   // this.gui.add(light.target.position, 'z', -10, 10)
    //   // this.gui.add(light.target.position, 'y', 0, 10)

    //   this.makeXYZGUI(this.gui, light.position, 'position', this.updateLight.bind(this))
    //   this.makeXYZGUI(this.gui, light.target.position, 'target', this.updateLight.bind(this))
    // }

    // {
    //   // 点光源（PointLight）表示的是从一个点朝各个方向发射出光线的一种光照效果
    //   const color = 0xFFFFFF
    //   const intensity = 150
    //   // 点光源（PointLight）有额外的一个范围（distance）属性。
    //   // 如果 distance 设为 0，则光线可以照射到无限远处。如果大于 0，则只可以照射到指定的范围，光照强度在这个过程中逐渐衰减，在光源位置时，intensity 是设定的大小，在距离光源 distance 位置的时候，intensity 为 0。
    //   const light = new THREE.PointLight(color, intensity)
    //   light.position.set(0, 10, 0)
    //   this.scene.add(light)

    //   const helper = new THREE.PointLightHelper(light)
    //   this.scene.add(helper)
    //   this.helper = helper

    //   this.gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    //   this.gui.add(light, 'intensity', 0, 2, 0.01)
    //   this.gui.add(light, 'distance', 0, 40)

    //   this.makeXYZGUI(this.gui, light.position, 'position', this.updateLight.bind(this))
    // }

    // {
    //   // 聚光灯可以看成是一个点光源被一个圆锥体限制住了光照的范围。
    //   // 实际上有2个圆锥，内圆锥和外圆锥。光照强度在两个锥体之间从设定的强度递减到0
    //   // 聚光灯类型方向光一样需要一个目标点，光源的位置是圆锥的顶点，目标点出于圆锥的中轴线上
    //   const color = 0xFFFFFF
    //   const intensity = 150
    //   const light = new THREE.SpotLight(color, intensity)
    //   this.scene.add(light)
    //   this.scene.add(light.target)
    //   this.light = light

    //   const helper = new THREE.SpotLightHelper(light)
    //   this.scene.add(helper)
    //   this.helper = helper

    //   this.gui.add(light, 'intensity', 0, 150, 0.01)
    //   // 聚光灯的圆锥顶部角度大小通过 angle 属性设置，以弧度为单位
    //   this.gui.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').onChange(this.updateLight.bind(this))
    //   // 内圆锥是通过设置 penumbra 属性来定义的，属性值代表了内圆锥相对外圆锥大小变化的百分比。
    //   // 当 penumbra 为 0 时，内圆锥大小与外圆锥大小一致；当 penumbra 为 1 时，内圆锥大小为 0，光照强度从中轴线就开始往外递减；当 penumbra 为 0.5 时，光照强度从外圆锥半径的中点处开始往外递减。
    //   this.gui.add(light, 'penumbra', 0, 1, 0.01)
    //   this.gui.add(light, 'distance', 0, 40)
    //   this.makeXYZGUI(this.gui, light.position, 'position', this.updateLight.bind(this))
    //   this.makeXYZGUI(this.gui, light.target.position, 'target', this.updateLight.bind(this))
    // }

    {
      // Three.js 中还有一种类型的光照，矩形区域光（RectAreaLight）, 顾名思义，表示一个矩形区域的发射出来的光照，例如长条的日光灯或者天花板上磨砂玻璃透进来的自然光。
      // RectAreaLight 只能影响 MeshStandardMaterial 和 MeshPhysicalMaterial，所以我们把所有的材质都改为 MeshStandardMaterial。
      const color = 0xFFFFFF
      const intensity = 5
      const width = 12
      const height = 4
      const light = new THREE.RectAreaLight(color, intensity, width, height)
      light.position.set(0, 10, 0)
      // 与方向光（DirectionalLight）和聚光灯（SpotLight）不同，矩形光不是使用目标点（target），而是使用自身的旋转角度来确定光照方向。
      light.rotation.x = THREE.MathUtils.degToRad(-90)
      this.scene.add(light)

      const helper = new RectAreaLightHelper(light)
      // 另外，矩形光的辅助对象（RectAreaLightHelper）应该添加为光照的子节点，而不是添加为场景的子节点。
      light.add(helper)

      this.gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
      this.gui.add(light, 'intensity', 0, 10, 0.01);
      this.gui.add(light, 'width', 0, 20);
      this.gui.add(light, 'height', 0, 20);
      this.gui.add(new DegRadHelper(light.rotation, 'x'), 'value', -180, 180).name('x rotation');
      this.gui.add(new DegRadHelper(light.rotation, 'y'), 'value', -180, 180).name('y rotation');
      this.gui.add(new DegRadHelper(light.rotation, 'z'), 'value', -180, 180).name('z rotation');

      this.makeXYZGUI(this.gui, light.position, 'position');

      // 需要注意，每添加一个光源到场景中，都会降低 three.js 渲染场景的速度，所以应该尽量使用最少的资源来实现想要的效果。
    }
  }

  updateLight() {
    // 注：点光源没有 target 属性
    this.light.target.updateMatrixWorld()
    this.helper.update()
  }

  makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name)
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn)
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn)
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn)
    folder.open()
  }

  resizeRendererToDisplaySize( renderer ) {
		const canvas = renderer.domElement;
    const width = sizes.width
    const height = sizes.height
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}
		return needResize;
	}

  animate() {
    if (this.resizeRendererToDisplaySize(this.renderer)) {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
      this.camera.updateProjectionMatrix()
    }

    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate.bind(this))
  }
}