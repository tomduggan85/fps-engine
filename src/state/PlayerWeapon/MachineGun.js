import BaseWeapon from './BaseWeapon'

const animationDefs = {
  default: {
    frames: [
      { u: 5, v: 25, width: 273, height: 125, uShift: 0 },
    ],
    duration: 1000
  },

  attack: {
    frames: [
      { u: 288, v: 25, width: 273, height: 124, uShift: 0 },
      { u: 568, v: 25, width: 273, height: 123, uShift: 0 },
    ],
    duration: 50,
    loop: false,
  },
  equip: {
    frames: [
      { u: 5, v: 25, width: 273, height: 55, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 65, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 75, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 85, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 95, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 105, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 115, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 125, uShift: 0 },
    ],
    loop: false,
    duration: 300
  },
  put_away: {
    frames: [
      { u: 5, v: 25, width: 273, height: 125, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 115, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 105, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 95, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 85, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 75, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 65, uShift: 0 },
      { u: 5, v: 25, width: 273, height: 55, uShift: 0 },
    ],
    loop: false,
    duration: 300
  },
}

const DAMAGE = 5
const SPREAD = 0.1

export default class MachineGun extends BaseWeapon {

  constructor( props ) {
    super({
      ...props,
      animationDefs,
      imageUrl: '/assets/images/machine_gun.png',
      alertNearbyEnemyRange: 60,
    })
  }

  performAttack() {
    this.fireBullet(
      1,
      DAMAGE,
      SPREAD
    )
  }
}