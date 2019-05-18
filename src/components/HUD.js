import React from 'react'
import './HUD.scss'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import PlayerWeaponRenderer from './PlayerWeaponRenderer'

@observer
class HUD extends React.Component {
  
  render() {
    const {
      health: {
        currentHealth,
        isTakingDamage,
        isDead,
      }
    } = this.props.player.components

    const { currentWeapon } = this.props.player

    return (
      <div className='HUD'>
        <div className={classnames('overlay damage-overlay', { isActive: isTakingDamage })} />
        <div className='bottom-ui'>
          {currentWeapon && <PlayerWeaponRenderer weapon={currentWeapon} />}
          <div className='health'>Health: {currentHealth}</div>
        </div>
        <div className={classnames('overlay dead-overlay', { isActive: isDead })} />
      </div>
    )
  }
}

export default HUD