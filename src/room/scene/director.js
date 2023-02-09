import { AxesHelper, Color, Fog, Raycaster, Vector2, Vector3 } from 'three';
import Template from '../../common/Template';
import Ground from '../objects/Ground';
import { addAmbientLight, addDirectionalLight } from './light';
import { addOrbitControls } from '../control/orbitControls'
import { Gui } from '../tools/gui'
import Floor from '../objects/Floor';
import Box from '../objects/Box'
import FrontWall from '../objects/FrontWall';
import SideWall from '../objects/SideWall';
import Roof from '../objects/Roof';
import Win from '../objects/Win';
import Door from '../objects/Door';
import { sizes } from '../../common';
import { addFlower, addTable } from '../objects/Model';
import Vase from '../objects/Vase';
import Ball from '../objects/Ball';

export default class Director extends Template {
  constructor() {
    super()

    this.PCamera.far = 10000
    this.rendererColor = new Color(0xcce0ff)
    this.cameraPosition = new Vector3(1000, 600, 1500)

    this.init()
    this.scene.fog = new Fog(0xcce0ff, 2500, 10000)

    // 添加光源
    addAmbientLight(this.scene)
    addDirectionalLight(this.scene)

    this.addBall()
    this.addGround()
    this.addFloor()
    this.addWall()
    this.addRoof()
    this.addWindow()
    this.addWindowsill()
    this.addDoor()
    this.addVase()

    addTable(this.scene)
    addFlower(this.scene)

    addOrbitControls(this.camera, this.renderer.domElement)
    this.addAxesHelper()

    this.Controls = Gui()

    this.animate()

    // 开关门动画
    window.addEventListener('click', this.onMouseDown.bind(this))
  }

  /**
   * 足球
   */
  addBall() {
    const ball = new Ball(20, 32, 16)
    ball.setPosition(800, 20, -300)
    ball.addToScene(this.scene)
  }

  /**
   * 草地
   */
  addGround() {
    const ground = new Ground(20000, 20000)
    ground.setPosition(0, -2, 0)
    ground.setRotation(-Math.PI / 2, 0, 0)
    ground.addToScene(this.scene)
  }

  /**
   * 地板
   */
  addFloor() {
    const floor = new Floor(800, 1000)
    floor.setPosition(0, -1, 0)
    floor.setRotation(-Math.PI / 2, 0, 0)
    floor.addToScene(this.scene)
  }

  /**
   * 墙体
   */
  addWall() {
    // 前墙
    const frontWall = new FrontWall()
    frontWall.setPosition(400, 0, 0)
    frontWall.setRotation(0, Math.PI / 2, 0)
    frontWall.addToScene(this.scene)
    // 后墙
    const backWall = new Box(1000, 400, 20)
    backWall.setPosition(-400, 199, 0)
    backWall.setRotation(0, -Math.PI / 2, 0)
    backWall.addToScene(this.scene)

    // // 侧面墙
    const sideWall1 = new SideWall()
    sideWall1.setPosition(0, 0, -500)
    sideWall1.addToScene(this.scene)

    const sideWall2 = new SideWall()
    sideWall2.setPosition(0, 0, 492)
    sideWall2.addToScene(this.scene)
  }

  /**
   * 房顶
   * 屋顶是用两个BoxGeometry，设置合适的位置和旋转角度实现的，每一个BoxGeometry的其中一面用贴图，剩下的五个面使用纯色
   */
  addRoof() {
    const roof1 = new Roof(500, 1300, 10)
    roof1.setPosition(-241, 440, 0)
    roof1.setRotation(Math.PI / 2, Math.PI / 13, 0)
    roof1.addToScene(this.scene)

    const roof2 = new Roof(500, 1300, 10)
    roof2.setPosition(241, 440, 0)
    roof2.setRotation(Math.PI / 2, -Math.PI / 13, 0)
    roof2.addToScene(this.scene)

    this.roof_1 = roof1.instance
    this.roof_2 = roof2.instance
  }

  addWindow() {
    const win = new Win()
    win.setPosition(408, 185, -202)
    win.setRotation(-Math.PI / 2, -Math.PI / 2, 0)
    win.addToScene(this.scene)
  }

  addWindowsill() {
    const windowsill = new Box(10, 250, 60)
    windowsill.setPosition(430, 100, -200)
    windowsill.setRotation(Math.PI / 2, Math.PI / 2, 0)
    windowsill.addToScene(this.scene)
  }

  addDoor() {
    const door = new Door()
    door.setPosition(408, 30, 210)
    door.setRotation(0, -Math.PI / 2, 0)
    door.addToScene(this.scene)
    this.doorSet = door
  }

  addVase() {
    const vase = new Vase()
    vase.setPosition(610, 80, 50)
    vase.setRotation(Math.PI / 2, 0, 0)
    vase.addToScene(this.scene)
  }

  addAxesHelper() {
    this.axesHelper = new AxesHelper(1000)
  }

  animate() {
    if (this.Controls.showAxes) {
      this.scene.add(this.axesHelper)
    } else {
      this.scene.remove(this.axesHelper)
    }

    if (this.Controls.showRoof) {
      this.scene.add(this.roof_1)
      this.scene.add(this.roof_2)
    } else {
      this.scene.remove(this.roof_1)
      this.scene.remove(this.roof_2)
    }

    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate.bind(this))
  }

  /**
   * 判断鼠标是否点击了某个物体，将鼠标点击位置转换成三维空间中的位置
   * 从摄像机的位置向点击转化后的三维空间位置发射射线，判断物体是否在这条射线上，如果在，就意味着点击了该物体。
   * @param {*} event
   */
  onMouseDown(event) {
    const Sx = event.clientX;//鼠标单击位置横坐标
    const Sy = event.clientY;//鼠标单击位置纵坐标
    //屏幕坐标转标准设备坐标
    const x = ( Sx / window.innerWidth ) * 2 - 1;//标准设备横坐标
    const y = -( Sy / window.innerHeight ) * 2 + 1;//标准设备纵坐标
    // const standardVector  = new THREE.Vector3(x, y, 0.5);//标准设备坐标
    // //标准设备坐标转世界坐标
    // const worldVector = standardVector.unproject(camera);
    // //射线投射方向单位向量(worldVector坐标减相机位置坐标)
    // const ray = worldVector.sub(camera.position).normalize();
    // //创建射线投射器对象
    // const raycaster = new THREE.Raycaster(camera.position, ray);
    const rayRaster = new Raycaster()
    rayRaster.setFromCamera(new Vector2(x, y), this.camera)
    // 射线穿过的物体，也就是点中的物体
    // 返回一个数组，所有点击到的物体集合
    const intersects = rayRaster.intersectObjects([this.doorSet.door])
    if (intersects.length > 0) {
      this.doorSet.animate()
    }
  }
}
