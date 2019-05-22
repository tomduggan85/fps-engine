import BaseProjectile from './BaseProjectile'
import SpecialEffect, { EffectTypes } from '../SpecialEffect'
import GameObjectTypes from '../../shared/enum/GameObjectTypes'

const DAMAGE_RANGE = 14
const MAX_DAMAGE = 100
const MAX_FORCE = 20000

class Rocket extends BaseProjectile {
  constructor( props ) {
    super({
      ...props,
      textureUrl: '/assets/sprites/rocket.png',
      textureScale: [ 1/8, 1/2 ],
      size: 1,
      mass: 15,
      speed: 25,
      animationDefs: {
        default: {
          frames: [
            { u: 0, v: 0 },
            { u: 0, v: 0.5 },
          ],
          duration: 100,
          isDirectional: true,
          directionalOffset: 1/8,
          loop: true,
        },
      },
    })
  }

  handleCollision() {
    const shiftedPosition = this.sceneObject.position.clone()
    shiftedPosition.sub( this.direction.clone().multiplyScalar( 1 ))
    this.gameState.addGameObject( SpecialEffect, {
      effectType: EffectTypes.LargeExplosion,
      position: shiftedPosition,
    })

    this.gameState.getGameObjectsInRange( this.sceneObject.position, DAMAGE_RANGE ).forEach(({ gameObject, distance }) => {
      const inverseNormalizedDist = 1 - ( distance / DAMAGE_RANGE )
      if ( gameObject === this ) {
        return
      }

      if ( gameObject.components.health ) {
        gameObject.components.health.takeDamage( Math.floor( MAX_DAMAGE *  inverseNormalizedDist ))
      }

      if ( gameObject.sceneObject.applyCentralForce ) {
        const direction = gameObject.sceneObject.position
          .clone()
          .sub ( this.sceneObject.position )

        // Dampen the vertical impulse
        if ( gameObject.type !== GameObjectTypes.Scenery ) {
          direction.y *= 0.25
        }
        gameObject.sceneObject.applyCentralForce( direction.normalize().multiplyScalar( MAX_FORCE * inverseNormalizedDist ))
      }
    })
  }
}

export default Rocket
