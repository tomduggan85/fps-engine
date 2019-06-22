/* global THREE */

import BoxScenery from '../BoxScenery'
import {
  randomWeightedChoice,
  randomBetween
} from '../../shared/mathUtils'
import BoxTextures from './BoxTextures'
import shuffle from 'lodash/shuffle'

const BOX_SIZE = 3
const BOX_MASS = 12

const BOX_STACK_CONFIGURATIONS = [ 
  {
    positions: [ /* 3 bottom, 2 top, x axis */
      { x: -3.2, y: 2.5, z: 0 },
      { x: 0, y: 2.5, z: 0 },
      { x: 3, y: 2.5, z: 0 },
      { x: -2, y: 5.5, z: 0 },
      { x: 1.5, y: 5.5, z: 0 },
    ],
    minRoomWidth: 20, minRoomLength: 18, minRoomHeight: 8
  },
  {
    positions: [ /* 3 bottom, 2 top, skew */
      { x: -2, y: 2.5, z: -3.2 },
      { x: 0, y: 2.5, z: 0 },
      { x: 1.5, y: 2.5, z: 3 },
      { x: -0.5, y: 5.5, z: -2 },
      { x: 0.5, y: 5.5, z: 1.5 },
    ],
    minRoomWidth: 25, minRoomLength: 25, minRoomHeight: 8
  },
  {
    positions: [ /* 1 bottom, 1 top */
      { x: 0, y: 2.5, z: 0 },
      { x: 0, y: 2.5, z: 0 },
    ],
    minRoomWidth: 15, minRoomLength: 15, minRoomHeight: 7
  },
  {
    positions: [ /* 3 bottom, then 2, then 1, x axis */
      { x: -3.2, y: 2.5, z: 0 },
      { x: 0, y: 2.5, z: 0 },
      { x: 3, y: 2.5, z: 0 },
      { x: -2, y: 5.5, z: 0 },
      { x: 1.5, y: 5.5, z: 0 },
      { x: 0.1, y: 8.5, z: 0 },
    ],
    minRoomWidth: 20, minRoomLength: 20, minRoomHeight: 10
  },
  {
    positions: [ /* 3 bottom, then 2, then 1, skew */
      { x: -2.5, y: 2.5, z: -3.2 },
      { x: 0, y: 2.5, z: 0 },
      { x: 2.5, y: 2.5, z: 3 },
      { x: -1, y: 5.5, z: -2 },
      { x: 1, y: 5.5, z: 1.5 },
      { x: 0, y: 8.5, z: 0.1 },
    ],
    minRoomWidth: 23, minRoomLength: 23, minRoomHeight: 10
  },
  {
    positions: [ /* 3 bottom, then 2, then 2, x axis */
      { x: -3.2, y: 2.5, z: 0 },
      { x: 0, y: 2.5, z: 0 },
      { x: 3, y: 2.5, z: 0 },
      { x: -2, y: 5.5, z: 0 },
      { x: 1.5, y: 5.5, z: 0 },
      { x: -1.9, y: 8.5, z: 0 },
      { x: 1.7, y: 8.5, z: 0 },
    ],
    minRoomWidth: 22, minRoomLength: 22, minRoomHeight: 10
  },
  {
    positions: [ /* 2 bottom, 2 top, x axis */
      { x: -2, y: 2.5, z: 0 },
      { x: 1.5, y: 2.5, z: 0 },
      { x: -1.5, y: 5.5, z: 0 },
      { x: 1.5, y: 5.5, z: 0 },
    ],
    minRoomWidth: 20, minRoomLength: 18, minRoomHeight: 7
  },
  {
    positions: [ /* 2 bottom, 2 top, skewed */
      { x: -1.5, y: 2.5, z: -1.5 },
      { x: 1.5, y: 2.5, z: 1.5 },
      { x: -1.4, y: 5.5, z: -1.5 },
      { x: 1.4, y: 5.5, z: 1.4 },
    ],
    minRoomWidth: 20, minRoomLength: 18, minRoomHeight: 7
  },
  {
    positions: [ /* 2 bottom, 1 top, x axis */
      { x: -1.5, y: 2.5, z: 0 },
      { x: 1.5, y: 2.5, z: 0 },
      { x: 0, y: 5.5, z: 0 },
    ],
    minRoomWidth: 18, minRoomLength: 18, minRoomHeight: 7
  },
  {
    positions: [ /* 2 bottom, 1 top, z axis */
      { x: 0, y: 2.5, z: -1.5 },
      { x: 0, y: 2.5, z: 1.5 },
      { x: 0, y: 5.5, z: 0 },
    ],
    minRoomWidth: 20, minRoomLength: 20, minRoomHeight: 7
  },
]

const BOX_ROOM_POSITIONS = [
  { x: 0.25 , z: 0.6 },
  { x: 0.7 , z: 0.65 },
  { x: 0.4 , z: 0.65 },
  { x: 0.7 , z: 0.35 },
  { x: 0.25 , z: 0.35 },
  { x: 0.75 , z: 0.35 },
  { x: 0.4 , z: 0.35 },
  { x: 0.4 , z: 0.5 },
  { x: 0.6 , z: 0.5 },
]

export const roomFitsAnyBoxes = roomNode => BOX_STACK_CONFIGURATIONS.some( configuration => boxConfigurationFitsRoom( configuration, roomNode ))

export const boxConfigurationFitsRoom = ({ minRoomWidth, minRoomLength, minRoomHeight }, roomNode) => {
  return roomNode.width >= minRoomWidth && roomNode.length >= minRoomLength && roomNode.height >= minRoomHeight
}

export const addBoxStacks = ( roomNode, gameState ) => {
  const boxes = []
  const texture = randomWeightedChoice( BoxTextures )

  const boxConfigurationsThatFit = BOX_STACK_CONFIGURATIONS.filter( configuration => boxConfigurationFitsRoom( configuration, roomNode ))

  const howMany = Math.min( boxConfigurationsThatFit.length, randomWeightedChoice([
    { value: 1, weight: 2 },
    { value: 2, weight: 2 },
    { value: 3, weight: 1 },
  ]))

  const boxConfigurationsToUse = shuffle( boxConfigurationsThatFit ).slice( 0, howMany )
  const roomPositionsToUse = shuffle( BOX_ROOM_POSITIONS ).slice( 0, howMany )

  boxConfigurationsToUse.forEach(({ positions }, i ) => {
    const roomPosition = {
      x: -roomNode.width / 2 + roomPositionsToUse[ i ].x * roomNode.width,
      z: -roomNode.length / 2 + roomPositionsToUse[ i ].z * roomNode.length, 
    }

    positions.forEach( position => {
      
      const box = gameState.addGameObject( BoxScenery, {
        position: { x: 0, y: -10, z: 0 }, /* initially place underneath all rooms to not interfere with other objects before it's positioned */
        size: { x: BOX_SIZE, y: BOX_SIZE, z: BOX_SIZE },
        rotation: { x: 0, y: randomBetween( -Math.PI / 2, Math.PI / 2 ), z: 0 },
        mass: BOX_MASS,
        textureUrl: texture.url, 
        textureRepeat: [ 1, 1 ],
        friction: 0.5,
        restitution: 0.5
      })

      setTimeout(() => {
        /* Position the boxes after the first step, which positions the map */
        const worldPos = roomNode.floor.localToWorld( new THREE.Vector3(
          position.x + roomPosition.x,
          position.y,
          position.z + roomPosition.z
        ))
        box.sceneObject.position.set( worldPos.x, worldPos.y, worldPos.z )
        box.sceneObject.__dirtyPosition = true
      }, 0)

      boxes.push( box )
    })
  })

  return boxes
}