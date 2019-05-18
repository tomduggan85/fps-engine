/* global THREE */

import GameObject from './GameObject'
import GameObjectTypes from '../shared/enum/GameObjectTypes'
import SpriteAnimation from './components/SpriteAnimation'

const LIFETIME = 500
const TEXTURE_URL = '/assets/sprites/monster.png'
const TEXTURE_SCALE = [ 0.081, 0.067 ]
const SIZE = 2

const animationDefs = {
  default: {
    frames: [
      { u: 0.015, v: 0.002 },
      { u: 0.138, v: 0.002 },
      { u: 0.259, v: 0.002 },
      { u: 0.389, v: 0.002 },
      { u: 0.521, v: 0.002 },
      { u: 0.652, v: 0.002 },
      { u: 0.784, v: 0.002 },
      { u: 0.915, v: 0.002 },
    ],
    duration: 700,
    loop: false,
  },
}

class DamageParticles extends GameObject {

  type = GameObjectTypes.Effect

  constructor( props ) {
    super( props )
    this.addComponent( new SpriteAnimation({
      parent: this,
      camera: props.gameState.camera,
      animationDefs: animationDefs,
      texture: this.texture,
    }))

    this.components.animation.setAnimation( 'default' )

    setTimeout( this.remove, LIFETIME )
  }

  createSceneObject() {
    const {
      position,
    } = this.props
    
    this.texture = new THREE.TextureLoader().load( TEXTURE_URL )
    this.texture.magFilter = THREE.NearestFilter //Pixelate!
    this.texture.minFilter = THREE.NearestFilter //Pixelate!
    this.texture.repeat.set( TEXTURE_SCALE[ 0 ], TEXTURE_SCALE[ 1 ])
    const spriteMaterial = new THREE.SpriteMaterial({ map: this.texture })
    const sceneObject = new THREE.Sprite( spriteMaterial )
    
    sceneObject.scale.set( SIZE, SIZE )
    sceneObject.position.set( position.x, position.y, position.z )
    
    return sceneObject
  }
}

export default DamageParticles