
export const nearestRaycastGameObject = ( scene, raycast, ignoreTypes = [] ) => {
  const results = raycast
    .intersectObjects( scene.children, true )
    .filter( result => !ignoreTypes.includes( result.object.gameObject.type ))

  return results.length && results[0].object.gameObject
} 