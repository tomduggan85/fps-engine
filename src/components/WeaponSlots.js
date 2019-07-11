import React from 'react'
import classnames from 'classnames'

const SLOT_COUNT = 6

const renderWeaponSlots = ({ player }) => {
  const { weapons, currentWeaponIndex } = player

  return (
    <div className='weapon-slots'>
      {Array( SLOT_COUNT ).fill(1).map(( _, i ) => {
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

export default renderWeaponSlots