import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 来个基础纹理例子

// 定义渲染尺寸
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// 初始化渲染器
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
// 设置 canvas 的像素比为当前的屏幕像素比，避免高分屏下出现模糊情况
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 初始化场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(1, 1, 5);
camera.lookAt(scene.position);
scene.add(camera);

// 创建辅助坐标系
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Three提供的纹理加载器
const textureLoader = new THREE.TextureLoader()
// 导入纹理贴图基础贴图
const animalsTexture = textureLoader.load('./images/animals.png')

// 例子1:创建立方体

// 重复渲染
// 水平重复3次，垂直重复2次
animalsTexture.repeat.set(3, 2);
animalsTexture.wrapS = THREE.RepeatWrapping; // 水平重复
animalsTexture.wrapT = THREE.MirroredRepeatWrapping; // 垂直镜像重复

// 如果想把背景隐藏，可以使用灰度纹理
// 需要2张图，一张正常图，一张黑白图
// 例子就不写了，没搞黑白图


const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
  map: animalsTexture // 纹理贴图
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// 例子2:正反面渲染，把图贴到平面上
// 默认情况下只显示正面

// 例子3:纹理偏移，offset 属性
// x 轴为正数时，纹理向右偏移；负数则向左偏移
// y 轴为正数时，纹理向下偏移；负数则向上偏移
// animalsTexture.offset.set(0.1, -0.5);

// const circleGeometry = new THREE.CircleGeometry(0.5, 32);
// const material = new THREE.MeshBasicMaterial({
//   map: animalsTexture,
//   side: THREE.DoubleSide // 正反面都贴图
// });
// const circle = new THREE.Mesh(circleGeometry, material);
// scene.add(circle);

// 旋转纹理 rotation 属性
// 通过 rotation 旋转纹理
// 旋转时，是以弧度为单位。角度转弧度比较直观的公式是：角度度数 * Math.PI / 180
// 通过 center 设置旋转中心点
// 如果不设置旋转中心点，默认是以左上角为中心点进行旋转
// animalsTexture.rotation = 45 * Math.PI / 180;
// // 将 center 设置成 (0.5, 0.5)，此时x轴和y轴都是以元素的中心点作为旋转中心点了。
// animalsTexture.center.set(0.5, 0.5);

// const circleGeometry = new THREE.CircleGeometry(0.5, 32);
// const material = new THREE.MeshBasicMaterial({
//   map: animalsTexture,
//   side: THREE.DoubleSide // 正反面都贴图
// });
// const circle = new THREE.Mesh(circleGeometry, material);
// scene.add(circle);

// 页面缩放事件监听
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // 更新渲染
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 更新相机
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();