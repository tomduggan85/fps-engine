/* global THREE Physijs */

import {
  randomWeightedChoice,
  randomChoice,
  randomBetween
} from '../../shared/mathUtils'
import WallTextures from './WallTextures'
import { createMaterial } from './Materials'

const addWallRings = roomNode => {
  
}

export const addRandomWallDecor = ( roomNode ) => {

  const wallDecorChoice = randomWeightedChoice([
    { value: 'wall_rings', weight: 0.5 },
    { value: 'nothing', weight: 0.5 },
  ])

  if ( wallDecorChoice === 'wall_rings') {
    addWallRings( roomNode )
  }
}