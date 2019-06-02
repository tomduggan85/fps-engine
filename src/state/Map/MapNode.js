/* global THREE */

import GameObject from '../GameObject'
import GameObjectTypes from '../../shared/enum/GameObjectTypes'
import { randomChoice, randomBetween } from '../../shared/mathUtils'

export const wallThickness = 0.5

let nodeIdCounter = 0

class MapNode extends GameObject {

  type = GameObjectTypes.Scenery

  constructor( props ) {
    super( props )
    this.containedGameObjects = []
    this.nodeId = nodeIdCounter++
    this.position = props.position
    this.yaw = 0 /* Track this separately so the physics engine can't introduce rounding errors as node trees get large */
  }

  setupRearPortal() {
    const {
      node,
      width,
      height,
      direction
    } = this.props.from

    const maxPositionX = this.width - width - 2 * wallThickness
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
    const maxPortalWidth = (( portalDirection === 'front' ? this.width : this.length ) - 2 * wallThickness)
    const portalWidth =  randomBetween( 4, maxPortalWidth / 2 )

    const maxPositionX = maxPortalWidth - portalWidth
    let positionX
    if ( portalDirection === 'left' ) {
      positionX = maxPositionX
    }
    else if (portalDirection === 'right' ) {
      positionX = maxPositionX
    }
    else {
      positionX = Math.random() * maxPositionX
    }

    this.portals[ portalDirection ] = {
      width: portalWidth,
      height: 6 + Math.random() * (this.height - 6),
      positionX
    }
  }

  setupNode() {
    this.chooseDimensions()
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
      case 'right': return { x: this.width / 2, y: 0, z: this.length / 2 - portal.positionX - portal.width / 2 }
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
}

export default MapNode