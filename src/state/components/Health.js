import {
  action,
  observable,
  computed
} from 'mobx'

const TAKING_DAMAGE_DURATION = 100

class Health {

  componentType = 'health'

  @observable
  currentHealth = null

  @observable
  isTakingDamage = false

  constructor( props ) {
    this.parent = props.parent
    this.currentHealth = props.startingHealth
  }

  @action
  takeDamage( damageAmount ) {
    if ( !this.isDead ) {
      this.currentHealth = Math.max( 0, this.currentHealth - damageAmount )
      this.isTakingDamage = true
      this.takingDamageTimeout = setTimeout( this.finishTakingDamage, TAKING_DAMAGE_DURATION )

      if ( this.parent.components.aiLogic ) {
        if ( this.currentHealth > 0 ) {
          this.parent.components.aiLogic.onTakeDamage()
        }
        else {
          this.parent.components.aiLogic.onDeath()
        }
      }
    }
  }

  @action
  finishTakingDamage = () => {
    this.isTakingDamage = false
  }

  @computed
  get isDead() {
    return this.currentHealth <= 0
  }

}

export default Health