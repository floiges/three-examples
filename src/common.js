/**
 * 渲染尺寸
 */
export const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

/**
 * 监听页面缩放
 */
export const addResizeEventListener = (renderer, camera) => {
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
}