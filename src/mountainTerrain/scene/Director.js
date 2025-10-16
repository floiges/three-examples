import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { addResizeEventListener, resizeRendererToDisplaySize } from '../../common'
import mesh, { updatePosition } from '../objects/mesh'

export default class Director {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl')

    // this.gui = new GUI()

    this.init()

    this.animate()
  }

  init() {
    this.scene = new THREE.Scene()
    this.scene.add(mesh)

    // const axesHelper = new THREE.AxesHelper(200)
    // this.scene.add(axesHelper)

    const width = this.canvas.clientWidth;
		const height = this.canvas.clientHeight;

    this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
    this.camera.position.set(450, 150, 100)
    this.camera.lookAt(0, 0, 0)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas })

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.addEventListener('change', () => {
      console.log(this.camera.position)
    })

    resizeRendererToDisplaySize(this.renderer, this.camera)
    addResizeEventListener(this.renderer, this.camera)
  }

  resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {
			renderer.setSize( width, height, false );
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
		}

		return needResize;
	}

  animate(time) {
    // time *= 0.001

    updatePosition()
    mesh.rotateZ(0.003)

    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}