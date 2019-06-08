/* global THREE Physijs */

import { randomWeightedChoice, randomChoice } from '../../shared/mathUtils'
import { WALL_FRICTION } from './MapPhysics'
import ColumnTextures from './ColumnTextures'
import { createMaterial } from './Materials'
import { generateGridPositions } from '../../shared/sceneUtils'

const FIXED_COLUMN_COUNT_CHANCE = 0.5
const FILL_ROOM_COLUMN_SPACING = 10

const addSquareColumns = ( roomNode ) => {
  const texture = randomWeightedChoice( ColumnTextures )
  const size = Math.min( roomNode.width, roomNode.length ) > 26 ? 3.5 : 2
  const trimSize = 0.4
  const useFixedCount = Math.random() <= FIXED_COLUMN_COUNT_CHANCE
  const columnMaterial = createMaterial( texture.url, size / texture.scale, roomNode.height / texture.scale, WALL_FRICTION )

  const positions = generateGridPositions({
    width: roomNode.width,
    length: roomNode.length,
    xSpacing: useFixedCount ? Math.max( roomNode.width / 2, FILL_ROOM_COLUMN_SPACING ) : FILL_ROOM_COLUMN_SPACING,
    zSpacing: useFixedCount ? Math.max( roomNode.width / 2, FILL_ROOM_COLUMN_SPACING ) : FILL_ROOM_COLUMN_SPACING,
  })

  positions.forEach( position => {
    const column = new Physijs.BoxMesh(
      new THREE.BoxGeometry( size, roomNode.height, size ),
      columnMaterial,
      0,
    );
    column.position.set( position.x , roomNode.height / 2, position.z )
    roomNode.floor.add( column )

    const trimMaterial = createMaterial( '/assets/textures/roof1.jpg', size / texture.scale, trimSize, WALL_FRICTION )
    const trimHeights = [ 0.5, roomNode.height + 0.5 ]
      trimHeights.forEach( trimHeight => {
        const trim = new THREE.Mesh(
        new THREE.BoxGeometry( size + trimSize, trimSize, size + trimSize ),
        trimMaterial,
      );
      trim.position.set( position.x , trimHeight, position.z )
      roomNode.floor.add( trim )
    })
    
  })
}

const enoughSpace = ( roomNode, minimumDimension ) => roomNode.width >= minimumDimension && roomNode.length >= minimumDimension//roomNode.width * roomNode.length >= minimumDimension * minimumDimension

export const addRandomInteriorDecor = ( roomNode ) => {

  const roomForColumns = enoughSpace( roomNode, 24 )
  const roomForInteriorBox = enoughSpace( roomNode, 10 )

  const interiorDecorChoice = randomWeightedChoice([
    { value: 'square_columns', weight: roomForColumns ? 100 : 0 },
    //{ value: 'circle_columns', weight: roomForColumns ? 0.2 : 0 },
    //{ value: 'interior_box', weight: roomForInteriorBox ? 0.2 : 0 },
    { value: 'nothing', weight: 0.6 },
  ])

  if ( interiorDecorChoice === 'square_columns') {
    addSquareColumns( roomNode )
  }
}