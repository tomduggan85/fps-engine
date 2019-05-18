/* global THREE */

export const capMaxVelocity = ( sceneObject, maxVelocity) => {

  /* 
    Cap X and Z velocity, leave Y untouched (for gravity)
  */
  const currentVelocity = sceneObject.getLinearVelocity()
  const capped = new THREE.Vector3( currentVelocity.x, 0, currentVelocity.z )
  capped.clampLength( -maxVelocity, maxVelocity )

  sceneObject.setLinearVelocity( new THREE.Vector3(
    capped.x,
    currentVelocity.y,
    capped.z
  ))
}

export const disableRotation = ( sceneObject ) => sceneObject.setAngularFactor(new THREE.Vector3( 0, 0, 0 ))