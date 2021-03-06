import React from 'react'
import './GameRenderer.scss'
import { inject, observer } from 'mobx-react'
import CameraRenderer from './CameraRenderer'
import PlayerInputArea from './PlayerInputArea'
import HUD from './HUD'
import GameInfo from './GameInfo'
import SplashScreen from './SplashScreen'

@inject( 'gameState' )
@observer
class GameRenderer extends React.Component {

  constructor( props ) {
    super( props )
    this.props.gameState.beginGame()
  }

  componentWillUnmount() {
    this.props.gameState.stopGameLoop()
  }

  render() {
    const {
      camera,
      player,
    } = this.props.gameState

    return (
      <>
        <div className='GameRenderer'>
          <SplashScreen />
          <CameraRenderer camera={camera} />
          <PlayerInputArea camera={camera} player={player} />
          <HUD player={player} />
        </div>
        <GameInfo />
      </>
    )
  }
}

export default GameRenderer