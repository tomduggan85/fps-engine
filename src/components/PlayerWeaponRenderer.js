import React from 'react'
import './PlayerWeaponRenderer.scss'
import { observer } from 'mobx-react'

@observer
class PlayerWeaponRenderer extends React.Component {
  render() {
    const {
      imageUrl,
      animation: {
        width,
        height,
        u,
        v,
        uShift,
      }
    } = this.props.weapon

    return (
      <div className='PlayerWeaponRenderer'>
        <div
          className='WeaponImage'
          style={{
            backgroundImage: `url(${ imageUrl })`,
            width: `${ width }px`,
            height: `${ height }px`,
            marginLeft: `${ -width/2 + uShift }px`,
            backgroundPosition: `${ -u }px ${ -v }px`
          }}
        />
      </div>
    )
  }
}

export default PlayerWeaponRenderer