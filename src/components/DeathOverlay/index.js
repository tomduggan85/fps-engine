import React from 'react'
import './styles.scss'
import { observer } from 'mobx-react'
import classnames from 'classnames'

@observer
class DeathOverlay extends React.Component {
  
  render() {
    const { killCount, readyToRespawn } = this.props.player

    return (
      <div className={classnames( 'DeathOverlay', { readyToRespawn })}>
        {Array( 3 ).fill().map(( _, i ) => <h1 key={i}>You have been gobbled up</h1>)}
        { killCount } kills.<br/>
        <span className='respawnLabel'>click to respawn.</span>
      </div>  
    )
  }
}

export default DeathOverlay