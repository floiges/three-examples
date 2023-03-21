/**
* 顶点着色器的作用是将几何体的每个顶点放置在 2D 渲染空间上，即顶点着色器将 3D 顶点坐标转换为 2D canvas 坐标
**/
varying vec3 vNormal;
varying vec3 camPos;
varying vec2 vUv;

// 当使用 Vertex Shader 时，它的代码将作用于几何体的每个顶点。
// 在每个顶点之间，有些数据会发生变化，这类数据被称为 attribute，一般用于每个顶点都各不相同的变量，如顶点的位置
// 有些数据在顶点之间永远不会发生变化，称这种数据为 uniform，一般用于对同一组顶点组成的单个 3D 物体中所有顶点都相同的变量

void main() {
  vNormal = normal;
  vUv = uv;
  camPos = cameraPosition;
  // 在着色器内，一般命名以 gl_ 开头的变量是着色器的内置变量。
  // gl_Position 是一个内置变量，我们只需要给它重新赋值就能使用，它将会包含屏幕上的顶点的位置
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}