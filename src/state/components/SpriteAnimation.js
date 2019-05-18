/* global THREE */

import { action, observable } from 'mobx'

const ANIMATION_DIRECTIONS = 8

class SpriteAnimation {

  componentType = 'animation'

  @observable
  animationState = null

  constructor( props ) {
    this.parent = props.parent
    this.camera = props.camera
    this.animationDefs = props.animationDefs
    this.texture = props.texture
  }

  getAngleToCamera() {
    const camPos = new THREE.Vector3()
    this.camera.sceneObject.getWorldPosition( camPos )
    const vectorToCamera = camPos.sub(this.parent.sceneObject.position)
    vectorToCamera.y = 0
    vectorToCamera.normalize()
    
    const atanDiff = Math.atan2(vectorToCamera.x,  vectorToCamera.z) - Math.atan2(this.parent.direction.x,  this.parent.direction.z)
    let angle = 180 / Math.PI * atanDiff + 180 / ANIMATION_DIRECTIONS
    if ( angle < 0 ) {
      angle = 360 + angle
    }

    return angle
  }

  @action
  setAnimation( animationName ) {
    if ( !this.animationState || animationName !== this.animationState.name ) {
      this.animationState = {
        name: animationName,
        startTime: performance.now()
      }

      this.step()
    }
  }
  
  @action
  step() {
    const {
      name,
      startTime,
    } = this.animationState
    
    const {
      frames,
      duration,
      isDirectional,
      directionalOffset,
    } = this.animationDefs[ name ]
    
    const now = performance.now()
    const frameIndex = Math.floor(( now - startTime ) % duration / duration * frames.length )

    const frame = frames[ frameIndex ]
    let columnOffset = 0

    if ( isDirectional ) {
      const column = Math.floor((( this.getAngleToCamera() / 360 ) * ANIMATION_DIRECTIONS ))
      columnOffset = column * directionalOffset
    }
    
    this.texture.offset.set( frame.u + columnOffset, frame.v )
  }

}

export default SpriteAnimation