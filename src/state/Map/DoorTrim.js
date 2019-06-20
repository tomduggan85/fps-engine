
import { randomWeightedChoice, randomChoice } from '../../shared/mathUtils'
import { WALL_FRICTION } from './MapPhysics'
import { createArchGeometry } from '../../shared/geometryUtils'
import DoorTrimTextures from './DoorTrimTextures'
import { createMaterial } from './Materials'
import { wallThickness } from './RoomNode'
import RoomTypes from '../../shared/enum/RoomTypes'

export const addDoorTrim = ( roomNode ) => {

  const texture = randomWeightedChoice( DoorTrimTextures )
  const portalDirection = Object.keys(roomNode.portals).find( p => p !== 'rear' )
  const portal = roomNode.portals[ portalDirection ]
  
  const thickness = randomWeightedChoice([
    {weight: 2, value: 0.5},
    {weight: 1, value: 1},
    {weight: 1, value: 1.5},
  ])
  const width = portal.width + thickness - wallThickness
  const height = portal.height + thickness
  const depth = randomChoice([ 3, 4 ])

  const material = createMaterial( texture.url, 1 / texture.scale, 1 / texture.scale, WALL_FRICTION )
  const arch = createArchGeometry({
    width,
    height,
    depth,
    inset: thickness
  }, material)
  
  if ( portalDirection === 'front' ) {
    arch.position.set(
      -roomNode.width / 2 + portal.positionX + portal.width / 2 + wallThickness / 2, 
      0,
      -roomNode.length / 2 - depth / 2
    )
  }
  else {
    arch.rotation.y = portalDirection === 'left' ? Math.PI / 2 : -Math.PI / 2
    arch.position.set(
      (-roomNode.width / 2 - depth / 2) * (portalDirection === 'left' ? 1 : -1), 
      0,
      roomNode.length / 2 - portal.positionX - portal.width / 2 - wallThickness / 2
    )
  }
  
  roomNode.floor.add( arch )
}

export const canHaveDoorTrim = roomNode => roomNode.props.roomType !== RoomTypes.Hall