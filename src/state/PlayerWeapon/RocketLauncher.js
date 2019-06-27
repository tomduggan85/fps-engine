import BaseWeapon from './BaseWeapon'
import Rocket from '../Projectile/Rocket'

const animationDefs = {
  default: {
    frames: [
      { u: 10, v: 50, width: 186, height: 105 },
    ],
    duration: 1000
  },

  attack: {
    frames: [
      { u: 203, v: 50, width: 186, height: 105 },
      { u: 367, v: 50, width: 186, height: 105 },
      { u: 535, v: 50, width: 186, height: 105 },
      { u: 703, v: 50, width: 186, height: 105 },
      { u: 874, v: 50, width: 186, height: 105 },
      { u: 10, v: 50, width: 186, height: 105 },
      { u: 10, v: 50, width: 186, height: 105 },
      { u: 10, v: 50, width: 186, height: 105 },
    ],
    duration: 500,
    loop: false,
  },
  equip: {
    frames: [
      { u: 10, v: 50, width: 186, height: 25 },
      { u: 10, v: 50, width: 186, height: 35 },
      { u: 10, v: 50, width: 186, height: 45 },
      { u: 10, v: 50, width: 186, height: 55 },
      { u: 10, v: 50, width: 186, height: 65 },
      { u: 10, v: 50, width: 186, height: 75 },
      { u: 10, v: 50, width: 186, height: 85 },
      { u: 10, v: 50, width: 186, height: 95 },
    ],
    loop: false,
    duration: 300
  },
  put_away: {
    frames: [
      { u: 10, v: 50, width: 186, height: 95 },
      { u: 10, v: 50, width: 186, height: 85 },
      { u: 10, v: 50, width: 186, height: 75 },
      { u: 10, v: 50, width: 186, height: 65 },
      { u: 10, v: 50, width: 186, height: 55 },
      { u: 10, v: 50, width: 186, height: 45 },
      { u: 10, v: 50, width: 186, height: 35 },
      { u: 10, v: 50, width: 186, height: 25 },
    ],
    loop: false,
    duration: 300
  },
}


export default class RocketLauncher extends BaseWeapon {

  constructor( props ) {
    super({
      ...props,
      animationDefs,
      imageUrl: '/assets/images/rocket_launcher.png',
      pickupImageUrl: '/assets/images/rocket_launcher_pickup.png',
      alertNearbyEnemyRange: 80,
    })
  }

  performAttack() {
    this.fireProjectile( Rocket )
  }
}