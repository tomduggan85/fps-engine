
/* global THREE */

export const createArchGeometry = ({
  width,
  height,
  depth,
  inset
}, material ) => {

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

export const createRibGeometry = ({
  width,
  height,
  depth,
  bevelHeight = 0.5,
  bottomBevel = 0,
  topBevel = 0
}, material1, material2 ) => {

  const shape = new THREE.Shape()
  shape.moveTo( -width / 2 - bottomBevel, 0 )
  shape.lineTo( -width / 2, bevelHeight )
  shape.lineTo( -width / 2, height - bevelHeight )
  shape.lineTo( -width / 2 - topBevel, height )
  shape.lineTo( width / 2 + topBevel, height )
  shape.lineTo( width / 2, height - bevelHeight )
  shape.lineTo( width / 2, bevelHeight )
  shape.lineTo( width / 2 + bottomBevel, 0 )
  shape.moveTo( -width / 2 - bottomBevel, 0 )

  const extrudeSettings = {
    depth,
    steps: 1,
    bevelEnabled: false,
  }

  return new THREE.Mesh(
    new THREE.ExtrudeGeometry( shape, extrudeSettings ),
    [ material1, material2 ]
  )
}