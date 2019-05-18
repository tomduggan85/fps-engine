import { observable } from 'mobx'
import UiAnimation from '../components/UiAnimation'

export default class BaseWeapon {
  
  @observable
  ammo = 0

  @observable
  imageUrl = null

  @observable
  canAttack = true

  constructor( props ) {
    this.imageUrl = props.imageUrl
    this.animationDefs = props.animationDefs
    this.ammo = props.ammo
    this.animation = new UiAnimation({
      animationDefs: props.animationDefs, 
    })
    this.animation.setAnimation( 'default' )
  }

  equip() {
    this.canAttack = false
    this.animation.setAnimation( 'equip' )
    setTimeout(this.enableAttacking, this.animationDefs.equip.duration )
  }

  putAway() {
    this.canAttack = false
    this.animation.setAnimation( 'put_away' )
    return new Promise(( resolve, reject ) => {
      setTimeout( resolve, this.animationDefs.put_away.duration )
    })
  }

  step( deltaTime ) {
    this.animation.step( deltaTime )
  }

  enableAttacking = () => {
    this.canAttack = true
    this.animation.setAnimation( 'default' )
  }

  attack() {
    if ( this.canAttack && this.ammo ) {
      this.canAttack = false
      this.animation.setAnimation( 'attack' )
      this.ammo -= 1

      const attackTime = this.animationDefs.attack.duration
      setTimeout( this.enableAttacking, attackTime )
    }
  }
}