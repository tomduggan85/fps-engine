import BaseWeapon from './BaseWeapon'

const animationDefs = {
  default: {
    frames: [
      { u: 29, v: 206, width: 73, height: 84 },
    ],
    duration: 1000
  },

  attack: {
    frames: [
      { u: 111, v: 206, width: 73, height: 84 },
      { u: 193, v: 206, width: 73, height: 84 },
      { u: 701, v: 205, width: 96, height: 65, uShift: 100 },
      { u: 273, v: 157, width: 108, height: 123, uShift: 150 },
      { u: 396, v: 109, width: 134, height: 171, uShift: 250 },
      { u: 791, v: 181, width: 104, height: 109, uShift: 250 },
      { u: 542, v: 92, width: 156, height: 198, uShift: 340 },
      { u: 542, v: 92, width: 156, height: 198, uShift: 340 },
      { u: 791, v: 181, width: 104, height: 109, uShift: 250 },
      { u: 396, v: 109, width: 134, height: 171, uShift: 250 },
      { u: 273, v: 157, width: 108, height: 123, uShift: 150 },
      { u: 701, v: 205, width: 96, height: 65, uShift: 100 },
    ],
    duration: 800,
    loop: false,
  },
  equip: {
    frames: [
      { u: 29, v: 206, width: 73, height: 0 },
      { u: 29, v: 206, width: 73, height: 10 },
      { u: 29, v: 206, width: 73, height: 20 },
      { u: 29, v: 206, width: 73, height: 30 },
      { u: 29, v: 206, width: 73, height: 40 },
      { u: 29, v: 206, width: 73, height: 50 },
      { u: 29, v: 206, width: 73, height: 60 },
      { u: 29, v: 206, width: 73, height: 70 },
    ],
    loop: false,
    duration: 300
  },
  put_away: {
    frames: [
      { u: 29, v: 206, width: 73, height: 70 },
      { u: 29, v: 206, width: 73, height: 60 },
      { u: 29, v: 206, width: 73, height: 50 },
      { u: 29, v: 206, width: 73, height: 40 },
      { u: 29, v: 206, width: 73, height: 30 },
      { u: 29, v: 206, width: 73, height: 20 },
      { u: 29, v: 206, width: 73, height: 10 },
      { u: 29, v: 206, width: 73, height: 0 },
    ],
    loop: false,
    duration: 300
  },
}

const DAMAGE = 5
const SPREAD = 0.15
const PELLETS = 6

export default class Shotgun extends BaseWeapon {

  constructor( props ) {
    super({
      ...props,
      animationDefs,
      imageUrl: '/assets/images/shotgun.png',
      pickupImageUrl: '/assets/images/shotgun_pickup.png',
      alertNearbyEnemyRange: 60,
    })
  }

  performAttack() {
    this.fireBullet(
      PELLETS,
      DAMAGE,
      SPREAD
    )
  }
}