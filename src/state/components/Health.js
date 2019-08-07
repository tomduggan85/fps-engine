import {
  action,
  observable,
  computed
} from 'mobx'

const TAKING_DAMAGE_DURATION = 100
const EXPLODE_THRESHOLD = 55

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

      if ( this.currentHealth > 0 ) {
        if ( this.parent.components.aiLogic ) {
          this.parent.components.aiLogic.onTakeDamage()
        }
      }
      else {
        this.onDeath( damageAmount )
      }
    }
  }

  onDeath( damageAmount ) {
    if ( this.parent.onDeath ) {
      this.parent.onDeath()
    }

    if ( this.parent.components.aiLogic ) {
      this.parent.components.aiLogic.onDeath( damageAmount > EXPLODE_THRESHOLD )
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