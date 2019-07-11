import React from 'react'
import './HUD.scss'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import PlayerWeaponRenderer from './PlayerWeaponRenderer'
import WeaponSlots from './WeaponSlots'


const THEME = 'rust-theme-1' /* rust-theme-1 through rust-theme-8, metal-theme too */

@observer
class HUD extends React.Component {

  renderStat( title, value ) {
    return (
      <div className='stat'>
        {title}
        <div className='stat-value'>
          {value}
        </div>
      </div>
    )
  }
  
  render() {
    const {
      health: {
        currentHealth,
        isTakingDamage,
        isDead,
      }
    } = this.props.player.components

    const { currentWeapon, killCount } = this.props.player

    return (
      <div className={classnames( 'HUD', THEME )}>
        <div className={classnames('overlay damage-overlay', { isActive: isTakingDamage })} />
        <div className='bottom-ui'>
          {currentWeapon && <PlayerWeaponRenderer weapon={currentWeapon} />}
          <div className='hud-content'>
            {this.renderStat( 'Health', currentHealth )}
            {this.renderStat( 'Ammo', currentWeapon ? currentWeapon.ammo : '' )}
            {this.renderStat( 'Kills', killCount )}
            <WeaponSlots player={this.props.player} />
          </div>
        </div>
        <div className={classnames('overlay dead-overlay', { isActive: isDead })} />
      </div>
    )
  }
}

export default HUD