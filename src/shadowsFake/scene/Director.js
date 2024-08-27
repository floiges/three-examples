import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { sizes } from '../../common'

export default class Director {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl')

    this.init()
    this.createObjects()
    this.animate()
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas })

    const fov = 45
    const aspect = 2
    const near = 0.1
    const far = 100
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    this.camera.position.set(0, 10, 20)
    this.camera.lookAt(0, 0, 0)

    this.controls = new OrbitControls(this.camera, this.canvas)
    // OrbitControls 可以围绕某一个点旋转控制相机
    this.controls.target.set(0, 5, 0)
    this.controls.update()

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('white')

    // 创建辅助坐标系
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
  }

  createObjects() {
    const loader = new THREE.TextureLoader()

    {
      const planeSize = 40
      const texture = loader.load('./images/checker.png')
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.magFilter = THREE.NearestFilter
      texture.colorSpace = THREE.SRGBColorSpace

      const repeats = planeSize / 2
      texture.repeat.set(repeats, repeats)

      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      })
      // 将颜色设置为1.5, 1.5, 1.5，这将是棋盘纹理的颜色倍增 1.5，1.5，1.5。
      // 也就是说纹理原本的颜色是 0x808080 和 0xC0C0C0，是灰色和浅灰色，现在灰色和浅灰色乘以 1.5 将得到白色和浅灰色的棋盘
      planeMat.color.setRGB(1.5, 1.5, 1.5)
      const mesh = new THREE.Mesh(planeGeo, planeMat)
      mesh.rotation.x = Math.PI * -.5
      this.scene.add(mesh)
    }

    // 假阴影
    const shadowTexture = loader.load('./images/roundshadow.png')
    this.sphereShadowBases = []

    {
      const sphereRadius = 1
      const sphereWidthDivisions = 32
      const sphereHeightDivisions = 16
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)

      const planeSize = 1
      const shadowGeo = new THREE.PlaneGeometry(planeSize, planeSize)

      const numSpheres = 15
      for (let i = 0; i < numSpheres; i++) {
        // make a base for the shadow and the sphere
        // so they move together
        const base = new THREE.Object3D()
        this.scene.add(base)

        // add the shadow to the base
        // note: we make a new material for each sphere
        // so we can set that sphere's material transparency separately
        const shadowMat = new THREE.MeshBasicMaterial({
          map: shadowTexture,
          transparent: true, // so we can see the ground 防止 Z 轴阴影和地面重叠
          depthWrite: false, // so we don't have to sort 使阴影之间不会彼此混淆
        })
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
        shadowMesh.position.y = 0.001 // so we're above the ground slightly
        shadowMesh.rotation.x = Math.PI * -.5

        const shadowSize = sphereRadius * 4
        shadowMesh.scale.set(shadowSize, shadowSize, shadowSize)
        base.add(shadowMesh)

        // add the sphere to the base
        const u = i / numSpheres
        const sphereMat = new THREE.MeshPhongMaterial()
        sphereMat.color.setHSL(u, 1, .75)
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
        sphereMesh.position.set(0, sphereRadius + 2, 0)
        base.add(sphereMesh)

        // remember all 3 plus the y position
        this.sphereShadowBases.push({ base, sphereMesh, shadowMesh, y: sphereMesh.position.y })
      }
    }

    {
      const skyColor = 0xB1E1FF // light blue
      const groundColor = 0xB97A20 // brownish orange
      const intensity = 1
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
      this.scene.add(light)
    }

    {
      const color = 0xFFFFFF
      const intensity = .25
      const light = new THREE.DirectionalLight(color, intensity)
      light.position.set(0, 10, 5)
      light.target.position.set(-5, 0, 0)
      this.scene.add(light)
      this.scene.add(light.target)
    }
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

  animate(time) {
    time *= 0.001 // convert to seconds

    this.resizeRendererToDisplaySize(this.renderer)

    {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
      this.camera.updateProjectionMatrix()
    }

    // 在 XZ 平面上移动。
    // 使用Math.abs(Math.sin(time))将球体上下移动，这样会带来一个类似弹性的动画。并且我们还设置了阴影材质的不透明度，与球体的高度相关。高度越高，阴影越模糊
    this.sphereShadowBases.forEach((nbase, ndx) => {
      const { base, sphereMesh, shadowMesh, y } = nbase

      // u is a value that goes from 0 to 1 as we iterate the spheres
      const u = ndx / this.sphereShadowBases.length

      // compute a position for there base.
      // This will move both the sphere and its shadow
      const speed = time * .2
      const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1)
      const radius = Math.sin(speed - ndx) * 10
      base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)

      // yOff is a value that goes from 0 to 1
      const yOff = Math.abs(Math.sin(time * 2 + ndx))
      // move the sphere up and down
      sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff)
      // fade the shadow as the sphere goes up
      shadowMesh.material.opacity = THREE.MathUtils.lerp(1, .25, yOff)
    })

    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}
