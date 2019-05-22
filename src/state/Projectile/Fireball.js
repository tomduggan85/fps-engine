import BaseProjectile from './BaseProjectile'
import SpecialEffect, { EffectTypes } from '../SpecialEffect'

const DAMAGE = 10

class Fireball extends BaseProjectile {
  constructor( props ) {
    super({
      ...props,
      textureUrl: '/assets/sprites/fireball.png',
      textureScale: [ 1/8, 1 ],
      size: 0.5,
      mass: 15,
      speed: 15,
      animationDefs: {
        default: {
          frames: [
            { u: 2/8, v: 0 },
            { u: 7/8, v: 0 },
          ],
          duration: 200,
          loop: true,
          isDirectional: true,
          directionalOffset: 1/8,
        },
      },
    })
  }

  handleCollision( otherObject ) {
    const shiftedPosition = this.sceneObject.position.clone()
    shiftedPosition.sub( this.direction.clone().multiplyScalar( 1 ))
    this.gameState.addGameObject( SpecialEffect, {
      effectType: EffectTypes.FireballImpact,
      position: shiftedPosition,
    })

    if ( otherObject.gameObject.components.health ) {
      otherObject.gameObject.components.health.takeDamage( DAMAGE )
    }
  }
}

export default Fireball
