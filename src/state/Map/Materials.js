/* global THREE Physijs */

import { RESTITUTION } from './MapPhysics'

export const createMaterial = ( url, repeatX, repeatY, friction ) => {
  const texture = new THREE.TextureLoader().load( url )
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter //Pixelate!
  texture.minFilter = THREE.NearestMipMapLinearFilter //Pixelate!
  texture.repeat.set( repeatX, repeatY )

  return Physijs.createMaterial(
    new THREE.MeshLambertMaterial({
      map: texture
    }),
    friction,
    RESTITUTION,
  );
}