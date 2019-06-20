/* global THREE Physijs */

import {
  randomWeightedChoice,
  randomChoice,
  randomBetween
} from '../../shared/mathUtils'
import { WALL_FRICTION } from './MapPhysics'
import ColumnTextures from './ColumnTextures'
import WallTextures from './WallTextures'
import { createMaterial } from './Materials'
import { generateGridPositions } from '../../shared/sceneUtils'

const FIXED_COLUMN_COUNT_CHANCE = 0.5
const FILL_ROOM_COLUMN_SPACING = 10
const CYLINDER_COLUMN_CHANCE = 0.2

const squareColumnGeometry = ( size, height ) => new THREE.BoxGeometry( size, height, size )
const cylinderColumnGeometry = ( size, height ) => new THREE.CylinderGeometry( size / 2, size / 2, height, 32 )

const addColumns = roomNode => {
  const texture = randomWeightedChoice( ColumnTextures )
  const size = Math.min( roomNode.width, roomNode.length ) > 26 ? 3.5 : 2
  const trimSize = 0.4
  const useFixedCount = Math.random() <= FIXED_COLUMN_COUNT_CHANCE
  const columnMaterial = createMaterial( texture.url, size / texture.scale, roomNode.height / texture.scale, WALL_FRICTION )
  const isCylinder = Math.random() <= CYLINDER_COLUMN_CHANCE
  const columnGeometry = isCylinder ? cylinderColumnGeometry : squareColumnGeometry
  const columnPhysicsMesh = isCylinder ? Physijs.CylinderMesh : Physijs.BoxMesh

  const positions = generateGridPositions({
    width: roomNode.width,
    length: roomNode.length,
    xSpacing: useFixedCount ? Math.max( roomNode.width / 2, FILL_ROOM_COLUMN_SPACING ) : FILL_ROOM_COLUMN_SPACING,
    zSpacing: useFixedCount ? Math.max( roomNode.width / 2, FILL_ROOM_COLUMN_SPACING ) : FILL_ROOM_COLUMN_SPACING,
  })

  positions.forEach( position => {
    const column = new columnPhysicsMesh(
      columnGeometry( size, roomNode.height ),
      columnMaterial,
      0,
    );
    column.position.set( position.x , roomNode.height / 2, position.z )
    roomNode.floor.add( column )

    const trimMaterial = createMaterial( '/assets/textures/roof1.jpg', size / texture.scale, trimSize, WALL_FRICTION )
    const trimHeights = [ 0.5, roomNode.height + 0.5 ]
      trimHeights.forEach( trimHeight => {
        const trim = new THREE.Mesh(
        columnGeometry( size + trimSize, trimSize ),
        trimMaterial,
      );
      trim.position.set( position.x , trimHeight, position.z )
      roomNode.floor.add( trim )
    })
    
  })
}

const addInteriorBox = roomNode => {
  const inset = randomBetween( 9, Math.min( roomNode.width, roomNode.length ) / 2 - 3 )
  const width = roomNode.width - inset * 2
  const height = roomNode.height
  const length = roomNode.length - inset * 2
  const texture = Math.random() <= 0.7 ? roomNode.wallTexture : randomWeightedChoice( WallTextures )

  const box = new Physijs.BoxMesh(
    new THREE.BoxGeometry( width, height, length ),
    createMaterial( texture.url, width / texture.scale, height / texture.scale, WALL_FRICTION ),
    0,
  );
  box.position.set( 0, height / 2, 0 )
  roomNode.floor.add( box )
}

const enoughSpace = ( roomNode, minimumDimension ) => roomNode.width >= minimumDimension && roomNode.length >= minimumDimension

export const addRandomInteriorDecor = ( roomNode ) => {

  const roomForColumns = enoughSpace( roomNode, 20 )
  const roomForInteriorBox = enoughSpace( roomNode, 22 )

  const interiorDecorChoice = randomWeightedChoice([
    { value: 'columns', weight: roomForColumns ? 0.6 : 0 },
    { value: 'interior_box', weight: roomForInteriorBox ? 0.4 : 0 },
    { value: 'nothing', weight: 0.1 },
  ])

  if ( interiorDecorChoice === 'columns') {
    addColumns( roomNode )
  }
  else if ( interiorDecorChoice === 'interior_box' ) {
    addInteriorBox( roomNode )
  }
}