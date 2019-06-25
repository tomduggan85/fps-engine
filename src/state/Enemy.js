/* global THREE Physijs */

import GameObject from './GameObject'
import GameObjectTypes from '../shared/enum/GameObjectTypes'
import { action } from 'mobx'
import { capMaxVelocity } from '../shared/physicsUtils'
import AiLogic from './components/AiLogic'
import Health from './components/Health'
import SpriteAnimation from './components/SpriteAnimation'
import { disableRotation } from '../shared/physicsUtils'

const FRICTION = 1
const RESTITUTION = 0
const SHOW_DEBUG_VOLUMES = false

const MASS = 2.5
const WALK_STRENGTH = 10

class Enemy extends GameObject {

  type = GameObjectTypes.Enemy

  constructor( props ) {
    super( props )
    this.player = this.gameState.player
    this.animationDefs = props.animationDefs
    this.maxVelocity = props.maxVelocity
    this.radius = props.radius

    disableRotation( this.sceneObject )
    if ( props.direction ) {
      this.direction = new THREE.Vector3( props.direction.x, props.direction.y, props.direction.z ).normalize()
    }
    else {
      this.direction = new THREE.Vector3( 0, 0, 1 )
    }

    this.addComponent( new SpriteAnimation({
      parent: this,
      camera: props.gameState.camera,
      animationDefs: this.animationDefs,
      texture: this.texture,
    }))

    this.addComponent( new AiLogic({
      parent: this,
      patrol: props.patrol,
      patrolDurations: props.patrolDurations,
      radius: this.radius,
      eyeHeight: this.radius * 0.75,
      attackRate: this.animationDefs.attack.duration
    }))

    this.addComponent( new Health({
      parent: this,
      startingHealth: props.startingHealth
    }))
  }

  distanceToPlayerSq() {
    return this.sceneObject.position.distanceToSquared( this.player.sceneObject.position )
  }

  createSceneObject() {
    const {
      position,
      radius
    } = this.props
    const material = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(), FRICTION, RESTITUTION
    );
    material.visible = SHOW_DEBUG_VOLUMES;

    this.texture = new THREE.TextureLoader().load( this.props.textureUrl )
    this.texture.magFilter = THREE.NearestFilter //Pixelate!
    this.texture.minFilter = THREE.NearestFilter //Pixelate!
    this.texture.repeat.set( this.props.textureScale[0], this.props.textureScale[1] )
    const spriteMaterial = new THREE.SpriteMaterial({ map: this.texture })
    const sprite = new THREE.Sprite( spriteMaterial )
    
    sprite.scale.set( 2*radius, 2*radius )

    const sceneObject = new Physijs.SphereMesh(
      new THREE.SphereGeometry( radius, 50, 50 ),
      material,
      MASS
    );
    sceneObject.add( sprite )
    sceneObject.position.set( position.x, position.y, position.z )
    
    return sceneObject
  }

  turnRight() {
    this.direction.applyEuler( new THREE.Euler( 0, Math.PI / 2, 0 ))
  }

  walkForward() {
    this.components.animation.setAnimation( 'walk' )
    const walkImpulse = this.direction.clone()
    walkImpulse.multiplyScalar( WALK_STRENGTH )
    this.sceneObject.applyCentralImpulse( walkImpulse )
  }

  facePlayer() {
    this.direction.set(
      this.player.sceneObject.position.x - this.sceneObject.position.x, 
      0,
      this.player.sceneObject.position.z - this.sceneObject.position.z
    ).normalize()
  }

  @action
  step( deltaTime ) {
    const currentMaxVelocity = this.components.aiLogic.currentMode.name === 'PATROLLING' ? this.maxVelocity / 3 : this.maxVelocity /* Patrol at walk speed */
    capMaxVelocity( this.sceneObject, currentMaxVelocity )
    super.step( deltaTime )
  }
}

export default Enemy