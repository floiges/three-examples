import {
  AxesHelper,
  BufferAttribute,
  BufferGeometry,
  Color,
  ExtrudeGeometry,
  FileLoader,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Raycaster,
  Shape,
  Vector2,
  Vector3
} from 'three'
import * as d3 from 'd3'
import Template from '../../common/Template';
import { addAxesHelper, addCameraHelper } from '../../common/helper'
import { addOrbitControls } from '../../common/control/orbitControls'
import { addAmbientLight } from './light'
import { sizes } from '../../common';

export default class Director extends Template {
  constructor() {
    super()

    this.PCamera.fov = 75
    this.rendererColor = new Color(0x000000)
    this.cameraPosition = new Vector3(0, 0, 5)

    this.init()

    addAmbientLight(this.scene)
    addOrbitControls(this.camera, this.renderer.domElement)

    addAxesHelper(this.scene)
    addCameraHelper(this.scene, this.camera)

    this.setRaycaster()
    this.animate()

    this.loadMapJSON()
  }

  generateGeometry(jsonData) {
    // 初始化地图对象
    const map = new Object3D()
    // 墨卡托投影
    // 墨卡托投影转换可以把我们经纬度坐标转换成我们对应平面的2d坐标
    const projection = d3
      .geoMercator()
      .center([104.0, 37.5])
      .translate([0, 0])

    jsonData.features.forEach(ele => {
      // 定义一个省份 3D 对象
      const province = new Object3D()
      // 每个省份坐标数组
      const coordinates = ele.geometry.coordinates
      // 遍历
      // 首先每一个省份轮廓组成的下标是一个 2d坐标，但是我们要生成立方体，shape() 可以定义一个二维形状平面。
      // 它可以和ExtrudeGeometry一起使用，获取点，或者获取三角面。
      coordinates.forEach(multiPolygon => {
        multiPolygon.forEach(polygon => {
          const shape = new Shape()
          const lineMaterial = new LineBasicMaterial({
            color: 'white'
          })
          const lineGeometry = new BufferGeometry()

          const vertices = []
          for (let i = 0; i < polygon.length; i++) {
            const [x, y] = projection(polygon[i])
            if (i === 0) {
              shape.moveTo(x, -y)
            }
            shape.lineTo(x, -y)
            vertices.push(...[x, -y, 5])
          }

          const attributes = new BufferAttribute(new Float32Array(vertices), 3)
          lineGeometry.attributes.position = attributes

          const extrudeSettings = {
            depth: 10,
            bevelEnabled: false,
          }

          const geometry = new ExtrudeGeometry(
            shape,
            extrudeSettings
          )
          const material = new MeshBasicMaterial({
            color: '#2defff',
            transparent: true,
            opacity: 0.6,
          })
          const material1 = new MeshBasicMaterial({
            color: '#3480C4',
            transparent: true,
            opacity: 0.5,
          })
          const mesh = new Mesh(geometry, [material, material1])
          const line = new Line(lineGeometry, lineMaterial)
          // 将省份的属性 加进来
          province.properties = ele.properties
          province.add(mesh)
          province.add(line)
        })
      })
      map.add(province)
    })
    this.scene.add(map)
  }

  loadMapJSON() {
    const loader = new FileLoader()
    loader.load('./json/china.json', (json) => {
      const jsonData = JSON.parse(json)
      this.generateGeometry(jsonData)
    })
  }

  setRaycaster() {
    this.raycaster = new Raycaster()
    this.mouse = new Vector2()
    this.tooltip = document.getElementById('tooltip')
    const onMouseMove = (e) => {
      // 将鼠标位置归一化为设备坐标 x 和 y 方向的取值范围是 (-1 to +1)
      this.mouse.x = (e.clientX / sizes.width) * 2 - 1
      this.mouse.y = -(e.clientY / sizes.height) * 2 + 1
      // 更改div位置
      this.tooltip.style.left = event.clientX + 2 + 'px'
      this.tooltip.style.top = event.clientY + 2 + 'px'
    }
    window.addEventListener('mousemove', onMouseMove, false)
  }

  showTip() {
    // 显示省份的信息
    if (this.lastPick) {
      const properties = this.lastPick.object.parent.properties

      this.tooltip.textContent = properties.name

      this.tooltip.style.visibility = 'visible'
    } else {
      this.tooltip.style.visibility = 'hidden'
    }
  }

  animate() {
    // 通过鼠标位置和摄像机 更新射线
    this.raycaster.setFromCamera(this.mouse, this.camera)
    // 计算射线与场景相交的对象有哪些
    const inersects = this.raycaster.intersectObjects(this.scene.children, true)
    if (this.lastPick) {
      this.lastPick.object.material[0].color.set('#2defff')
      this.lastPick.object.material[1].color.set('#3480c4')
    }
    this.lastPick = null
    this.lastPick = inersects.find(it => it.object.material && it.object.material.length === 2)
    if (this.lastPick) {
      this.lastPick.object.material[0].color.set(0xff0000)
      this.lastPick.object.material[1].color.set(0xff0000)
    }

    this.showTip()
    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}