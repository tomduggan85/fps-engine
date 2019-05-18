
import { action, observable } from 'mobx'


class BaseAnimation {

  componentType = 'animation'

  @observable
  animationState = null

  @observable
  u = null

  @observable
  v = null

  @observable
  width = null

  @observable
  height = null

  @observable
  uShift = null

  constructor( props ) {
    this.parent = props.parent
    this.animationDefs = props.animationDefs
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
      loop,
    } = this.animationDefs[ name ]
    
    const now = performance.now()
    const elapsed = now - startTime

    const frameIndex = ( elapsed > duration && loop === false ) ?
      frames.length - 1 :
      Math.floor( elapsed % duration / duration * frames.length )

    const frame = frames[ frameIndex ]

    this.u = frame.u
    this.v = frame.v
    this.width = frame.width
    this.height = frame.height
    this.uShift = frame.uShift || 0
  }
}

export default BaseAnimation