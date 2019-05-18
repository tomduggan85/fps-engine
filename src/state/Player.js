/* global THREE Physijs */

import GameObject from './GameObject'
import GameObjectTypes from '../shared/enum/GameObjectTypes'
import { capMaxVelocity } from '../shared/physicsUtils'
import { action } from 'mobx'
import Health from './components/Health'
import { disableRotation } from '../shared/physicsUtils'

const FRICTION = 1
const RESTITUTION = 0
const SHOW_DEBUG_VOLUMES = true

const HEIGHT = 2
const CAMERA_HEIGHT = 0.25
const RADIUS = 1.25
const MASS = 3
const MAX_VELOCITY = 12
const WALK_IMPULSE = 3

class Player extends GameObject {

  type = GameObjectTypes.Player

  isGoingForward = false
  isGoingBackwards = false
  isStrafingLeft = false
  isStrafingRight = false

  constructor( props ) {
    super( props )
    
    this.camera = this.gameState.camera

    disableRotation( this.sceneObject )
    this.attachCamera()
    
    this.addComponent( new Health({
      parent: this,
      startingHealth: 100
    }))
  }

  attachCamera() {
    this.camera.sceneObject.position.set( 0, CAMERA_HEIGHT, 0 )
    this.sceneObject.add(this.camera.sceneObject)
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
 
  @action
  step( deltaTime ) {
    capMaxVelocity( this.sceneObject, MAX_VELOCITY )
    this.stepMovement()

    super.step( deltaTime )
  }

  @action
  stepMovement() {
    
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

  @action
  capMaxVelocity() {

    /* 
      Cap X and Z velocity, leave Y untouched (for gravity)
      This assumes that the player's own controls are the only thing affecting the player's X and Z velocity
    */
    const currentVelocity = this.sceneObject.getLinearVelocity()
    const capped = new THREE.Vector3( currentVelocity.x, 0, currentVelocity.z )
    capped.clampLength( -MAX_VELOCITY, MAX_VELOCITY )

    this.sceneObject.setLinearVelocity( new THREE.Vector3(
      capped.x,
      currentVelocity.y,
      capped.z
    ))
  }
}

export default Player