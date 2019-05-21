/* global THREE Physijs */

import GameObject from '../GameObject'
import GameObjectTypes from '../../shared/enum/GameObjectTypes'
import SpriteAnimation from '../components/SpriteAnimation'

const SHOW_DEBUG_VOLUMES = false

class BaseProjectile extends GameObject {

  type = GameObjectTypes.Projectile

  constructor( props ) {
    super( props )

    this.addComponent( new SpriteAnimation({
      parent: this,
      camera: props.gameState.camera,
      animationDefs: props.animationDefs,
      texture: this.texture,
    }))

    this.direction = props.direction
    this.components.animation.setAnimation( 'default' )

    this.sceneObject.disableGravity()
    this.sceneObject.setLinearVelocity( this.direction.clone().multiplyScalar( props.speed ))
    this.sceneObject.addEventListener( 'collision', this.onCollision.bind( this ))
  }

  createSceneObject() {
    const {
      position,
      textureUrl,
      textureScale,
      size,
      mass
    } = this.props

    this.texture = new THREE.TextureLoader().load( textureUrl )
    this.texture.magFilter = THREE.NearestFilter //Pixelate!
    this.texture.minFilter = THREE.NearestFilter //Pixelate!
    this.texture.repeat.set( textureScale[ 0 ], textureScale[ 1 ])
    const spriteMaterial = new THREE.SpriteMaterial({
      map: this.texture,
    })
    const sprite = new THREE.Sprite( spriteMaterial )

    sprite.scale.set( size * 2, size * 2 )

    const material = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(),
      0, // friction
      0.5 // restitution
    );
    material.visible = SHOW_DEBUG_VOLUMES;
    const sceneObject = new Physijs.SphereMesh(
      new THREE.SphereGeometry( size / 2, 50, 50 ),
      material,
      mass
    );

    sceneObject.add( sprite )
    sceneObject.position.set( position.x, position.y, position.z )
    
    return sceneObject
  }

  onCollision( otherObject, velocity, angularVelocity, normal, contactPoints, impulse ) {
    this.handleCollision( otherObject, velocity, angularVelocity )
    this.remove()
  }
}

export default BaseProjectile