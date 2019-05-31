/* global THREE */

import GameObject from '../GameObject'
import GameObjectTypes from '../../shared/enum/GameObjectTypes'
import { randomChoice } from '../../shared/mathUtils'

export const wallThickness = 1

class MapNode extends GameObject {

  type = GameObjectTypes.Scenery

  constructor( props ) {
    super( props )
    this.position = props.position
  }

  setupPortals() {
    this.portals = {}
    if ( this.props.from ) {
      this.portals.rear = {
        node: this.props.from.node,
        width: this.props.from.width,
        height: this.props.from.height,
        positionX: Math.random() * ( this.width - this.props.from.width )
      }
    }

    const portalDirection = randomChoice([ 'left', 'right', 'front' ])
    const maxPortalWidth = portalDirection === 'front' ? this.width : this.length
    const portalWidth =  3 + Math.random() * (maxPortalWidth - 3)

    this.portals[ portalDirection ] = {
      width: portalWidth,
      height: 6 + Math.random() * (this.height - 6),
      positionX: Math.random() * ( maxPortalWidth - portalWidth ),
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

  attachNewNode( nodeType ) {

    const openPortalDirection = ['left', 'right', 'front', 'rear'].find( direction => this.portals[ direction ] && !this.portals[ direction ].node )
    if ( !openPortalDirection ) {
      return
    }

    const openPortal = this.portals[ openPortalDirection ]

    const node = this.props.gameState.addGameObject( nodeType, {
      from: {
        node: this,
        width: openPortal.width,
        height: openPortal.height,
      }
    })
    openPortal.node = node

    // Setup rotation

    node.sceneObject.rotation.copy( this.sceneObject.rotation )

    if ( openPortalDirection === 'left' ) {
      node.sceneObject.rotation.y += Math.PI / 2
    }
    else if ( openPortalDirection === 'right' ) {
      node.sceneObject.rotation.y -= Math.PI / 2
    }
    else if ( openPortalDirection === 'rear' ) {
      node.sceneObject.rotation.y += Math.PI
    }

    // setup position

    const openPortalPosition = this.getPortalWorldPosition( openPortalDirection )
    const newNodePortalPosition = node.getPortalWorldPosition( 'rear' )
    node.sceneObject.position.copy( openPortalPosition.sub(newNodePortalPosition))

    node.sceneObject.__dirtyPosition = true
    node.sceneObject.__dirtyRotation = true
    return node
  }
}

export default MapNode