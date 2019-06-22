/* global THREE Physijs */

import GameObject from './GameObject'
import GameObjectTypes from '../shared/enum/GameObjectTypes'
import { action } from 'mobx'

const FRICTION = 1
const RESTITUTION = 0.5

class BoxScenery extends GameObject {

  type = GameObjectTypes.Scenery


  createSceneObject() {
    const {
      textureUrl,
      size,
      position,
      rotation,
      textureRepeat = [ 1, 1 ],
      friction,
      restitution,
      mass = 0,
    } = this.props
    
    const texture = new THREE.TextureLoader().load( textureUrl )
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter //Pixelate!
    texture.minFilter = THREE.NearestMipMapLinearFilter //Pixelate!
    texture.repeat.set( textureRepeat[ 0 ], textureRepeat[ 1 ] )

    const material = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({
        map: texture
      }),
      friction || FRICTION,
      restitution || RESTITUTION,
    );

    const box = new Physijs.BoxMesh(
      new THREE.BoxGeometry( size.x, size.y, size.z ),
      material,
      mass //Zero mass means immovable object
    );
    box.position.set( position.x, position.y, position.z )
    if ( rotation ) {
      box.rotation.set( rotation.x, rotation.y, rotation.z )
    }

    return box
  }
 
  @action
  step( deltaTime ) {
    super.step( deltaTime )
  } 
}

export default BoxScenery