/* global THREE */

import { observable } from 'mobx'
import UiAnimation from '../components/UiAnimation'
import { nearestRaycastGameObject } from '../../shared/sceneUtils'
import GameObjectTypes from '../../shared/enum/GameObjectTypes'
import DamageParticles from '../DamageParticles'

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
    this.player = props.player
    this.camera = props.player.camera
    this.gameState = props.player.gameState
    this.scene = props.player.scene
    this.alertNearbyEnemyRange = props.alertNearbyEnemyRange

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
      this.performAttack()
      this.alertNearbyEnemies()

      const attackTime = this.animationDefs.attack.duration
      setTimeout( this.enableAttacking, attackTime )
    }
  }

  performAttack() {
    throw new Error('Implement in child class')
  }

  fireBullet( count, damage, spread = 0 ) {
    for ( let i = 0; i < count; i++ ) {
      const raycast = new THREE.Raycaster()
      const spreadVector = new THREE.Vector2(
        -spread/2 + Math.random() * spread,
        -spread/2 + Math.random() * spread/2,
      )
      raycast.setFromCamera(
        spreadVector,
        this.camera.sceneObject
      )
      const { gameObject, point } = nearestRaycastGameObject(
        this.scene,
        raycast,
        [ GameObjectTypes.Player ], //Ignore player
        true //Ignore dead enemies
      )
      
      if ( gameObject ) {
        if ( gameObject.components.health ) {
          gameObject.components.health.takeDamage( damage )
        }

        this.gameState.addGameObject( DamageParticles, {
          position: point
        })
      }
    }
  }

  alertNearbyEnemies() {
    this.gameState.getGameObjectsInRange( this.player.sceneObject.position, this.alertNearbyEnemyRange ).forEach( gameObject => {
      if ( gameObject.type === GameObjectTypes.Enemy ) {
        gameObject.components.aiLogic.noticePlayer()
      }
    })
  }

  fireProjectile() {

  }
}