
import { randomWeightedChoice, randomChoice } from '../../shared/mathUtils'
import { WALL_FRICTION } from './MapPhysics'
import { createArchGeometry } from '../../shared/geometryUtils'
import DoorTrimTextures from './DoorTrimTextures'
import { createMaterial } from './Materials'
import { wallThickness } from './RoomNode'

const DOOR_TRIM_CHANCE = 0.4

export const addDoorTrim = ( roomNode ) => {

  if ( Math.random() <= DOOR_TRIM_CHANCE ) {
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
}