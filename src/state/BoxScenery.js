/* global THREE Physijs */

import GameObject from './GameObject'
import GameObjectTypes from '../shared/enum/GameObjectTypes'

const FRICTION = 1
const RESTITUTION = 0.5

class BoxScenery extends GameObject {

  type = GameObjectTypes.Scenery


  createSceneObject() {
    const {
      size,
      position,
      rotation,
      mass = 0,
    } = this.props

    const box = new Physijs.BoxMesh(
      new THREE.BoxGeometry( size.x, size.y, size.z ),
      this.createMaterials(),
      mass //Zero mass means immovable object
    );
    box.position.set( position.x, position.y, position.z )
    if ( rotation ) {
      box.rotation.set( rotation.x, rotation.y, rotation.z )
    }

    return box
  }
 
  createMaterials() {
    const {
      textureUrl,
      textureRepeat = [ 1, 1 ],
      friction,
      restitution,
    } = this.props

    const textures = Array.isArray( textureUrl ) ? textureUrl : Array( 6 ).fill( textureUrl )

    return textures.map( texture => {
      const map = new THREE.TextureLoader().load( texture )
      map.wrapS = THREE.RepeatWrapping
      map.wrapT = THREE.RepeatWrapping
      map.magFilter = THREE.NearestFilter //Pixelate!
      map.minFilter = THREE.NearestMipMapLinearFilter //Pixelate!
      map.repeat.set( textureRepeat[ 0 ], textureRepeat[ 1 ] )

      return Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ map }),
        friction || FRICTION,
        restitution || RESTITUTION,
      );
    })
  }
}

export default BoxScenery