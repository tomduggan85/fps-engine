import Enemy from './Enemy'
import Fireball from './Projectile/Fireball'

const ATTACK_DELAY = 300

const animationDefs = {
  walk: {
    frames: [
      { u: 0.014, v: 0.923 },
      { u: 0.013, v: 0.824 },
      { u: 0.013, v: 0.721 },
      { u: 0.012, v: 0.616 },
    ],
    duration: 600,
    isDirectional: true,
    directionalOffset: 0.105,
  },
  stand: {
    frames: [
      { u: 0.013, v: 0.824 },
    ],
    duration: 1000,
    isDirectional: true,
    directionalOffset: 0.105,
  },
  attack: {
    frames: [
      { u: 0.023, v: 0.513 },
      { u: 0.01, v: 0.414 },
      { u: -0.009, v: 0.316 },
      { u: 0.01, v: 0.414 },
    ],
    duration: 600,
    isDirectional: true,
    directionalOffset: 0.105,
  },
  take_damage: {
    frames: [
      { u: 0.01, v: 0.216 },
    ],
    duration: 400,
    isDirectional: true,
    directionalOffset: 0.105,
    loop: false,
  },
  dead: {
    frames: [
      { u: 0.01, v: 0.107 },
      { u: 0.12, v: 0.107 },
      { u: 0.23, v: 0.107 },
      { u: 0.34, v: 0.107 },
      { u: 0.47, v: 0.107 },
    ],
    duration: 400,
    loop: false,
  },
  explode: {
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

class Monster extends Enemy {

  constructor( props ) {
    super({
      ...props,
      animationDefs,
      textureUrl: '/assets/sprites/monster.png',
      textureScale: [ 0.081, 0.067 ],
      maxVelocity: 6,
      radius: 1.75,
      startingHealth: 30,
    })
  }

  doAttack = () => {
    setTimeout(() => {
      if ( this.components.aiLogic.isAttacking()) {
        const fireballStartOffset = 3
        const position = this.sceneObject.position.clone()
        position.add( this.direction.multiplyScalar( fireballStartOffset ))

        this.gameState.addGameObject( Fireball, {
          position,
          direction: this.direction.clone()
        })
      }
    }, ATTACK_DELAY )
  }
}

export default Monster