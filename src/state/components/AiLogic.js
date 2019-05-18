/* global THREE */

import { action } from 'mobx'
import { nearestRaycastGameObject } from '../../shared/sceneUtils'

export const aiModes = {
  PATROLLING: 'PATROLLING',
  GUARDING: 'GUARDING',
  CHASING: 'CHASING',
  ATTACKING: 'ATTACKING',
  TAKING_DAMAGE: 'TAKING_DAMAGE',
  DEAD: 'DEAD',
}

const walkingaiModes = [
  aiModes.PATROLLING,
  aiModes.CHASING,
]

const playerFacingaiModes = [
  aiModes.CHASING,
  aiModes.ATTACKING,
]

const CHASE_RANGE = 50
const CHASE_RANGE_ALERTED_TO_PLAYER = 250
const CHASE_RANGE_PERIPHERAL = 7
const ATTACK_RANGE = 35
const ATTACK_RANGE_PERIPHERAL = 3

const TAKE_DAMAGE_TIME = 500

const DEAD_REMOVAL_DELAY = 300

const PLAYER_SIGHTLINE_THROTTLE = 400

class AiLogic {

  componentType = 'aiLogic'

  currentMode = { name: null }

  modeChangeLockoutTime = 0

  isAlertedToPlayer = false

  constructor( props ) {
    this.parent = props.parent
    this.player = props.parent.player
    this.scene = props.parent.scene
    this.radius = props.radius
    this.eyeHeight = props.eyeHeight
    this.patrolDurations = props.patrolDurations
    this.attackRate = props.attackRate
    this.maxVelocity = props.maxVelocity
    this.attackRange = props.attackRange || ATTACK_RANGE

    this.canSeePlayerCache = {
      lastCalcTime: 0,
      canSeePlayer: false
    }

    if ( props.patrol ) {
      this.startPatrolAI()
    }
    else {
      this.startGuardAI()
    }
  }

  startPatrolAI( force ) {
    if ( !force && this.currentMode.name === aiModes.PATROLLING ) {
      return
    }
    clearTimeout( this.currentModeTimeout )

    this.currentMode = {
      name: aiModes.PATROLLING,
      patrolDurationIndex: 0,
    }
    this.currentModeTimeout = setTimeout( this.patrolTurn, this.patrolDurations[ 0 ] )
    this.setAnimation( 'walk' )
  }

  maybeResetPatrol( patrol, patrolDurations ) {
    const {
      position,
      direction
    } = this.parent.props
    this.parent.sceneObject.position.set( position.x, position.y, position.z )
    this.parent.sceneObject.__dirtyPosition = true;
    this.parent.sceneObject.__dirtyRotation = true;
    this.parent.direction.set( direction.x, direction.y, direction.z ).normalize()

    this.patrolDurations = patrolDurations

    if ( patrol ) {
      this.startPatrolAI( true )
    }
    else {
      this.startGuardAI()
    }
  }

  patrolTurn = () => {
    const { patrolDurationIndex } = this.currentMode
    const { patrolDurations } = this

    this.parent.turnRight()

    const newDurationIndex = ( patrolDurationIndex + 1 ) % patrolDurations.length
    this.currentMode.patrolDurationIndex = newDurationIndex
    this.currentModeTimeout = setTimeout( this.patrolTurn, this.patrolDurations[ newDurationIndex ] )
  }

  startGuardAI() {
    if ( this.currentMode.name === aiModes.GUARDING ) {
      return
    }
    clearTimeout( this.currentModeTimeout )
    this.currentMode = { name: aiModes.GUARDING }
    this.setAnimation( 'stand' )
  }

  setAnimation( animationName ) {
    this.parent.components.animation.setAnimation( animationName )
    this.parent.components.sounds && this.parent.components.sounds.setSound( animationName )
  }

  startChaseAI() {
    if ( this.currentMode.name === aiModes.CHASING ) {
      return
    }

    this.isAlertedToPlayer = true
    clearTimeout( this.currentModeTimeout )
    this.currentMode = { name: aiModes.CHASING }
    this.setAnimation( 'walk' )
  }

  startAttackAI() {
    if ( this.currentMode.name === aiModes.ATTACKING ) {
      return
    }

    clearTimeout( this.currentModeTimeout )
    this.currentMode = { name: aiModes.ATTACKING }
    this.setAnimation( 'attack' )
    this.parent.doAttack()
    this.currentModeTimeout = setInterval( this.doAttack, this.attackRate )
    this.modeChangeLockoutTime = performance.now() + this.attackRate - 100
  }

  doAttack = () => {
    //Ensure that the player is still in sight
    if ( this.canSeePlayer( 1000, true )) {
      this.parent.doAttack()
    }
  }

  isAttacking() {
    return this.currentMode.name === aiModes.ATTACKING
  }

  canSeePlayer( range, force = false ) {
    const now = performance.now()
    if ( !force && this.canSeePlayerCache.lastCalcTime + PLAYER_SIGHTLINE_THROTTLE > now) {
      return this.canSeePlayerCache.canSeePlayer
    }

    const origin = this.parent.sceneObject.position.clone()
    origin.y += this.eyeHeight
    const toPlayer = this.player.sceneObject.position.clone().sub(origin).normalize()
    const raycast = new THREE.Raycaster(
      origin,
      toPlayer, //normalized direction
      this.radius * 1.1, //near
      range //far
    )

    const result = nearestRaycastGameObject( this.scene, raycast )

    const canSeePlayer = result === this.player


    this.canSeePlayerCache = {
      lastCalcTime: now,
      canSeePlayer
    }

    return canSeePlayer
  }

  chooseRelevantMode() {
    const current = this.currentMode.name
    if ( performance.now() < this.modeChangeLockoutTime || current === aiModes.DEAD ) {
      return
    }

    const inPeripheral = this.isPlayerInPeripheral()
    const seeDistance = inPeripheral ? CHASE_RANGE_PERIPHERAL : ( this.isAlertedToPlayer ? CHASE_RANGE_ALERTED_TO_PLAYER : CHASE_RANGE )
    const distanceToPlayerSq = this.parent.distanceToPlayerSq()
    const canSeePlayer = distanceToPlayerSq <= Math.pow( seeDistance, 2 ) && this.canSeePlayer( seeDistance )
    const attackRangeSq = Math.pow( inPeripheral ? ATTACK_RANGE_PERIPHERAL : this.attackRange, 2 )

    if ( canSeePlayer && !this.player.components.health.isDead ) {
      if ( distanceToPlayerSq < attackRangeSq ) {
        this.startAttackAI()
      }
      else {
        this.startChaseAI()
      }
    }
    else if ( current !== aiModes.PATROLLING ) {
      this.startGuardAI()
    }
  }

  onTakeDamage() {
    if ( this.currentMode.name === aiModes.TAKING_DAMAGE ) {
      return
    }

    this.isAlertedToPlayer = true
    clearTimeout( this.currentModeTimeout )
    this.currentMode = { name: aiModes.TAKING_DAMAGE }
    this.setAnimation( 'take_damage' )
    this.modeChangeLockoutTime = performance.now() + TAKE_DAMAGE_TIME
    this.facePlayerTimeout = setTimeout( this.facePlayer, TAKE_DAMAGE_TIME )
  }

  facePlayer = () => {
    this.parent.facePlayer()
  }

  onDeath( explode ) {
    if ( this.currentMode.name === aiModes.DEAD ) {
      return
    }

    clearTimeout( this.currentModeTimeout )
    this.currentMode = {
      name: aiModes.DEAD,
      deadAt: performance.now()
    }
    this.setAnimation( explode ? 'explode' : 'dead' )
  }

  isPlayerInPeripheral() {
    const thresholdDeg = 105
    const toPlayer = this.player.sceneObject.position.clone().sub(this.parent.sceneObject.position).normalize()

    return this.parent.direction.angleTo(toPlayer) > ( thresholdDeg * Math.PI / 180 )
  }

  removeFromWorldIfDeadAndStationary() {
    const { name, deadAt } = this.currentMode
    if (
      name === aiModes.DEAD && 
      !this.removedFromWorld && 
      performance.now() > deadAt + DEAD_REMOVAL_DELAY &&
      this.parent.sceneObject.getLinearVelocity().length() < 0.01

    ) {
      this.removedFromWorld = true
      this.parent.sceneObject.removeFromPhysicsWorld()
    }
  }

  noticePlayer() {
    this.facePlayer()
    this.isAlertedToPlayer = true
  }
  
  @action
  step( deltaTime ) {    
    this.chooseRelevantMode()
    const { name } = this.currentMode

    if ( playerFacingaiModes.includes( name )) {
      this.facePlayer()
    }

    if ( walkingaiModes.includes( name )) {
      this.parent.walkForward()
    }

    this.removeFromWorldIfDeadAndStationary()
  }

  remove() {
    clearTimeout( this.currentModeTimeout )
    clearTimeout( this.facePlayerTimeout )
  }
}

export default AiLogic