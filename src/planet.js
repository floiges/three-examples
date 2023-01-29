import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { sizes, addResizeEventListener } from './common';
import './style.css';

// 初始化渲染器
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
// 设置 canvas 的像素比为当前的屏幕像素比，避免高分屏下出现模糊情况
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 初始化场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1A1A1A);
// 场景雾化效果
// Fog 类定义的是线性雾，雾的密度随着距离线性增大，即场景中物体雾化效果随着随距离线性变化。
// Fog(color, near, far)
// color: 表示雾的颜色，如设置为白色，场景中远处物体为蓝色，场景中最近处距离物体是自身颜色，最远和最近之间的物体颜色是物体本身颜色和雾颜色的混合效果。
// near：表示应用雾化效果的最小距离，距离活动摄像机长度小于 near 的物体将不会被雾所影响。
// far：表示应用雾化效果的最大距离，距离活动摄像机长度大于 far 的物体将不会被雾所影响。
scene.fog = new THREE.Fog(0x1A1A1A, 1, 1000);

// 初始化相机
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height);
scene.add(camera);
camera.position.set(20, 100, 450);

// 初始化镜头轨道控制器 OrbitControls ，
// 通过它可以对三维场景用鼠标 🖱 进行缩放、平移、旋转等操作，本质上改变的不是场景，而是相机的位置参数。
// 可以选择通过设置 controls.enableDamping 为 true 来开启控制器的移动惯性，这样在使用鼠标交互过程中就会感觉更加流畅和逼真。
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 和现实世界一样，没有光线 🌞 的话就什么都看不见。
// 未添加光源之前场景中的所有网格元素都是黑色的，无法显示其颜色和材质表面的物理特性，此时就需要给场景添加光源，才能看见场景中的物体。
// 两个参数：光照颜色和强度
const light = new THREE.AmbientLight(0xdeedff, 1.5);
scene.add(light);

// 创建星球
const SphereMaterial = new THREE.MeshLambertMaterial({
  color: 0x03c03c,
  wireframe: true, // 是否显示几何模型的线框结构
});
// 半球几何体
const SphereGeometry = new THREE.SphereGeometry(80, 32, 32);
const planet = new THREE.Mesh(SphereGeometry, SphereMaterial);
scene.add(planet);

// 创建星球轨道环
// 圆环几何体
const TorusGeometry = new THREE.TorusGeometry(150, 8, 2, 120);
const TorusMaterial = new THREE.MeshLambertMaterial({
  color: 0x40a9ff,
  wireframe: true
});
const ring = new THREE.Mesh(TorusGeometry, TorusMaterial);
ring.rotation.x = Math.PI / 2;
ring.rotation.y = -0.1 * (Math.PI / 2);
scene.add(ring);

// 创建卫星
// 二十面几何体
const IcoGeometry = new THREE.IcosahedronGeometry(16, 0);
const IcoMaterial = new THREE.MeshToonMaterial({ color: 0xfffc00 });
const satellite = new THREE.Mesh(IcoGeometry, IcoMaterial);
scene.add(satellite);

// 星星
const stars = new THREE.Group();
for (let i = 0; i < 500; i++) {
  const geometry = new THREE.IcosahedronGeometry(Math.random() * 2, 0);
  const material = new THREE.MeshToonMaterial({ color: 0xeeeeee });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 700;
  mesh.position.y = (Math.random() - 0.5) * 700;
  mesh.position.z = (Math.random() - 0.5) * 700;
  mesh.rotation.x = Math.random() * 2 * Math.PI;
  mesh.rotation.y = Math.random() * 2 * Math.PI;
  mesh.rotation.z = Math.random() * 2 * Math.PI;
  stars.add(mesh);
}
scene.add(stars);

// 页面缩放事件监听
addResizeEventListener();

let rot = 0;

// 动画
const axis = new THREE.Vector3(0, 0, 1);
const tick = () => {
  // 更新渲染器
  renderer.render(scene, camera);
  // 给网格模型添加一个转动动画
  rot += Math.random() * 0.8;
  const radian = (rot * Math.PI) / 180;
  // 星球位置动画
  planet && (planet.rotation.y += .005);
  // 星球轨道环位置动画
  ring && (ring.rotateOnAxis(axis, Math.PI / 400));
  // 卫星位置动画
  satellite.position.x = 250 * Math.sin(radian);
  satellite.position.y = 100 * Math.cos(radian);
  satellite.position.z = -100 * Math.cos(radian);
  satellite.rotation.x += 0.005;
  satellite.rotation.y += 0.005;
  satellite.rotation.z -= 0.005;
  // 星星动画
  stars.rotation.y += 0.0009;
  stars.rotation.x -= 0.0003;
  // 更新控制器
  controls.update();
  // 页面重绘时调用自身
  window.requestAnimationFrame(tick);
}
tick();