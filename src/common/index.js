/**
 * 渲染尺寸
 */
export const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

export const resizeRendererToDisplaySize = (renderer, camera) => {
  // 更新渲染
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 更新相机
  camera.aspect = sizes.width / sizes.height;
  // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
  // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
  // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
  camera.updateProjectionMatrix();
}

/**
 * 监听页面缩放
 */
export const addResizeEventListener = (renderer, camera) => {
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    // 更新渲染
    resizeRendererToDisplaySize(renderer, camera)
  }, false);
}

export const resizeRendererToDisplaySize2 = (canvas, renderer, camera) => {
  const pixelRatio = window.devicePixelRatio
  const width = Math.floor(sizes.width * pixelRatio)
  const height = Math.floor(sizes.height * pixelRatio)
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    // 一旦我们知道了是否需要调整大小我们就调用renderer.setSize然后 传入新的宽高。在末尾传入false很重要。
    // render.setSize默认会设置canvas的CSS尺寸但这并不是我们想要的。
    // 我们希望浏览器能继续工作就像其他使用CSS来定义尺寸的其他元素。我们不希望 three.js使用canvas和其他元素不一样。
    renderer.setSize(width, height, false)

     // 更新相机
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
  }
}

/**
 * 监听页面缩放
 */
export const addResizeEventListener2 = (renderer, camera) => {
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    // 更新渲染
    resizeRendererToDisplaySize2(renderer, camera)
  });
}