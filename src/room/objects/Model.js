import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

/**
 * 添加桌子
 * @param {*} scene
 */
export function addTable(scene) {
  const mtlLoader = new MTLLoader()
  const objLoader = new OBJLoader()

  mtlLoader.load('./images/room/table/table.mtl', (material) => {
    objLoader.setMaterials(material)
    objLoader.load('./images/room/table/table.obj', (object) => {
      object.position.set(600, 0, 0)
      scene.add(object)
    })
  })
}

/**
 * 添加花
 * @param {*} scene
 */
export function addFlower(scene) {
  const mtlLoader = new MTLLoader()
  const objLoader = new OBJLoader()
  mtlLoader.load('./images/room/rose/rose.mtl', (material) => {
    objLoader.setMaterials(material)
    objLoader.load('./images/room/rose/rose.obj', (object) => {
      object.position.set(610, 80, 50)
      object.rotation.set(Math.PI / 12, 0, 0)
      scene.add(object)
    })
  })
}