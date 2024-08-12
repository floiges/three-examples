import * as THREE from 'three'
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry'
import { TextGeometry } from 'three/addons/geometries/TextGeometry'
import { FontLoader } from 'three/addons/loaders/FontLoader'
import { addResizeEventListener, resizeRendererToDisplaySize } from '../../common'

export default class Director {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl')

    this.objects = []
    this.spread = 15

    this.init()

    this.createObjects()
    this.animate()
  }

  init() {
    this.initPerspectiveCamera()
    this.initScene()
    this.initRenderer()

    resizeRendererToDisplaySize(this.renderer, this.camera)

    this.addDirectionalLight1()
    this.addDirectionalLight2()
    addResizeEventListener(this.renderer, this.camera)
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas })
  }

  initPerspectiveCamera() {
    const fov = 75
    const aspect = 2
    const near = 0.1
    const far = 1000

    this.camera = new THREE.PerspectiveCamera(
      fov,
      aspect,
      near,
      far
    )
    this.camera.position.z = 120
  }

  initScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xAAAAAA)
  }

  addDirectionalLight1() {
    const color = 0xFFFFFF
    const intensity = 3
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    this.scene.add(light)
  }

  addDirectionalLight2() {
    const color = 0xFFFFFF
    const intensity = 3
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(1, -2, -4)
    this.scene.add(light)
  }

  /**
   * 一个canvas的内部尺寸，它的分辨率，通常被叫做绘图缓冲区(drawingbuffer)尺寸。
   * 在three.js中我们可以通过调用renderer.setSize来设置canvas的绘图缓冲区。
   * 我们应该选择什么尺寸? 最显而易见的是"和canvas的显示尺寸一样"。 即可以直接用canvas的clientWidth和clientHeight属性。
   */
  // resizeRendererToDisplaySize() {
  //   const pixelRatio = window.devicePixelRatio
  //   const width = Math.floor(this.canvas.clientWidth * pixelRatio)
  //   const height = Math.floor(this.canvas.clientHeight * pixelRatio)
  //   const needResize = this.canvas.width !== width || this.canvas.height !== height
  //   if (needResize) {
  //     // 一旦我们知道了是否需要调整大小我们就调用renderer.setSize然后 传入新的宽高。在末尾传入false很重要。
  //     // render.setSize默认会设置canvas的CSS尺寸但这并不是我们想要的。
  //     // 我们希望浏览器能继续工作就像其他使用CSS来定义尺寸的其他元素。我们不希望 three.js使用canvas和其他元素不一样。
  //     this.renderer.setSize(width, height, false)
  //   }
  //   return needResize
  // }

  addObject(x, y, obj) {
    obj.position.x = x * this.spread
    obj.position.y = y* this.spread

    this.scene.add(obj)
    this.objects.push(obj)
  }

  createMaterial() {
    const material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide })

    const hue = Math.random()
    const saturation = 1
    const luminance = .5
    // 在色轮上，hue 值从 0 到 1，红色在 0 的位置，绿色在 .33 的位置，蓝色在 .66 的位置。
    // saturation 值从 0 到 1，0 表示没有颜色，1 表示饱和度最高。
    // luminance 值从 0 到 1，0 表示黑色，1 表示白色，0.5 表示最大数量的颜色。
    // 换句说话，luminance 从 0 到 0.5 表示颜色从黑到 hue，从 0.5 到 1.0 表示颜色从 hue 到白。
    material.color.setHSL(hue, saturation, luminance)

    return material
  }

  addSolidGeometry(x, y, geometry) {
    const mesh = new THREE.Mesh(geometry, this.createMaterial())
    this.addObject(x, y, mesh)
  }

  addLineGeometry(x, y, geometry) {
    const material = new THREE.LineBasicMaterial({ color: 0x000000 })
    const mesh = new THREE.LineSegments(geometry, material)
    this.addObject(x, y, mesh)
  }

  createObjects() {
    {
      const width = 8
      const height = 8
      const depth = 8
      this.addSolidGeometry(-2, 2, new THREE.BoxGeometry(width, height, depth))
    }

    {
      const radius = 7
      const segments = 24
      this.addSolidGeometry(-1, 2, new THREE.CircleGeometry(radius, segments))
    }

    {
      const radius = 6
      const height = 8
      const segments = 16
      this.addSolidGeometry(0, 2, new THREE.ConeGeometry(radius, height, segments))
    }

    {
      const radiusTop = 4
      const radiusBottom = 4
      const height = 12
      const radialSegments = 12
      this.addSolidGeometry(1, 2, new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments))
    }

    {
      const radius = 7
      this.addSolidGeometry(2, 2, new THREE.DodecahedronGeometry(radius))
    }

    {
      const shape = new THREE.Shape()
      const x = -2.5
      const y = -5
      shape.moveTo(x + 2.5, y + 2.5)
      shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y)
      shape.bezierCurveTo( x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5 );
      shape.bezierCurveTo( x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5 );
      shape.bezierCurveTo( x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5 );
      shape.bezierCurveTo( x + 8, y + 3.5, x + 8, y, x + 5, y );
      shape.bezierCurveTo( x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5 );

      const extrudeSettings = {
        steps: 2,
        depth: 2,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 2
      }
      this.addSolidGeometry(-2, 1, new THREE.ExtrudeGeometry(shape, extrudeSettings))
    }

    {
      const radius = 7
      this.addSolidGeometry(-1, 1, new THREE.IcosahedronGeometry(radius))
    }

    {
      const points = []
      for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * .8))
      }
      this.addSolidGeometry(0, 1, new THREE.LatheGeometry(points))
    }

    {
      const radius = 7
      this.addSolidGeometry(1, 1, new THREE.OctahedronGeometry(radius))
    }

    {
      // 克莱因瓶
      function klein( v, u, target ) {

        u *= Math.PI;
        v *= 2 * Math.PI;
        u = u * 2;

        let x;
        let z;

        if ( u < Math.PI ) {

          x = 3 * Math.cos( u ) * ( 1 + Math.sin( u ) ) + ( 2 * ( 1 - Math.cos( u ) / 2 ) ) * Math.cos( u ) * Math.cos( v );
          z = - 8 * Math.sin( u ) - 2 * ( 1 - Math.cos( u ) / 2 ) * Math.sin( u ) * Math.cos( v );

        } else {

          x = 3 * Math.cos( u ) * ( 1 + Math.sin( u ) ) + ( 2 * ( 1 - Math.cos( u ) / 2 ) ) * Math.cos( v + Math.PI );
          z = - 8 * Math.sin( u );

        }

        const y = - 2 * ( 1 - Math.cos( u ) / 2 ) * Math.sin( v );

        target.set( x, y, z ).multiplyScalar( 0.75 );

      }

      const slices = 25;
      const stacks = 25;
      this.addSolidGeometry( 2, 1, new ParametricGeometry( klein, slices, stacks ) );
    }

    {
      const width = 9;
      const height = 9;
      const widthSegments = 2;
      const heightSegments = 2;
      this.addSolidGeometry(-2, 0, new THREE.PlaneGeometry(width, height, widthSegments, heightSegments));
    }

    {
      const verticesOfCube = [
        - 1, - 1, - 1, 1, - 1, - 1, 1, 1, - 1, - 1, 1, - 1,
			  - 1, - 1, 1, 1, - 1, 1, 1, 1, 1, - 1, 1, 1,
      ];
      const indicesOfFaces = [
        2, 1, 0, 0, 3, 2,
        0, 4, 7, 7, 3, 0,
        0, 1, 5, 5, 4, 0,
        1, 2, 6, 6, 5, 1,
        2, 3, 7, 7, 6, 2,
        4, 5, 6, 6, 7, 4,
      ];
      const radius = 7;
      const detail = 2;
      this.addSolidGeometry(-1, 0, new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, radius, detail));
    }

    {
      const innerRadius = 2;
      const outerRadius = 7;
      const segments = 18;
      this.addSolidGeometry(0, 0, new THREE.RingGeometry(innerRadius, outerRadius, segments));
    }

    {
      const shape = new THREE.Shape();
      const x = - 2.5;
      const y = - 5;
      shape.moveTo( x + 2.5, y + 2.5 );
      shape.bezierCurveTo( x + 2.5, y + 2.5, x + 2, y, x, y );
      shape.bezierCurveTo( x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5 );
      shape.bezierCurveTo( x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5 );
      shape.bezierCurveTo( x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5 );
      shape.bezierCurveTo( x + 8, y + 3.5, x + 8, y, x + 5, y );
      shape.bezierCurveTo( x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5 );
      this.addSolidGeometry( 1, 0, new THREE.ShapeGeometry( shape ) );
    }

    {
      const radius = 7
      const widthSegments = 12;
      const heightSegments = 8;
      this.addSolidGeometry(2, 0, new THREE.SphereGeometry(radius, widthSegments, heightSegments));
    }

    {
      const radius = 7
      this.addSolidGeometry(-2, -1, new THREE.TetrahedronGeometry(radius));
    }

    {
      const loader = new FontLoader();
      // promisify font loading
      function loadFont( url ) {

        return new Promise( ( resolve, reject ) => {

          loader.load( url, resolve, undefined, reject );

        } );

      }
      const doit = async () => {
        const font = await loadFont( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json' ); /* threejs.org: url */
        const geometry = new TextGeometry( 'three.js', {
          font,
          size: 3.0,
          depth: 0.2,
          height: 0.1,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.15,
          bevelSize: 0.3,
          bevelSegments: 5,
        } );
        const mesh = new THREE.Mesh( geometry, this.createMaterial() );
        // 我们想让文字绕着它的中心旋转，但默认的，Three.js 创建的文字的旋转中心在左边。
        // 变通的方法是要求 Three.js 计算几何体的边界框。然后我们可以对边界框调用 getCenter，将网格位置对象传给它。
        // getCenter 将盒子的中心值复制进位置对象。 同时它也返回位置对象，这样我们就可以调用 multiplyScalar(-1) 来放置整个对象，这样对象的旋转中心就是对象的中心了。
        geometry.computeBoundingBox();
        geometry.boundingBox.getCenter( mesh.position ).multiplyScalar( - 1 );

        const parent = new THREE.Object3D();
        parent.add( mesh );

        this.addObject( - 1, - 1, parent );
      }
      doit();
    }

    {
      const radius = 5;
      const tubeRadius = 2;
      const radialSegments = 8;
      const tubularSegments = 24;
      this.addSolidGeometry(0, -1, new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments));
    }

    {
      const radius = 3.5;
      const tube = 1.5;
      const radialSegments = 8;
      const tubularSegments = 64;
      const p = 2;
      const q = 3;
      this.addSolidGeometry(1, -1, new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q));
    }

    {
      class CustomSinCurve extends THREE.Curve {
        constructor(scale) {
          super();
          this.scale = scale;
        }
        getPoint(t) {
          const tx = t * 3 - 1.5;
          const ty = Math.sin(2 * Math.PI * t);
          const tz = 0;
          return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
        }
      }

      const path = new CustomSinCurve(4);
      const tubularSegments = 20;
      const radius = 1;
      const radialSegments = 8;
      const closed = false;
		  this.addSolidGeometry( 2, - 1, new THREE.TubeGeometry( path, tubularSegments, radius, radialSegments, closed ) );
    }

    {
      const width = 8;
      const height = 8;
      const depth = 8;
      const thresholdAngle = 15;
      this.addLineGeometry(-1, -2, new THREE.EdgesGeometry(new THREE.BoxGeometry(width, height, depth), thresholdAngle));
    }

    {
      const width = 8;
      const height = 8;
      const depth = 8;
      this.addLineGeometry(1, -2, new THREE.WireframeGeometry(new THREE.BoxGeometry(width, height, depth)));
    }
  }

  animate(time) {
    // requestAnimationFrame会将页面开始加载到函数运行所经历的时间当作入参传给回调函数，单位是毫秒数。但我觉得用秒会更简单所以我将它转换成了秒。
    // 然后我们把立方体的X轴和Y轴方向的旋转角度设置成这个时间。这些旋转角度是弧度制。一圈的弧度为2Π，所以我们的立方体在每个方向旋转一周的时间为6.28秒。

    time *= 0.001

    // if (this.resizeRendererToDisplaySize(this.renderer)) {
      // this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
      // this.camera.updateProjectionMatrix()
    // }

    // this.cube.rotation.x = time
    // this.cube.rotation.y = time
    this.objects.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1
      const rot = time * speed * 0.05
      cube.rotation.x = rot
      cube.rotation.y = rot
    })


    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}