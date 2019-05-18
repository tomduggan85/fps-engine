import React from 'react'
import './HUD.scss'
import { observer } from 'mobx-react'
import classnames from 'classnames'

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

    return (
      <div className='HUD'>
        <div className={classnames('overlay damage-overlay', { isActive: isTakingDamage })} />
        <div className='bottom-ui'>
          <div className='health'>Health: {currentHealth}</div>
        </div>
        <div className={classnames('overlay dead-overlay', { isActive: isDead })} />
      </div>
    )
  }
}

export default HUD