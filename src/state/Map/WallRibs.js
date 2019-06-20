
import { randomWeightedChoice, randomChoice } from '../../shared/mathUtils'
import { WALL_FRICTION } from './MapPhysics'
import { createRibGeometry } from '../../shared/geometryUtils'
import WallRibTextures from './WallRibTextures'
import { createMaterial } from './Materials'
import { wallThickness } from './RoomNode'
import RoomTypes from '../../shared/enum/RoomTypes'

const MIN_RIB_COUNT = 2
const ONLY_DO_LONG_RIB_DIRECTION_CHANCE = 0.5

const WALL_RIB_SHAPES = [
  {
    bottomBevel: 0.7,
    topBevel: 0.7,
    bevelHeight: 1.5,
    width: 1,
  },
  {
    width: 1,
  },
  {
    width: 2,
  },
  {
    bottomBevel: 1,
    bevelHeight: 2,
    width: 1,
  },
  {
    topBevel: 1.5,
    bevelHeight: 3,
    width: 2,
  },
]

const wallRibIntersectsPortal = ( wallPosition, roomNode, direction ) => {
  const portal = roomNode.portals[ direction ]
  if ( !portal ) {
    return false
  }

  const isSide = direction === 'left' || direction === 'right'
  const roomDimension = isSide ? roomNode.length : roomNode.width
  const wallPosNormalized = isSide ? (roomDimension - (wallPosition + roomDimension / 2)) : (wallPosition + roomDimension / 2)
  const padding = 3

  return wallPosNormalized >= portal.positionX && wallPosNormalized <= portal.positionX + portal.width + padding
}

export const addWallRibs = roomNode => {

  let directions = [ 'left', 'right', 'front', 'rear' ]
  if ( Math.random() <= ONLY_DO_LONG_RIB_DIRECTION_CHANCE ) {
    directions = roomNode.length < roomNode.width ? [ 'front', 'rear' ] : [ 'left', 'right' ]
  }
  const depth = randomChoice([ 0.4, 2, 2, 3 ])
  const spacing = randomChoice([ Math.max( depth * 5, 3 ), Math.min( depth * 10, 10 ) ])
  const texture = randomWeightedChoice( WallRibTextures )
  const material1 = createMaterial( texture.url, 1 / texture.scale, 1 / texture.scale, WALL_FRICTION )
  const material2 = createMaterial( texture.url, 1 / texture.scale, 1 / texture.scale, WALL_FRICTION ) // Same material, rotated 90 degrees
  material2.map.rotation = Math.PI / 2
  const geometrySettings = {
    height: roomNode.height,
    depth,
    ...randomChoice( WALL_RIB_SHAPES )
  }
  
  directions.forEach( direction => {

    const isSide = direction === 'left' || direction === 'right'
    const roomDimension = isSide ? roomNode.length : roomNode.width
    const ribCount = spacing ? Math.max(1, Math.floor( roomDimension / spacing )) : 1
    if ( ribCount < MIN_RIB_COUNT ) {
      return
    }

    for ( let i = 0; i < ribCount; i++ ) {

      const wallPos = -roomDimension / 2 + (( i + 1 ) / ( ribCount + 1 ) * roomDimension ) - depth / 2

      if ( !wallRibIntersectsPortal( wallPos, roomNode, direction )) {
        const arch = createRibGeometry(geometrySettings, material1, material2 )

        arch.position.y = wallThickness / 2
        arch.position[ isSide ? 'x' : 'z' ] =  -(isSide ? roomNode.width : roomNode.length) / 2 + wallThickness
        arch.position[ isSide ? 'z' : 'x' ] = wallPos

        if ( !isSide ) {
          arch.position.x += depth
        }

        if ( direction === 'right' ) {
          arch.position.x *= -1
        }
        else if ( direction === 'rear' ) {
          arch.position.z *= -1
        }

        if ( !isSide ) {
          arch.rotation.y = direction === 'left' ? Math.PI / 2 : -Math.PI / 2
        }
        roomNode.floor.add( arch )
      }
    }
  })
}

export const canHaveWallRibs = roomNode => roomNode.props.roomType !== RoomTypes.NoCeiling