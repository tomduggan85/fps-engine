
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