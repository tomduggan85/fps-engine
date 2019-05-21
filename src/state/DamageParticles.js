/* global THREE */

import GameObject from './GameObject'
import GameObjectTypes from '../shared/enum/GameObjectTypes'
import SpriteAnimation from './components/SpriteAnimation'

export const EffectTypes = {
  EnemyHit: 'EnemyHit',
  EnemyHit2: 'EnemyHit2',
  Sparks: 'Sparks',
}

const SPARK_OFFSET = 0.081
const ENEMY_HIT_OFFSET = 0.066

const effectDefs = {
  [ EffectTypes.EnemyHit ]: {
    textureUrl: '/assets/sprites/enemy_hit.png',
    textureScale: [ 1/15, 1 ],
    size: 1.25,
    randomRotation: false,
    animationDefs: {
      default: {
        frames: [
          { u: 0, v: 0 },
          { u: 1 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 2 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 3 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 4 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 5 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 6 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 7 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 8 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 9 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 10 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 11 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 12 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 13 * ENEMY_HIT_OFFSET, v: 0 },
        ],
        duration: 500,
        loop: false,
      },
    },
  },
  [ EffectTypes.EnemyHit2 ]: {
    textureUrl: '/assets/sprites/enemy_hit_2.png',
    textureScale: [ 1/15, 1 ],
    size: 1.25,
    randomRotation: true,
    animationDefs: {
      default: {
        frames: [
          { u: 0, v: 0 },
          { u: 1 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 2 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 3 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 4 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 5 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 6 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 7 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 8 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 9 * ENEMY_HIT_OFFSET, v: 0 },
          { u: 10 * ENEMY_HIT_OFFSET, v: 0 },
        ],
        duration: 300,
        loop: false,
      },
    },
  },
  [ EffectTypes.Sparks ]: {
    textureUrl: '/assets/sprites/sparks_effect.png',
    textureScale: [ 1, 1/12 ],
    size: 1.5,
    randomRotation: true,
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
      rotation:  effectDef.randomRotation ? ( Math.random() * Math.PI * 2 ) : 0,
    })
    const sceneObject = new THREE.Sprite( spriteMaterial )
    
    sceneObject.scale.set( effectDef.size, effectDef.size )
    sceneObject.position.set( position.x, position.y, position.z )
    
    return sceneObject
  }
}

export default DamageParticles