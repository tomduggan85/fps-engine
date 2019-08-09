import React from 'react'
import './PlayerInputArea.scss'
import controls from '../shared/keyboardControls'
import { observer, inject } from 'mobx-react'
import ControlsExplainer from './ControlsExplainer'

@inject( 'gameState' )
@observer
class PlayerInputArea extends React.Component {

  state = {
    pointerLocked: false,
    hasEnteredInput: false,
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

      case controls.attack:
        player.onAttack()
        break

      case controls.up:
        player.onForward()
        break

      case controls.down:
        player.onBackwards()
        break

      case controls.left:
        pointerLocked ? player.onStrafeLeft() : camera.onTurnLeft()
        break

      case controls.right:
        pointerLocked ? player.onStrafeRight() : camera.onTurnRight()
        break

      case controls.equipWeapon1:
        player.equipWeapon( 0 )
        break

      case controls.equipWeapon2:
        player.equipWeapon( 1 )
        break

      case controls.equipWeapon3:
        player.equipWeapon( 2 )
        break

      case controls.equipWeapon4:
        player.equipWeapon( 3 )
        break

      case controls.equipWeapon5:
        player.equipWeapon( 4 )
        break

      case controls.equipWeapon6:
        player.equipWeapon( 5 )
        break

      case 32: // Space bar, disable page scroll
        e.preventDefault()
        return

      default:
        return
    }

    if ( !this.state.hasEnteredInput ) {
      this.setState({ hasEnteredInput: true })
    }
  }

  onKeyUp = ( e ) => {
    const { pointerLocked } = this.state
    const { camera, player } = this.props

    if ( player.isDead ) {
      return
    }

    switch( e.keyCode ) {
      case controls.attack:
        player.offAttack()
        break

      case controls.up:
        player.offForward()
        break

      case controls.down:
        player.offBackwards()
        break

      case controls.left:
        pointerLocked ? player.offStrafeLeft() : camera.offTurnLeft()
        break

      case controls.right:
        pointerLocked ? player.offStrafeRight() : camera.offTurnRight()
        break

      default:
        break
    }
  }

  onPointerLockChange = () => {
    const { player } = this.props
    if( document.pointerLockElement !== this.$el ) {
      this.setState({ pointerLocked: false })
      player.offAttack()
    }
  }

  onMouseMove = e => {
    this.props.camera.onMouseMove( e )
  }

  onClick = () => {
    if ( !this.state.hasEnteredInput ) {
      this.setState({ hasEnteredInput: true })
    }

    if ( this.props.player.isDead && this.props.player.readyToRespawn ) {
      this.props.gameState.respawnPlayer()
    }
    else if ( !this.state.pointerLocked ) {
      this.setState({ pointerLocked: true })
      this.$el.requestPointerLock()
    }
  }

  onMouseAttack = () => {
    this.props.player.onAttack()
  }

  offMouseAttack = () => {
    this.props.player.offAttack()
  }

  render() {
    const { pointerLocked, hasEnteredInput } = this.state
    const { isDead } = this.props.player
    const mouseLookEnabled = pointerLocked && !isDead

    return (
      <div
        ref={ el => this.$el = el }
        className='PlayerInputArea'
        onMouseMove={mouseLookEnabled ? this.onMouseMove : undefined}
        onClick={this.onClick}
        onMouseDown={mouseLookEnabled ? this.onMouseAttack : undefined}
        onMouseUp={mouseLookEnabled ? this.offMouseAttack : undefined}
      >
        {!hasEnteredInput && <ControlsExplainer />}
      </div>
    )
  }
}

export default PlayerInputArea