/* global THREE */

import GameObject from './GameObject'
import GameObjectTypes from '../shared/enum/GameObjectTypes'
import SpriteAnimation from './components/SpriteAnimation'

export const EffectTypes = {
  EnemyHit: 'EnemyHit',
  Sparks: 'Sparks',
}

const SPARK_OFFSET = 0.081

const effectDefs = {
  [ EffectTypes.EnemyHit ]: {
    textureUrl: '/assets/sprites/monster.png',
    textureScale: [ 0.081, 0.067 ],
    size: 1,
    animationDefs: {
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
        duration: 500,
        loop: false,
      },
    },
  },
  [ EffectTypes.Sparks ]: {
    textureUrl: '/assets/sprites/sparks_effect.png',
    textureScale: [ 1, 1/12 ],
    size: 1.5,
    animationDefs: {
      default: {
        frames: [
          { u: 0, v: 12*SPARK_OFFSET },
          { u: 0, v: 10*SPARK_OFFSET },
          { u: 0, v: 8*SPARK_OFFSET },
          { u: 0, v: 6*SPARK_OFFSET },
          { u: 0, v: 4*SPARK_OFFSET },
          { u: 0, v: 2*SPARK_OFFSET },
          { u: 0, v: 0*SPARK_OFFSET },
        ],
        duration: 200,
        loop: false,
      },
    },
  }
}

class DamageParticles extends GameObject {

  type = GameObjectTypes.Effect

  constructor( props ) {
    super( props )

    const effectDef = effectDefs[ this.props.effectType ]
    this.addComponent( new SpriteAnimation({
      parent: this,
      camera: props.gameState.camera,
      animationDefs: effectDef.animationDefs,
      texture: this.texture,
    }))

    this.components.animation.setAnimation( 'default' )

    setTimeout( this.remove, effectDef.animationDefs.default.duration )
  }

  createSceneObject() {
    const {
      position,
      effectType,
    } = this.props

    const effectDef = effectDefs[ effectType ]
    
    this.texture = new THREE.TextureLoader().load( effectDef.textureUrl )
    this.texture.magFilter = THREE.NearestFilter //Pixelate!
    this.texture.minFilter = THREE.NearestFilter //Pixelate!
    this.texture.repeat.set( effectDef.textureScale[ 0 ], effectDef.textureScale[ 1 ])
    const spriteMaterial = new THREE.SpriteMaterial({
      map: this.texture,
      rotation:  Math.random() * Math.PI * 2,
    })
    const sceneObject = new THREE.Sprite( spriteMaterial )
    
    sceneObject.scale.set( effectDef.size, effectDef.size )
    sceneObject.position.set( position.x, position.y, position.z )
    
    return sceneObject
  }
}

export default DamageParticles