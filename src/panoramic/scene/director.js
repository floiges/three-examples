import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Template from '../../common/Template'
import { addHemisphereLight, addDirectionalLight } from './light'
import { addOrbitControls } from '../../common/control/orbitControls'

export default class Director extends Template {
  constructor() {
    super()

    this.PCamera.fov = 75
    this.PCamera.far = 1100
    this.init()
    this.camera.target = new THREE.Vector3(0, 0, 0)

    this.interactPoints = [
      { name: 'point_0_outside_house', scale: 2, x: 0, y: 1.5, z: 24 },
      { name: 'point_1_outside_car', scale: 3, x: 40, y: 1, z: -20 },
      { name: 'point_2_outside_people', scale: 3, x: -20, y: 1, z: -30 },
      { name: 'point_3_inside_eating_room', scale: 2, x: -30, y: 1, z: 20 },
      { name: 'point_4_inside_bed_room', scale: 3, x: 48, y: 0, z: -20 }
    ];
    this.interactMeshes = []
    this.anchorMeshes = []

    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.lon = 0
    this.onMouseDownLon = 0
    this.lat = 0
    this.onMouseDownLat = 0
    this.onPointerDownX = 0
    this.onPointerDownY = 0
    this.phi = 0
    this.theta = 0
    this.camera_time = 0
    this.isUserIneracting = false

    addHemisphereLight(this.scene)
    addDirectionalLight(this.scene)

    addOrbitControls(this.camera, this.renderer.domElement)

    this.addFullView()

    document.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    document.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    document.addEventListener('touchstart', this.onTouchDown.bind(this), false);
    document.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    document.addEventListener('touchend', this.onMouseUp.bind(this), false);
    document.getElementById('konwButton').addEventListener('click', () => {
      document.getElementsByClassName('mask')[0].style.display = 'none';
    });
    document.getElementsByClassName('logo')[0].addEventListener('click', () => {
      document.getElementsByClassName('mask')[0].style.display = 'flex';
    });

    this.animate()
  }

  onMouseDown(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactMeshes);
    if (intersects.length > 0) {
      let name = intersects[0].object.name;
      if (name === 'point_0_outside_house') {
        this.camera_time = 1;
      } else if (name === 'point_4_inside_bed_room') {
        Toast('小偷就在这里', 2000);
        this.loadMurderer();
      } else {
        Toast(`小偷不在${name.includes('car') ? '车里' : name.includes('people') ? '人群' : name.includes('eating') ? '餐厅' : '这里'}`, 2000);
      }
    }
    this.isUserInteracting = true;
    this.onPointerDownX = event.clientX;
    this.onPointerDownY = event.clientY;
    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;
  }

  onTouchDown(event) {
    this.isUserInteracting = true;
    this.onPointerDownX = event.touches[0].pageX;
    this.onPointerDownY = event.touches[0].pageY;
    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    if (this.isUserInteracting) {
      this.lon = (this.onPointerDownX - event.clientX) * 0.1 + this.onPointerDownLon;
      this.lat = (event.clientY - this.onPointerDownY) * 0.1 + this.onPointerDownLat;
    }
  }

  onTouchMove(event) {
    if (this.isUserIneracting) {
      this.lon = (this.onPointerDownX - event.touches[0].pageX) * 0.1 + this.onPointerDownLon
      this.lat = (event.touches[0].pageY - this.onPointerDownY) * 0.1 + this.onPointerDownLat;
    }
  }

  onMouseUp(event) {
    this.isUserIneracting = false
  }

  // 全景
  addFullView() {
    const geometry = new THREE.SphereGeometry(500, 60, 60)
    // z 轴翻转
    geometry.scale(1, 1, -1)

    const loader = new THREE.TextureLoader()
    // 贴图
    const outside_low = new THREE.MeshBasicMaterial({
      map: loader.load('./images/panoramic/outside_low.jpg')
    })
    this.insideLow = new THREE.MeshBasicMaterial({
      map: loader.load('./images/panoramic/inside_low.jpg')
    })
    this.mesh = new THREE.Mesh(geometry, outside_low)
    // 异步加载高清纹理
    loader.load('./images/panoramic/outside.jpg', texture => {
      const outside = new THREE.MeshBasicMaterial({ map: texture })
      this.mesh.material = outside
    })
    this.loadMarker('outside')
    this.scene.add(this.mesh)
  }

  // 加载交互点
  loadMarker(type) {
    // 移除 marker
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const child = this.scene.children[i]
      if (/[inside|outside]/.test(child.name)) {
        this.scene.remove(child)
      }
    }

    // 创建一个 canvas 绘制文字
    this.outsideTextTip = this.makeTextSprite('进入室内查找')
    this.outsideTextTip.scale.set(2.2, 2.2, 2)
    this.outsideTextTip.position.set(-0.35, -1, 10)
    type === 'outside' && this.scene.add(this.outsideTextTip)
    const points = this.interactPoints.filter(it => it.name.includes(type))
    // 添加问号标记点
    const pointTexture = new THREE.TextureLoader().load('./images/panoramic/point.png')
    const pointMaterial = new THREE.SpriteMaterial({ map: pointTexture })
    points.map(item => {
      const point = new THREE.Sprite(pointMaterial)
      point.name = item.name
      point.scale.set(item.scale * 1.2, item.scale * 1.2, item.scale * 1.2)
      point.position.set(item.x, item.y, item.z)
      this.interactMeshes.push(point)
      this.scene.add(point)
    })

    // 加载地标模型
    const loader = new GLTFLoader()
    loader.load('./models/anchor.gltf', (object) => {
      object.scene.traverse(child => {
        if (!child.isMesh) return

        child.castShadow = true
        child.receiveShadow = true
        child.material.metalness = .4
        child.name.includes('黄') && (child.material.color = new THREE.Color(0xfffc00))
      })
      object.scene.rotation.y = Math.PI / 2
      points.map(item => {
        const anchor = object.scene.clone()
        anchor.position.set(item.x, item.y + 3, item.z)
        anchor.name = item.name
        anchor.scale.set(item.scale * 3, item.scale * 3, item.scale * 3)
        this.anchorMeshes.push(anchor)
        this.scene.add(anchor)
      })
    })
  }

  // 加载嫌疑人
  loadMurderer() {
    const texture = new THREE.TextureLoader().load('./images/panoramic/murderer.png')
    const material = new THREE.SpriteMaterial({ map: texture })
    this.muderer = new THREE.Sprite(material)
    this.muderer.name = 'murderer'
    this.muderer.scale.set(12, 12, 12)
    this.muderer.position.set(43, -1.5, -20)
    this.scene.add(this.muderer)
  }

  // 创建文字
  makeTextSprite(message, parameters = {}) {
    const fontface = parameters.hasOwnProperty('fontface') ? parameters['fontface'] : 'Arial'
    const fontsize = parameters.hasOwnProperty('fontsize') ? parameters['fontface'] : 32
    const borderThickness = parameters.hasOwnProperty('borderThickness') ? parameters['borderThickness'] : 4
    const borderColor = parameters.hasOwnProperty('borderColor') ? parameters['borderColor'] : { r: 0, g: 0, b: 0, a: 1.0 }
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = `${fontsize}px ${fontface}`

    context.strokeStyle = `rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`
    context.lineWidth = borderThickness
    context.fillStyle = '#fffc00'
    context.fillText(message, borderThickness, fontsize + borderThickness)
    context.font = `48px ${fontface}`
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
    const sprite = new THREE.Sprite(spriteMaterial)
    return sprite
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))

    this.update()
    this.anchorMeshes.map(item => item.rotation.y += 0.02)

  }

  // 捕捉鼠标
  update() {
    this.lat = Math.max(-85, Math.min(85, this.lat))
    this.phi = THREE.MathUtils.degToRad(90 - this.lat);
    this.theta = THREE.MathUtils.degToRad(this.lon);
    this.camera.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
    this.camera.target.y = 500 * Math.cos(this.phi);
    this.camera.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);
    this.camera.lookAt(this.camera.target);

    if (this.camera_time > 0 && this.camera_time < 50) {
      this.camera.target.x = 0;
      this.camera.target.y = 1;
      this.camera.target.z = 24;
      this.camera.lookAt(this.camera.target);
      this.camera.fov -= 1;
      this.camera.updateProjectionMatrix();
      this.camera_time++;
      this.outsideTextTip.visible = false
    } else if (this.camera_time === 50) {
      this.lat = -2;
      this.lon = 182;
      this.camera_time = 0;
      this.camera.fov = 75;
      this.camera.updateProjectionMatrix();
      this.mesh.material = this.inside_low;
      new THREE.TextureLoader().load('./assets/images/inside.jpg', (texture) => {
        const inside = new THREE.MeshBasicMaterial({
          map: texture
        });
        this.mesh.material = inside;
      });
      this.loadMarker('inside');
    }
    this.renderer.render(this.scene, this.camera)
  }
}