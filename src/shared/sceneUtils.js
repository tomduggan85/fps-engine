
export const nearestRaycastGameObject = ( scene, raycast ) => {
  const results = raycast.intersectObjects( scene.children, true )
  return results.length && results[0].object.gameObject
} 