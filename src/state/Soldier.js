
import Enemy from './Enemy'
import { mapToRange } from '../shared/mathUtils'

const DAMAGE_AMOUNT = 5

const animationDefs = {
  walk: {
    frames: [
      { u: 0.014, v: 0.926 },
      { u: 0.014, v: 0.813 },
      { u: 0.014, v: 0.701 },
      { u: 0.014, v: 0.588 },
    ],
    duration: 650,
    isDirectional: true,
    directionalOffset: 0.122,
  },
  stand: {
    frames: [
      { u: 0.014, v: 0.475 }
    ],
    duration: 1000,
    isDirectional: true,
    directionalOffset: 0.125,
  },
  attack: {
    frames: [
      { u: 0.015, v: 0.3715 },
      { u: 0.014, v: 0.475 }
    ],
    duration: 700,
    isDirectional: true,
    directionalOffset: 0.125,
  },
  take_damage: {
    frames: [
      { u: 0.022, v: 0.268 }
    ],
    duration: 400,
    loop: false,
    isDirectional: true,
    directionalOffset: 0.125,
  },
  dead: {
    frames: [
      { u: 0.013, v: 0.165 },
      { u: 0.12, v: 0.165 },
      { u: 0.24, v: 0.165 },
      { u: 0.37, v: 0.165 },
      { u: 0.509, v: 0.165 },
    ],
    duration: 500,
    loop: false,
  },
  explode: {
    frames: [
      { u: 0.024, v: 0.06 },
      { u: 0.12, v: 0.06 },
      { u: 0.218, v: 0.06 },
      { u: 0.326, v: 0.06 },
      { u: 0.437, v: 0.06 },
      { u: 0.55, v: 0.06 },
      { u: 0.662, v: 0.06 },
      { u: 0.768, v: 0.06 },
      { u: 0.877, v: 0.06 },
    ],
    duration: 700,
    loop: false,
  },
}

class Soldier extends Enemy {

  constructor( props ) {
    super({
      ...props,
      animationDefs,
      textureUrl: '/assets/sprites/soldier.png',
      textureScale: [ 0.085, 0.0627 ],
      maxVelocity: 3,
      radius: 1.55,
      startingHealth: 10,
    })
  }

  doAttack = () => {
    const distanceSq = this.distanceToPlayerSq()
    const lowestAccuracyRange = { rangeSq: 320, accuracy: 0.5 }
    const highestAccuracyRange = { rangeSq: 90, accuracy: 0.9 }
    const hitChance = mapToRange(
      distanceSq,
      [ highestAccuracyRange.rangeSq, lowestAccuracyRange.rangeSq ],
      [ highestAccuracyRange.accuracy, lowestAccuracyRange.accuracy ]
    )

    const playerSpeed = this.player.sceneObject.getLinearVelocity().length()
    const playerRelativeDirection = 180 / Math.PI * this.direction.angleTo(this.player.sceneObject.getLinearVelocity().normalize())
    const movingTargetAdjustment = (
      playerSpeed > 5 &&
      playerRelativeDirection > 60 &&
      playerRelativeDirection < 120
    ) ? -0.1 : 0

    if ( Math.random() <= hitChance + movingTargetAdjustment ) {
      this.player.components.health.takeDamage( DAMAGE_AMOUNT )
    }
  }
}

export default Soldier