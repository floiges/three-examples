import * as THREE from 'three';
import { sizes, addResizeEventListener } from './common';
import './style.css';

// 下雨动画

// 初始化渲染器
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000);

// 初始化场景
const scene = new THREE.Scene();

// 初始化相机
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 1, 1000);
// 相机位置
camera.position.set(0, 0, 1);
// 看向原点
camera.lookAt(0, 0, 0);
// 相机默认是看向z轴负方向的
// 设置相机的旋转角度，望向天空
camera.rotation.x = 1.16;
camera.rotation.y = -0.12;
camera.rotation.z = 0.27;
scene.add(camera);

// 创建云层
const cloudTexture = new THREE.TextureLoader().load('./images/smoke.png'); // 云朵素材
// 生成30个云朵物体，随机设置位置和旋转，形成铺开和层叠效果
const clouds = [];
for (let i = 0; i < 500; i++) {
  const cloudGeometry = new THREE.PlaneBufferGeometry(564, 300);
  const cloudMaterial = new THREE.MeshLambertMaterial({
    map: cloudTexture,
    transparent: true,
  });
  const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial); // 云朵物体
  cloud.material.opacity = 0.6;
  cloud.position.x = Math.random() * 1000 - 460;
  cloud.position.y = 600;
  cloud.position.z = Math.random() * 500 - 400;
  cloud.rotation.x = 1.16;
  cloud.rotation.y = -0.12;
  cloud.rotation.z = Math.random() * 360;
  scene.add(cloud);
  clouds.push(cloud);
}

// 光照
const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

const directionLight = new THREE.DirectionalLight(0xffeedd);
directionLight.position.set(0, 0, 1);
scene.add(directionLight);

// 模拟闪电
const lightning = new THREE.PointLight(0x062d89, 30, 500, 1.7);
lightning.position.set(200, 300, 100);
scene.add(lightning);

// 创建雨滴
// 使用THREE.Points，可以非常容易地创建很多细小的物体，用来模拟雨滴、雪花、烟和其他有趣的效果
// THREE.Points的核心思想，就是先声明一个几何体geom，然后确定几何体各个顶点的位置，这些顶点的位置将会是各个粒子的位置。
// 通过PointsMaterial确定顶点的材质material，然后new Points(geom, material)，根据传入的几何体和顶点材质生成一个粒子系统

// 粒子的移动： 粒子的位置坐标是由一组数字确定const positions = this.geom.attributes.position.array，这组数字，每三个数确定一个坐标点（x\y\z），
// 所以要改变粒子的X坐标，就改变positions[ 3n ] (n是粒子序数)；同理，Y坐标对应的是positions[ 3n+1 ]，Z坐标对应的是positions[ 3n+2 ]。
const dropTexture = new THREE.TextureLoader().load('./images/rain-drop.png');
const dropsMaterial = new THREE.PointsMaterial({
  size: 0.2,
  map: dropTexture,
  transparent: true,
});
const dropsGeometry = new THREE.BufferGeometry();

const positions = [];
const velocityY = [];
const dropsCount = 8000;

for (let index = 0; index < dropsCount; index++) {
  positions.push(Math.random() * 400 - 200);
  positions.push(Math.random() * 500 - 250);
  positions.push(Math.random() * 400 - 200);
  velocityY.push(0.5 + Math.random() / 2);
}

// 确定各个定点的位置坐标
dropsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
// 粒子系统
const drops = new THREE.Points(dropsGeometry, dropsMaterial);
scene.add(drops);

addResizeEventListener(renderer, camera);

const tick = () => {
  // 雨滴动画
  const positions = dropsGeometry.attributes.position.array;
  for (let index = 0; index < dropsCount * 3; index += 3) {
    velocityY[index / 3] += Math.random() * 0.5;
    positions[index + 1] -= velocityY[index / 3];
    if (positions[index + 1] < -200) {
      positions[index + 1] = 200;
      velocityY[index / 3] = 0.5 + Math.random() / 2;
    }
  }
  drops.rotation.y += 0.002;
  dropsGeometry.attributes.position.needsUpdate = true;

  // 云朵绕z轴旋转
  clouds.forEach(cloud => {
    cloud.rotation.z -= 0.003
  });

  // 不断随机改变点光源PointLight的强度（power），形成闪烁的效果，当强度较小，即光线暗下来时，"悄悄"改变点光源的位置，这样就能不突兀使闪电随机地出现在云层地各个位置
  if (Math.random() > 0.93 || lightning.power > 100) {
    if (lightning.power < 100) {
      lightning.position.set(
        Math.random() * 400,
        300 + Math.random() * 200,
        100
      );
    }
    lightning.power = 50 + Math.random() * 500;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();