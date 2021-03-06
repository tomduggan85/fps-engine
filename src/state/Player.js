/* global THREE Physijs */

import GameObject from './GameObject'
import GameObjectTypes from '../shared/enum/GameObjectTypes'
import { capMaxVelocity } from '../shared/physicsUtils'
import { action, observable, computed } from 'mobx'
import Health from './components/Health'
import { disableRotation } from '../shared/physicsUtils'
import { WeaponTypes, WeaponIds } from '../shared/enum/WeaponTypes'
import ReactGA from 'react-ga'

const FRICTION = 1
const RESTITUTION = 0
const SHOW_DEBUG_VOLUMES = false

const HEIGHT = 2
const RADIUS = 1.25
const MASS = 3
const MAX_VELOCITY = 12
const WALK_IMPULSE = 3

const STARTING_HEALTH = 100
const RESPAWN_DELAY = 2000

class Player extends GameObject {

  type = GameObjectTypes.Player

  isGoingForward = false
  isGoingBackwards = false
  isStrafingLeft = false
  isStrafingRight = false
  isAttacking = false

  @observable
  weapons = []

  @observable
  currentWeaponIndex = null

  @observable
  killCount = 0

  @observable
  readyToRespawn = false

  constructor( props ) {
    super( props )
    
    this.camera = this.gameState.camera

    disableRotation( this.sceneObject )
    this.attachCamera()
    
    this.addComponent( new Health({
      parent: this,
      startingHealth: STARTING_HEALTH
    }))

    this.setupStartingWeapons()
  }

  attachCamera() {
    this.camera.player = this
    this.sceneObject.add(this.camera.sceneObject)
  }

  setupStartingWeapons() {
    this.weapons = []
    this.currentWeaponIndex = null
    this.addWeapon( WeaponIds.Shotgun, 999 )
    this.addWeapon( WeaponIds.MachineGun, 999 )
    this.addWeapon( WeaponIds.RocketLauncher, 999 )
  }

  respawn() {
    this.components.health.setCurrentHealth( STARTING_HEALTH )
    this.killCount = 0
    this.readyToRespawn = false
    this.isGoingForward = false
    this.isGoingBackwards = false
    this.isStrafingLeft = false
    this.isStrafingRight = false
    this.isAttacking = false
    
    this.setupStartingWeapons()
  }

  createSceneObject() {
    const material = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(), FRICTION, RESTITUTION
    );
    material.visible = SHOW_DEBUG_VOLUMES;

    const bottomSphere = new Physijs.SphereMesh(
      new THREE.SphereGeometry( RADIUS, 50, 50 ),
      material,
      MASS / 3
    );
    bottomSphere.position.y = -HEIGHT / 2

    const topSphere = new Physijs.SphereMesh(
      new THREE.SphereGeometry( RADIUS, 50, 50 ),
      material,
      MASS / 3
    );
    topSphere.position.y = HEIGHT / 2

    const sceneObject = new Physijs.CylinderMesh(
      new THREE.CylinderGeometry( RADIUS, RADIUS, HEIGHT, 50 ),
      material,
      MASS / 3
    );

    sceneObject.add( bottomSphere )
    sceneObject.add( topSphere )
    sceneObject.position.y = HEIGHT / 2 + RADIUS + 1
    
    return sceneObject
  }

  onForward = () => this.isGoingForward = true
  offForward = () => this.isGoingForward = false
  
  onBackwards = () => this.isGoingBackwards = true
  offBackwards = () => this.isGoingBackwards = false

  onStrafeLeft = () => this.isStrafingLeft = true
  offStrafeLeft = () => this.isStrafingLeft = false

  onStrafeRight = () => this.isStrafingRight = true
  offStrafeRight = () => this.isStrafingRight = false

  onAttack = () => this.isAttacking = true
  offAttack = () => this.isAttacking = false
 
  @action
  step( deltaTime ) {
    capMaxVelocity( this.sceneObject, MAX_VELOCITY )
    this.stepMovement()

    if ( this.currentWeapon ) {
      if ( this.isAttacking && !this.isDead ) {
        this.currentWeapon.attack()
      }
      this.currentWeapon.step( deltaTime )
    }

    super.step( deltaTime )
  }

  @action
  stepMovement() {

    if ( this.isDead ) {
      return
    }
    
    /* First, get vector representing intended movement from camera's current direction, in world coordinates */
    const impulseVector = this.camera.sceneObject.localToWorld(new THREE.Vector3(
      this.isStrafingLeft ? -1 : ( this.isStrafingRight ? 1 : 0 ),
      0,
      this.isGoingForward ? -1 : ( this.isGoingBackwards ? 1 : 0 )
    ))

    /* Next, subtract camera world position to get a direction vector */
    const camPos = new THREE.Vector3()
    this.camera.sceneObject.getWorldPosition(camPos)
    impulseVector.x -= camPos.x
    impulseVector.y = 0 /* Player cannot move vertically */
    impulseVector.z -= camPos.z

    /* Scale the vector length */
    impulseVector.multiplyScalar(WALK_IMPULSE)
    
    /* Apply as a central impulse */
    this.sceneObject.applyCentralImpulse( impulseVector )
  }

  addWeapon( weaponId, ammo ) {
    const existingWeapon = this.weapons.find( weapon => weapon.weaponId === weaponId )
    if ( existingWeapon ) {
      existingWeapon.addAmmo( ammo )
    }
    else {
      const WeaponType = WeaponTypes[ weaponId ]
      this.weapons.push( new WeaponType({
        player: this,
        ammo
      }))
      if ( !this.currentWeaponIndex ) {
        this.equipWeapon( 0 )
      }
    }
  }

  onDeath() {
    ReactGA.event({
      category: 'user',
      action: 'game over',
      value: this.killCount
    })

    setTimeout(() => {
      this.readyToRespawn = true
    }, RESPAWN_DELAY )
  }

  async equipWeapon( weaponIndex ) {
    if ( this.currentWeaponIndex === weaponIndex || !this.weapons[ weaponIndex ]) {
      return
    }

    if ( this.currentWeapon ) {
      await this.currentWeapon.putAway()
    }

    this.currentWeaponIndex = weaponIndex
    this.currentWeapon.equip()
  }

  @computed
  get currentWeapon() {
    return this.weapons[this.currentWeaponIndex]
  }

  @computed
  get isDead() {
    return this.components.health.isDead
  }
}

export default Player