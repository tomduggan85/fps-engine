
/* global THREE */

export const createArchGeometry = ({
  width,
  height,
  depth,
  inset
}, material) => {

  const shape = new THREE.Shape()
  shape.moveTo( -width / 2, 0 )
  shape.lineTo( -width / 2, height )
  shape.lineTo( width / 2, height )
  shape.lineTo( width / 2, 0 )
  shape.lineTo( width / 2 - inset, 0 )
  shape.lineTo( width / 2 - inset, height - inset )
  shape.lineTo( -width / 2 + inset, height - inset )
  shape.lineTo( -width / 2 + inset, 0 )
  shape.lineTo( -width / 2, 0 )

  const extrudeSettings = {
    depth,
    steps: 1,
    bevelEnabled: false,
  }

  return new THREE.Mesh(
    new THREE.ExtrudeGeometry( shape, extrudeSettings ),
    material
  )
}