import { AxesHelper, Color, Fog, Vector3 } from 'three';
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

    this.addGround()
    this.addFloor()
    this.addWall()
    this.addRoof()

    addOrbitControls(this.camera, this.renderer.domElement)
    this.addAxesHelper()

    this.Controls = Gui()

    this.animate()
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

    // 侧面墙
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
    this.roof1 = new Roof(500, 1300, 10)
    this.roof1.setPosition(-241, 440, 0)
    this.roof1.setRotation(Math.PI / 2, Math.PI / 13, 0)
    this.roof1.addToScene(this.scene)

    this.roof2 = new Roof(500, 1300, 10)
    this.roof2.setPosition(241, 440, 0)
    this.roof2.setRotation(Math.PI / 2, -Math.PI / 13, 0)
    this.roof2.addToScene(this.scene)
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

    // if (this.Controls.showRoof) {
    //   this.scene.add
    // }

    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate.bind(this))
  }
}
