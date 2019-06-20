/* global THREE */

import { randomChoice } from '../../shared/mathUtils'
import { WALL_FRICTION } from './MapPhysics'
import { createMaterial } from './Materials'
import { wallThickness } from './RoomNode'
import RoomTypes from '../../shared/enum/RoomTypes'

const MIN_WALL_WIDTH_FOR_BEVEL = 6
const BEVEL_ROTATION = 0.5
const BEVEL_HEIGHT = 2.5
const BEVEL_DEPTH = 1
const BEVEL_TEXTURE_VERTICAL_SCALE = 0.83

const positionBevel = ( bevel, roomNode, direction, isTop ) => {
  const frMirror = direction === 'rear' ? 1 : -1
  const lrMirror = direction === 'right' ? 1 : -1
  switch( direction ) {
      case 'left':
      case 'right':
        bevel.position.x = ( roomNode.width / 2 - wallThickness ) * lrMirror
        bevel.rotation.z = -BEVEL_ROTATION * lrMirror
        break
      case 'front':
      case 'rear':
      default:
        bevel.position.z = ( roomNode.length / 2 - wallThickness ) * frMirror
        bevel.rotation.z = BEVEL_ROTATION * frMirror
        bevel.rotation.y = Math.PI / 2
        break
    }

    if ( isTop ) {
      bevel.rotation.z *= -1
    }

    if ( isTop ) {
      bevel.position.y = roomNode.height - BEVEL_HEIGHT / 2 + wallThickness
    }
    else {
      bevel.position.y = BEVEL_HEIGHT / 2
    }
}

const getBevelConfig = () => {
  return randomChoice([
    { top: true },
    { bottom: true },
    { top: true, bottom: true }
  ])
}

export const addWallBevel = roomNode => {
  const directions = [ 'front', 'rear', 'left', 'right' ]

  const bevelConfig = getBevelConfig()

  directions.forEach( direction => {
    //TODO do not skip walls with a portal
    const isSide = direction === 'left' || direction === 'right'
    let bevelLength = ( isSide ? roomNode.length : roomNode.width ) - 2 * wallThickness
    const oppositeLength = isSide ? roomNode.width : roomNode.length
    if ( roomNode.portals[ direction ] || oppositeLength < MIN_WALL_WIDTH_FOR_BEVEL ) {
      return
    }

    if ( isSide && roomNode.props.roomType === RoomTypes.Hall ) {
      //No door threshold in this case, extend the wall bevel
      bevelLength += 2 * wallThickness
    }
    
    const roomWallTexture = roomNode.wallTexture

    if ( bevelConfig.bottom ) {
      const bottomMaterial = createMaterial( roomWallTexture.url, bevelLength / roomWallTexture.scale, BEVEL_TEXTURE_VERTICAL_SCALE * BEVEL_HEIGHT / roomWallTexture.scale, WALL_FRICTION )
      bottomMaterial.map.offset.x = wallThickness / roomWallTexture.scale

      const bottomBevel = new THREE.Mesh(
        new THREE.BoxGeometry( BEVEL_DEPTH, BEVEL_HEIGHT, bevelLength ),
        bottomMaterial
      )
      
      positionBevel( bottomBevel, roomNode, direction, false )
      roomNode.floor.add( bottomBevel )
    }

    if ( bevelConfig.top && roomNode.props.roomType !== RoomTypes.NoCeiling ) {
      const topMaterial = createMaterial( roomWallTexture.url, bevelLength / roomWallTexture.scale, BEVEL_TEXTURE_VERTICAL_SCALE * BEVEL_HEIGHT / roomWallTexture.scale, WALL_FRICTION )
      topMaterial.map.offset.x = wallThickness / roomWallTexture.scale
      topMaterial.map.offset.y = ( roomNode.height - BEVEL_HEIGHT / 2 - wallThickness ) / roomWallTexture.scale
      const topBevel = new THREE.Mesh(
        new THREE.BoxGeometry( BEVEL_DEPTH, BEVEL_HEIGHT, bevelLength ),
        topMaterial
      )
      positionBevel( topBevel, roomNode, direction, true )
      roomNode.floor.add( topBevel )
    }
  })
}