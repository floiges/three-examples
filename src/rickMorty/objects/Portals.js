import { Mesh, PlaneGeometry, ShaderMaterial, TextureLoader, Vector2, Vector3 } from 'three'
import { sizes } from '../../common';
import BaseObject from '../../common/objects/Base';
import portalVertexShader from '../shaders/portal/vertex.glsl';
import portalFragmentShader from '../shaders/portal/fragment.glsl';
import { options } from './options'

export default class Portals extends BaseObject {
  constructor() {
    super()

    const textureLoader = new TextureLoader()
    const portalGeometry = new PlaneGeometry(...arguments)
    this.portalMaterial = new ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0.0
        },
        perlinnoise: {
          type: 't',
          value: textureLoader.load('./images/rickMorty/images/perlinnoise.png')
        },
        sparknoise: {
          type: 't',
          value: textureLoader.load('./images/rickMorty/images/sparknoise.png')
        },
        waterturbulence: {
          type: 't',
          value: textureLoader.load('./images/rickMorty/images/waterturbulence.png')
        },
        noiseTex: {
          type: 't',
          value: textureLoader.load('./images/rickMorty/images/noise.png')
        },
        color5: {
          value: new Vector3(...options.color5),
        },
        color4: {
          value: new Vector3(...options.color4),
        },
        color3: {
          value: new Vector3(...options.color3),
        },
        color2: {
          value: new Vector3(...options.color2),
        },
        color1: {
          value: new Vector3(...options.color1),
        },
        color0: {
          value: new Vector3(...options.color0),
        },
        resolution: {
          value: new Vector2(sizes.width, sizes.height)
        }
      },
      fragmentShader: portalFragmentShader,
      vertexShader: portalVertexShader
    })
    const portal = new Mesh(portalGeometry, this.portalMaterial)
    // 我们在场景中还需要加载其他任务模型，其他模型不需要渲染辉光效果，只需要给传送门添加辉光效果，
    // 因此我们需要将传送门与其他模型设置为不同的层级，辉光效果渲染的时候只需要渲染到有传送门的层级，若不设置层级，辉光后期效果将在全局生效。
    // 可以通过 mesh.layers.set(layer_number) 的方式设置网格模型的层级。
    portal.layers.set(1)
    this.instance = portal
  }

  // 更新着色器材质的相关信息
  updateShaderMaterial(deltaTime) {
    this.portalMaterial.uniforms.time.value = deltaTime / 5000
    this.portalMaterial.uniforms.color5.value = new Vector3(...options.color5);
    this.portalMaterial.uniforms.color4.value = new Vector3(...options.color4);
    this.portalMaterial.uniforms.color3.value = new Vector3(...options.color3);
    this.portalMaterial.uniforms.color2.value = new Vector3(...options.color2);
    this.portalMaterial.uniforms.color1.value = new Vector3(...options.color1);
    this.portalMaterial.uniforms.color0.value = new Vector3(...options.color0);
  }
}