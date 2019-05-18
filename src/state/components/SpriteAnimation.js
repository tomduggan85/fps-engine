/* global THREE */

import BaseAnimation from './BaseAnimation'
import { action } from 'mobx'

const ANIMATION_DIRECTIONS = 8

class SpriteAnimation extends BaseAnimation {

  constructor( props ) {
    super( props )
    this.camera = props.camera
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
  step() {
    super.step()
    const { name } = this.animationState
    
    const {
      isDirectional,
      directionalOffset,
    } = this.animationDefs[ name ]
    
    let columnOffset = 0
    if ( isDirectional ) {
      const column = Math.floor((( this.getAngleToCamera() / 360 ) * ANIMATION_DIRECTIONS ))
      columnOffset = column * directionalOffset
    }
    
    this.texture.offset.set( this.u + columnOffset, this.v )
  }

}

export default SpriteAnimation