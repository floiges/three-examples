import Director from './scene/director'

/**
 * 360 全景
 * 第一种：创造一个容器，通常是球体或正方体，在其内表面贴上图片，然后将相机放在容器的中心
 * 第二种：就是使用THREE.CubeTextureLoader加载6个图片，然后将加载好的图像纹理作为整个场景Scene的背景，这样也能形成360度全景。
 */
new Director()