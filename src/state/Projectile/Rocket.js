import BaseProjectile from './BaseProjectile'
import SpecialEffect, { EffectTypes } from '../SpecialEffect'

class Rocket extends BaseProjectile {
  constructor( props ) {
    super({
      ...props,
      textureUrl: '/assets/sprites/rocket.png',
      textureScale: [ 1/8, 1 ],
      size: 1,
      mass: 15,
      speed: 35,
      animationDefs: {
        default: {
          frames: [
            { u: 0, v: 0 },
          ],
          duration: 1000,
          isDirectional: true,
          directionalOffset: 1/8,
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
  }
}

export default Rocket
