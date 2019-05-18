import React from 'react'
import './PlayerInputArea.scss'
import controls from '../shared/keyboardControls'

class PlayerInputArea extends React.Component {

  state = {
    pointerLocked: false
  }
 
  componentDidMount() {
    document.addEventListener('pointerlockchange', this.onPointerLockChange )
    document.addEventListener( 'keydown', this.onKeyDown )
    document.addEventListener( 'keyup', this.onKeyUp )
  }

  componentWillUnmount() {
    document.removeEventListener('pointerlockchange', this.onPointerLockChange )
    document.removeEventListener( 'keydown', this.onKeyDown )
    document.removeEventListener( 'keyup', this.onKeyUp )
  }

  onKeyDown = ( e ) => {
    const { pointerLocked } = this.state
    const { camera, player } = this.props
    
    switch( e.keyCode ) {
      case controls.up:
        player.onForward()
        e.preventDefault()
        break

      case controls.down:
        player.onBackwards()
        e.preventDefault()
        break

      case controls.left:
        pointerLocked ? player.onStrafeLeft() : camera.onTurnLeft()
        e.preventDefault()
        break

      case controls.right:
        pointerLocked ? player.onStrafeRight() : camera.onTurnRight()
        e.preventDefault()
        break

      default:
        break
    }
  }

  onKeyUp = ( e ) => {
    const { pointerLocked } = this.state
    const { camera, player } = this.props

    switch( e.keyCode ) {
      case controls.up:
        player.offForward()
        e.preventDefault()
        break

      case controls.down:
        player.offBackwards()
        e.preventDefault()
        break

      case controls.left:
        pointerLocked ? player.offStrafeLeft() : camera.offTurnLeft()
        e.preventDefault()
        break

      case controls.right:
        pointerLocked ? player.offStrafeRight() : camera.offTurnRight()
        e.preventDefault()
        break

      default:
        break
    }
  }

  onPointerLockChange = () => {
    if( document.pointerLockElement !== this.$el ) {
      this.setState({ pointerLocked: false })
    }
  }

  onMouseMove = e => {
    this.props.camera.onMouseMove( e )
  }

  onClick = () => {
    if ( !this.state.pointerLocked ) {
      this.setState({ pointerLocked: true })
      this.$el.requestPointerLock()
    }
  }

  render() {
    const { pointerLocked } = this.state
    return (
      <div
        ref={ el => this.$el = el }
        className='PlayerInputArea'
        onMouseMove={pointerLocked ? this.onMouseMove : undefined}
        onClick={this.onClick}
      />
    )
  }
}

export default PlayerInputArea