import React from 'react'
import './HUD.scss'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import PlayerWeaponRenderer from './PlayerWeaponRenderer'

const WEAPON_SLOTS = 6

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

  renderWeaponSlots() {
    const { weapons, currentWeaponIndex } = this.props.player

    return (
      <div className='weapon-slots'>
        {Array(WEAPON_SLOTS).fill(1).map(( _, i ) => {
          const weapon = weapons[i]
          return (
            <div
              key={`weapon-slot-${ i }`}
              className={classnames( 'weapon-slot', { selected: i === currentWeaponIndex })}
            >
              {weapon && (
                <>
                  <span className='key'>{i+1}</span>
                  <img src={weapon.pickupImageUrl} alt=''/>
                </>
              )}
            </div>
          )
        })}
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
      <div className='HUD'>
        <div className={classnames('overlay damage-overlay', { isActive: isTakingDamage })} />
        <div className='bottom-ui'>
          {currentWeapon && <PlayerWeaponRenderer weapon={currentWeapon} />}
          <div className='hud-content'>
            {this.renderStat( 'Health', currentHealth )}
            {this.renderStat( 'Ammo', currentWeapon ? currentWeapon.ammo : '' )}
            {this.renderStat( 'Kills', killCount )}
            {this.renderWeaponSlots()}
          </div>
        </div>
        <div className={classnames('overlay dead-overlay', { isActive: isDead })} />
      </div>
    )
  }
}

export default HUD