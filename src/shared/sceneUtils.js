/* global THREE */

export const nearestRaycastGameObject = ( scene, raycast, ignoreTypes = [], ignoreDead = false ) => {
  const results = raycast
    .intersectObjects( scene.children, true )
    .filter( result => {
      return !ignoreTypes.includes( result.object.gameObject.type ) && 
        (
          !ignoreDead || 
          !result.object.gameObject.components.health || 
          !result.object.gameObject.components.health.isDead
        )
    })

  return results.length && {
    gameObject: results[0].object.gameObject,
    point: results[ 0 ].point
  }
} 

export const generateGridPositions = ( grid, relativeToSceneObject ) => {
  const {
    width,
    length,
    xSpacing,
    zSpacing,
  } = grid

  if ( relativeToSceneObject ) {
    relativeToSceneObject.updateMatrixWorld( true )
  }

  const rows = xSpacing ? Math.max(1, Math.floor( width / xSpacing )) : 1
  const columns = zSpacing ? Math.max(1, Math.floor( length / zSpacing )) : 1

  const positions = []

  for ( let row = 0; row < rows; row++ ) {
    for ( let column = 0; column < columns; column++ ) {
      const localPosition = {
        x: -width / 2 + (( row + 1 ) / ( rows + 1 ) * width ),
        y: 0,
        z: -length / 2 + (( column + 1 ) / ( columns + 1 ) * length ),
      }

      const worldPosition = relativeToSceneObject ?
        relativeToSceneObject.localToWorld( new THREE.Vector3( localPosition.x, localPosition.y, localPosition.z )) :
        localPosition

      positions.push({
        x: worldPosition.x,
        y: worldPosition.y,
        z: worldPosition.z,
      })
    }
  }

  return positions
}
