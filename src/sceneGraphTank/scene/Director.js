import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { sizes } from '../../common'

export default class Director {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl')

    this.objects = []
    this.gui = new GUI()

    this.targetPosition = new THREE.Vector3()
    this.tankPosition = new THREE.Vector2()
    this.tankTarget = new THREE.Vector2()

    this.init()

    this.createObjects()

    this.animate(0)
  }

  init() {
    this.initScene()
    this.initRenderer()
    this.addLight()
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas })
    this.renderer.setClearColor(0xAAAAAA)
    this.renderer.shadowMap.enabled = true
  }

  makeCamera(fov = 40) {
    const aspect = 2
    const zNear = 0.1
    const zFar = 1000
    return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar)
  }

  initScene() {
    this.scene = new THREE.Scene()
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

  addLight() {
    {
      const light = new THREE.DirectionalLight(0x00ffff, 3)
      light.position.set(0, 20, 0)
      this.scene.add(light)
      light.castShadow = true
      light.shadow.mapSize.width = 2048
      light.shadow.mapSize.height = 2048

      const d = 50
      light.shadow.camera.left = -d
      light.shadow.camera.right = d
      light.shadow.camera.top = d
      light.shadow.camera.bottom = -d
      light.shadow.camera.near = 1
      light.shadow.camera.far = 50
      light.shadow.bias = 0.001
    }

    {
      const light = new THREE.DirectionalLight(0xffffff, 3)
      light.position.set(1, 2, 4)
      this.scene.add(light)
    }
  }

  createObjects() {
    const camera = this.makeCamera()
    camera.position.set(8, 4, 10).multiplyScalar(3)
    camera.lookAt(0, 0, 0)
    // this.scene.add(camera)

    const groundGeometry = new THREE.PlaneGeometry(50, 50)
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xCC8866 })
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
    groundMesh.rotation.x = Math.PI * -.5
    groundMesh.receiveShadow = true
    this.scene.add(groundMesh)

    const carWidth = 4
    const carHeight = 1
    const carLength = 8

    const tank = new THREE.Object3D()
    this.scene.add(tank)

    const bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength)
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x6688AA })
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial)
    bodyMesh.position.y = 1.4
    bodyMesh.castShadow = true
    tank.add(bodyMesh)
    this.tank = tank

    const tankCameraFov = 75
    const tankCamera = this.makeCamera(tankCameraFov)
    tankCamera.position.y = 3
    tankCamera.position.z = -6
    tankCamera.rotation.y = Math.PI
    bodyMesh.add(tankCamera)

    const wheelRadius = 1
    const wheelThickness = .5
    const wheelSegments = 6
    const wheelGeometry = new THREE.CylinderGeometry(
      wheelRadius, // top radius
      wheelRadius, // bottom radius
      wheelThickness, // height of cylinder
      wheelSegments
    )
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 })
    const wheelPositions = [
      [ - carWidth / 2 - wheelThickness / 2, - carHeight / 2, carLength / 3 ],
      [ carWidth / 2 + wheelThickness / 2, - carHeight / 2, carLength / 3 ],
      [ - carWidth / 2 - wheelThickness / 2, - carHeight / 2, 0 ],
      [ carWidth / 2 + wheelThickness / 2, - carHeight / 2, 0 ],
      [ - carWidth / 2 - wheelThickness / 2, - carHeight / 2, - carLength / 3 ],
      [ carWidth / 2 + wheelThickness / 2, - carHeight / 2, - carLength / 3 ],
    ]
    const wheelMeshes = wheelPositions.map(position => {
      const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial)
      mesh.position.set(...position)
      mesh.rotation.z = Math.PI * .5
      mesh.castShadow = true
      bodyMesh.add(mesh)
      return mesh
    })

    this.wheelMeshes = wheelMeshes

    const domeRadius = 2
    const domeWidthSubdivisions = 12
    const domeHeightSubdivisions = 12
    const domePhiStart = 0
    const domePhiEnd = Math.PI * 2
    const domeThetaStart = 0
    const domeThetaEnd = Math.PI * .5
    const domeGeometry = new THREE.SphereGeometry(
      domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,
      domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd
    )
    const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial)
    domeMesh.castShadow = true
    bodyMesh.add(domeMesh)
    domeMesh.position.y = .5

    const turretWidth = .1
    const turretHeight = .1
    const turretLength = carLength * .75 * .2
    const turretGeometry = new THREE.BoxGeometry(
      turretWidth, turretHeight, turretLength
    )
    const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial)
    const turretPivot = new THREE.Object3D()
    turretMesh.castShadow = true
    turretPivot.scale.set(5, 5, 5)
    turretPivot.position.y = .5
    turretMesh.position.z = turretLength * .5
    turretPivot.add(turretMesh)
    bodyMesh.add(turretPivot)
    this.turretPivot = turretPivot

    const turretCamera = this.makeCamera()
    turretCamera.position.y = .75 * .2
    turretMesh.add(turretCamera)
    this.turretCamera = turretCamera

    const targetGeometry = new THREE.SphereGeometry(.5, 6, 3)
    const targetMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00, flatShading: true })
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial)
    const targetOrbit = new THREE.Object3D()
    const targetElevation = new THREE.Object3D()
    const targetBob = new THREE.Object3D()
    targetMesh.castShadow = true
    this.scene.add(targetOrbit)
    targetOrbit.add(targetElevation)
    targetElevation.position.z = carLength * 2
    targetElevation.position.y = 8
    targetElevation.add(targetBob)
    targetBob.add(targetMesh)

    this.targetOrbit = targetOrbit
    this.targetBob = targetBob
    this.targetMesh = targetMesh
    this.targetMaterial = targetMaterial

    const targetCamera = this.makeCamera()
    const targetCameraPivot = new THREE.Object3D()
    targetCamera.position.y = 1
    targetCamera.position.z = -2
    targetCamera.rotation.y = Math.PI
    targetBob.add(targetCameraPivot)
    targetCameraPivot.add(targetCamera)
    this.targetCameraPivot = targetCameraPivot

    // create a sine-like wave
    const curve = new THREE.SplineCurve( [
      new THREE.Vector2( - 10, 0 ),
      new THREE.Vector2( - 5, 5 ),
      new THREE.Vector2( 0, 0 ),
      new THREE.Vector2( 5, - 5 ),
      new THREE.Vector2( 10, 0 ),
      new THREE.Vector2( 5, 10 ),
      new THREE.Vector2( - 5, 10 ),
      new THREE.Vector2( - 10, - 10 ),
      new THREE.Vector2( - 15, - 8 ),
      new THREE.Vector2( - 10, 0 ),
    ] )
    const points = curve.getPoints(50)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
    const splineObject = new THREE.Line(geometry, material)
    splineObject.rotation.x = Math.PI * .5
    splineObject.position.y = 0.05
    this.scene.add(splineObject)

    this.curve = curve

    this.cameras = [
      { cam: camera, desc: 'detached camera' },
      { cam: turretCamera, desc: 'on turret looking at target' },
      { cam: targetCamera, desc: 'near target looking at tank' },
      { cam: tankCamera, desc: 'above back of tank' }
    ]

  }

  animate(time) {
    time *= 0.001

    if (this.resizeRendererToDisplaySize(this.renderer)) {
			this.cameras.forEach( ( cameraInfo ) => {
				const camera = cameraInfo.cam;
				camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
				camera.updateProjectionMatrix();
			});
		}

    // move target
    this.targetOrbit.rotation.y = time * .27
    this.targetBob.position.y = Math.sin(time * 2) * 4
    this.targetMesh.rotation.x = time * 7
    this.targetMesh.rotation.y = time * 13
    this.targetMaterial.emissive.setHSL(time * 10 % 1, 1, .25)
    this.targetMaterial.color.setHSL(time * 10 % 1, 1, .25)

    // move tank
    const tankTime = time * .05
    this.curve.getPointAt( tankTime % 1, this.tankPosition );
		this.curve.getPointAt( ( tankTime + 0.01 ) % 1, this.tankTarget );
		this.tank.position.set( this.tankPosition.x, 0, this.tankPosition.y );
		this.tank.lookAt( this.tankTarget.x, 0, this.tankTarget.y );

    	// face turret at target
		this.targetMesh.getWorldPosition( this.targetPosition );
		this.turretPivot.lookAt( this.targetPosition );

		// make the turretCamera look at target
		this.turretCamera.lookAt( this.targetPosition );

		// make the targetCameraPivot look at the at the tank
		this.tank.getWorldPosition( this.targetPosition );
		this.targetCameraPivot.lookAt( this.targetPosition );

		this.wheelMeshes.forEach( ( obj ) => {
			obj.rotation.x = time * 3;
		} );

    const camera = this.cameras[time * .25 % this.cameras.length | 0]
    this.renderer.render(this.scene, camera.cam)

    requestAnimationFrame(this.animate.bind(this))
  }
}