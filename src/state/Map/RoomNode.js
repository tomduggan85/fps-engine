/* global THREE Physijs */

import GameObject from '../GameObject'
import GameObjectTypes from '../../shared/enum/GameObjectTypes'
import {
  randomBetween,
  randomChoice,
  randomWeightedChoice
} from '../../shared/mathUtils'
import Soldier from '../Soldier'
import Monster from '../Monster'
import WallTextures from './WallTextures'
import CeilingTextures from './CeilingTextures'
import FloorTextures from './FloorTextures'
import OutdoorGroundTextures from './OutdoorGroundTextures'
import { addRandomInteriorDecor } from './InteriorDecor'
import {
  WALL_FRICTION,
  FLOOR_FRICTION
} from './MapPhysics'
import { createMaterial } from './Materials'
import { generateGridPositions } from '../../shared/sceneUtils'

const ENABLE_ENEMIES = true

const PATROL_CHANCE = 0.5
const OUTDOOR_GROUND_TEXTURE_CHANCE = 0.5

const PORTAL_EDGE_TEXTURE = '/assets/textures/door_jamb_1.jpg'

export const wallThickness = 1

class MapNode extends GameObject {

  type = GameObjectTypes.Scenery

  constructor( props ) {
    super( props )
    this.containedGameObjects = []
    this.position = props.position
    this.roomType = props.roomType
    this.yaw = 0 /* Track this separately so the physics engine can't introduce rounding errors as node trees get large */
  }

  setupRearPortal() {
    const {
      node,
      width,
      height,
      direction
    } = this.props.from

    const maxPositionX = Math.max(0, this.width - width - 2 * wallThickness)
    let positionX
    if ( direction === 'left' ) {
      positionX = 0
    }
    else if (direction === 'right' ) {
      positionX = maxPositionX
    }
    else {
      positionX = Math.random() * maxPositionX
    }

    this.portals.rear = {
      node,
      width,
      height,
      positionX,
    }
  }

  setupPortals() {
    this.portals = {}
    if ( this.props.from ) {
      this.setupRearPortal()
    }

    const portalDirection = this.props.portalDirection
    const { width, height, positionX } = this.choosePortalDimensions()

    this.portals[ portalDirection ] = {
      width, height, positionX
    }
  }

  setupNode() {
    this.chooseDimensions() /* Child classes override this */
    this.setupPortals()
  }

  getPortalLocalPosition( portalDirection ) {
    const portal = this.portals[ portalDirection ]
    if ( !portal ) {
      return
    }

    switch( portalDirection ) {
      case 'front': return { x: -this.width / 2 + portal.positionX + portal.width / 2, y: 0, z: -this.length / 2 }
      case 'rear': return { x: -this.width / 2 + portal.positionX + portal.width / 2, y: 0, z: this.length / 2 }
      case 'left': return { x: -this.width / 2, y: 0, z: this.length / 2 - portal.positionX - portal.width / 2 }
      case 'right': return { x: this.width / 2, y: 0, z: this.length / 2 - portal.positionX - portal.width / 2 - wallThickness }
      default: return null
    }
  }

  getPortalWorldPosition( portalDirection ) {
    const localPosition = this.getPortalLocalPosition( portalDirection )
    if ( localPosition ) {
      this.sceneObject.updateMatrixWorld( true )
      return this.sceneObject.localToWorld( new THREE.Vector3( localPosition.x, localPosition.y, localPosition.z ))
    }
  }

  attachNewNode( nodeType, nodeProps ) {

    const openPortalDirection = ['left', 'right', 'front', 'rear'].find( direction => this.portals[ direction ] && !this.portals[ direction ].node )
    if ( !openPortalDirection ) {
      return
    }

    const openPortal = this.portals[ openPortalDirection ]

    const node = this.props.gameState.addGameObject( nodeType, {
      ...nodeProps,
      from: {
        node: this,
        width: openPortal.width,
        height: openPortal.height,
        direction: openPortalDirection
      }
    })
    openPortal.node = node

    // Setup rotation

    node.yaw = this.yaw
    if ( openPortalDirection === 'left' ) {
      node.yaw += Math.PI / 2
    }
    else if ( openPortalDirection === 'right' ) {
      node.yaw -= Math.PI / 2
    }
    else if ( openPortalDirection === 'rear' ) {
      node.yaw += Math.PI
    }

    node.sceneObject.rotation.y = node.yaw

    // setup position

    const openPortalPosition = this.getPortalWorldPosition( openPortalDirection )
    const newNodePortalPosition = node.getPortalWorldPosition( 'rear' )
    node.sceneObject.position.copy( openPortalPosition.sub(newNodePortalPosition))

    node.sceneObject.__dirtyPosition = true
    node.sceneObject.__dirtyRotation = true
    return node
  }

  isPlayerIn( player ) {
    const localPosition = this.sceneObject.worldToLocal( player.sceneObject.position.clone())

    const isInWidth = localPosition.x >= -this.width / 2 && localPosition.x <= this.width / 2
    const isInLength = localPosition.z >= -this.length / 2 && localPosition.z <= this.length / 2
    const isInHeight = localPosition.y > 0 && localPosition.y < this.height

    return isInWidth && isInLength && isInHeight
  }

  detachPortal( portalDirection ) {
    this.portals[ portalDirection ].node = null
  }

  remove() {
    this.containedGameObjects.forEach( gameObject => gameObject.remove())
    Object.values( this.portals ).forEach( portal => {
      if (portal.node ) {
        portal.node.detachPortal( 'rear' )
      }
    })
    if ( this.props.from ) {
      this.props.from.node.detachPortal( this.props.from.direction )
    }
    super.remove()
  }

  step() {
    if ( ENABLE_ENEMIES && this.props.includeEnemies && !this.hasAddedEnemies ) {
      /* Done on first step to ensure that this room position has been properly set by it's parent node. */
      this.addEnemies()
    }
  }
  
  addEnemies() {

    const positions = generateGridPositions({
      width: this.width,
      length: this.length,
      xSpacing: 10,
      //No zSpacing, so only 1 column of enemies
    }, this.sceneObject)

    positions.forEach(({ x, z }) => {
      const enemy = this.gameState.addGameObject( randomChoice([ Soldier, Monster ]), {
        position: { x, y: 2, z },
        patrolDurations: Math.random() <= PATROL_CHANCE ? [ 1500, 500 ] : null
      })
      this.containedGameObjects.push( enemy )
    })
    
    this.hasAddedEnemies = true
  }

  getMaxPortalWidth() {
    return this.props.portalDirection === 'front' ? this.width : this.length
  }


  choosePortalDimensions() {
    const { portalDirection } = this.props
    const maxPortalWidth = this.getMaxPortalWidth()

    const portalWidth = randomBetween( 6, maxPortalWidth / 2 )
    const maxPositionX = maxPortalWidth - portalWidth - wallThickness
    let positionX
    
    if (portalDirection === 'right' || portalDirection === 'left' ) {
      positionX = randomBetween( maxPositionX * 0.5, maxPositionX )
    }
    else {
      positionX = Math.random() * maxPositionX
    }

    return {
      width: portalWidth,
      height: ( 6 + Math.random() * (this.height - 6)),
      positionX,
    }
  }

  createWall( direction ) {
    const isSideWall = direction === 'left' || direction === 'right'
    const wallWidth = isSideWall ? this.length : this.width
    
    const wall = this.portals[ direction ] ? 
      this.createPortalWallGeometry( wallWidth, this.height, direction ) : 
      this.createSolidWallGeometry( wallWidth, this.height )
    
    if ( wall ) {
      if ( isSideWall ) {
        wall.rotation.y = Math.PI / 2
      }
      wall.position.set(
        (isSideWall ? ( this.width / 2 - wallThickness / 2 ) * ( direction === 'right' ? 1 : -1 ) : wall.position.x ),
        this.height / 2 + wall.position.y + wallThickness / 2,
        !isSideWall ? ( this.length / 2 - wallThickness / 2 ) * ( direction === 'front' ? -1 : 1 ) : -wall.position.x
      )
      
      this.floor.add(wall)
    }
  }

  createSolidWallGeometry( width, height ) {
    return new Physijs.BoxMesh(
      new THREE.BoxGeometry( width, this.height, wallThickness ),
      createMaterial( this.wallTexture.url, width / this.wallTexture.scale, height / this.wallTexture.scale, WALL_FRICTION ),
      0,
    );
  }

  createPortalWallGeometry( width, height, direction ) {
    const portal = this.portals[ direction ]
    const boxes = []
    const portalEdgeMaterial = createMaterial( PORTAL_EDGE_TEXTURE, 1, height / 2, WALL_FRICTION )
    const topPortalEdgeMaterial = createMaterial( PORTAL_EDGE_TEXTURE, 1, portal.width / 2, WALL_FRICTION )
    topPortalEdgeMaterial.map.rotation = Math.PI / 2
    
    const rightWidth = width - portal.positionX - portal.width
    const rightMaterial = createMaterial( this.wallTexture.url, rightWidth / this.wallTexture.scale, height / this.wallTexture.scale, WALL_FRICTION )
    rightMaterial.map.offset.set( ( portal.width + portal.positionX + wallThickness + 0.1 ) / this.wallTexture.scale, 0 )
    const rightBox = new Physijs.BoxMesh(
      new THREE.BoxGeometry( rightWidth + 0.1, height, wallThickness ),
      [
        rightMaterial,
        portalEdgeMaterial,
        rightMaterial,
        rightMaterial,
        rightMaterial,
        rightMaterial,
      ],
      0,
    );
    rightBox.position.set(
      width / 2 - rightWidth / 2,
      0,
      0
    )
    boxes.push(rightBox)

    if ( height > portal.height ) {
      const middleHeight = (height - portal.height)
      const middleMaterial = createMaterial( this.wallTexture.url, portal.width / this.wallTexture.scale, middleHeight / this.wallTexture.scale, WALL_FRICTION )
      middleMaterial.map.offset.set( ( portal.positionX + wallThickness + 0.1 ) / this.wallTexture.scale, portal.height / this.wallTexture.scale )
      const middleBox = new Physijs.BoxMesh(
        new THREE.BoxGeometry( portal.width - wallThickness, middleHeight, wallThickness ),
        [
          middleMaterial,
          middleMaterial,
          middleMaterial,
          topPortalEdgeMaterial,
          middleMaterial,
          middleMaterial,
        ],
        0,
      );
      middleBox.position.set(
        -width / 2 + portal.positionX + portal.width / 2 + wallThickness / 2,
        height/2 - middleHeight / 2,
        0
      )
      boxes.push(middleBox)
    }

    const leftMaterial = createMaterial( this.wallTexture.url, ( portal.positionX + wallThickness ) / this.wallTexture.scale, height / this.wallTexture.scale, WALL_FRICTION )
    const leftBox = new Physijs.BoxMesh(
      new THREE.BoxGeometry( portal.positionX + wallThickness + 0.1, height, wallThickness ),
      [
        portalEdgeMaterial,
        leftMaterial,
        leftMaterial,
        leftMaterial,
        leftMaterial,
        leftMaterial,
      ],
      0,
    );
    leftBox.position.set(
      -width / 2 + portal.positionX / 2 + wallThickness/2,
      0,
      0
    )
    boxes.push(leftBox)

    //Attach every subsequent box to the first box, and move to be relative to the first box's position
    for ( let i = 1; i < boxes.length; i++ ) {
      boxes[ i ].position.sub( boxes[ 0 ].position )
      boxes[ 0 ].add( boxes[ i ])
    }

    return boxes.length && boxes[ 0 ]
  }

  pickTexture( classProperty, textureSet, oddsOfDeviatingFromLastRoom ) {
    if ( this.props.from ) {
      const randomVal = Math.random()
      if ( this.props.from.node.roomType !== this.props.roomType ) {
        oddsOfDeviatingFromLastRoom *= 3 // Differing room type increases the chance of switching textures
      }

      if ( randomVal > oddsOfDeviatingFromLastRoom ) {
        this[ classProperty ] = this.props.from.node[ classProperty ]
        return
      }
    }

    this[ classProperty ] = randomWeightedChoice( textureSet )
  }

  createFloor() {
    const { position = { x: 0, y: 0, z: 0 } } = this.props

    let texture = this.floorTexture
    if ( this.props.noCeiling && Math.random() < OUTDOOR_GROUND_TEXTURE_CHANCE ) {
      //Override with an outdoor ground texture
      texture = randomWeightedChoice( OutdoorGroundTextures )
    }

    this.floor = new Physijs.BoxMesh(
      new THREE.BoxGeometry( this.width, wallThickness, this.length ),
      createMaterial( texture.url, this.width / texture.scale, this.length / texture.scale, FLOOR_FRICTION ),
      0,
    );
    this.floor.position.set( position.x, position.y, position.z )
  }

  createCeiling() {
    const ceiling = new Physijs.BoxMesh(
      new THREE.BoxGeometry( this.width, wallThickness, this.length ),
      createMaterial( this.ceilingTexture.url, this.width / this.ceilingTexture.scale, this.length / this.ceilingTexture.scale, WALL_FRICTION ),
      0,
    );
    ceiling.position.set( 0, this.height + wallThickness, 0 )
    this.floor.add( ceiling )
  }

  addInteriorDecor() {
    if ( this.props.noCeiling || this.props.noInteriorDecor ) {
      return
    }

    const objects = addRandomInteriorDecor( this )
    if ( objects ) {
      objects.forEach( object => this.containedGameObjects.push( object ))
    }
  }

  addWallDecor() {
    //TODO 
  }

  createSceneObject() {
    this.pickTexture( 'wallTexture', WallTextures, 0.2 )
    this.pickTexture( 'floorTexture', FloorTextures, 0.06 )
    this.pickTexture( 'ceilingTexture', CeilingTextures, 0.1 )

    this.setupNode()
    
    this.createFloor()
    if ( !this.props.noCeiling ) {
      this.createCeiling()
    }

    this.createWall( 'left' )
    this.createWall( 'right' )
    this.createWall( 'front' )
    this.createWall( 'rear' )

    this.addInteriorDecor()
    this.addWallDecor()

    return this.floor
  }
}

export default MapNode