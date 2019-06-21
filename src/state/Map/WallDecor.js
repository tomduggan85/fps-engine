
import { randomWeightedChoice } from '../../shared/mathUtils'
import { addWallBevel } from './WallBevel'
import { addWallRibs, canHaveWallRibs } from './WallRibs'
import { addDoorTrim, canHaveDoorTrim } from './DoorTrim'


export const addRandomWallDecor = ( roomNode ) => {

  const wallDecorChoice = randomWeightedChoice([
    { value: 'wall_ribs', weight: canHaveWallRibs( roomNode ) ? 3 : 0 },
    { value: 'wall_bevel', weight: 2 },
    { value: 'door_trim', weight: canHaveDoorTrim( roomNode ) ? 1 : 0 },
    { value: 'nothing', weight: 0.5 },
  ])

  if ( wallDecorChoice === 'wall_ribs') {
    addWallRibs( roomNode )
  }
  else if ( wallDecorChoice === 'door_trim' ) {
    addDoorTrim( roomNode )
  }
  else if ( wallDecorChoice === 'wall_bevel' ) {
    addWallBevel( roomNode )
  }
}