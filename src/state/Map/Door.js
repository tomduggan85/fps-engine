import BoxScenery from '../BoxScenery'
import {
  randomWeightedChoice,
} from '../../shared/mathUtils'
import DoorTextures from './DoorTextures'
import { wallThickness } from './RoomNode'

const DOOR_THICKNESS = wallThickness
const CHECK_OPEN_RATE = 300
const OPEN_DISTANCE = 7
const DOOR_OPEN_RATE = 0.008

const DOOR_EDGE_TEXTURE = '/assets/textures/door_jamb_1_r.jpg'

const OPEN_STATES = {
  closed: 'closed',
  open: 'open', 
  opening: 'opening'
}

class Door extends BoxScenery {
  constructor( props ) {
    const { portal, roomNode } = props
    const textureUrl = randomWeightedChoice( DoorTextures ).url
    super({
      position: { x: 0, y: -10, z: 0 }, /* initially place underneath all rooms to not interfere with other objects before it's positioned */
      textureUrl: [
        DOOR_EDGE_TEXTURE,
        DOOR_EDGE_TEXTURE,
        DOOR_EDGE_TEXTURE,
        DOOR_EDGE_TEXTURE,
        textureUrl,
        textureUrl,
      ], 
      textureRepeat: [ 1, 1 ],
      size: { x: portal.width - wallThickness, y: portal.height, z: DOOR_THICKNESS },
      ...props
    })
    this.player = props.gameState.player
    this.openState = OPEN_STATES.closed

    roomNode.isPositioned.then( this.setupInitialPosition )
  }

  setupInitialPosition = () => {
    const {
      roomNode,
      portalDirection,
      size
    } = this.props

    this.props.position = roomNode.getPortalWorldPosition( portalDirection, true /* accountForWallThickness */ )
    this.props.position.y += size.y / 2 + wallThickness / 2

    this.sceneObject.position.set( this.props.position.x, this.props.position.y, this.props.position.z )
    this.sceneObject.rotation.y = roomNode.yaw

    if ( [ 'left', 'right' ].includes( portalDirection )) {
      this.sceneObject.rotation.y += Math.PI / 2
      
    }
    this.sceneObject.__dirtyPosition = true
    this.sceneObject.__dirtyRotation = true

    this.__checkOpenTimeout = setInterval( this.checkIfShouldOpen, CHECK_OPEN_RATE )
  }

  checkIfShouldOpen = () => {
    if ( this.openState === OPEN_STATES.closed ) {
      const localPosition = this.sceneObject.worldToLocal( this.player.sceneObject.position.clone())
      if ( Math.abs( localPosition.x ) <= this.props.size.x / 2 && Math.abs( localPosition.z ) <= OPEN_DISTANCE ) {
        this.openDoor()
      }
    }
  }

  openDoor() {
    clearInterval( this.__checkOpenTimeout )
    this.openState = OPEN_STATES.opening
  }

  step( deltaTime ) {
    super.step( deltaTime )
    if ( this.openState === OPEN_STATES.opening ) {
      this.sceneObject.position.y += DOOR_OPEN_RATE * deltaTime
      this.sceneObject.__dirtyPosition = true
      this.sceneObject.__dirtyRotation = true
      if (this.sceneObject.position.y >= this.props.position.y + this.props.size.y - 0.5 * wallThickness ) {
        this.openState = OPEN_STATES.open
      }
    }
  }

  remove() {
    clearInterval( this.__checkOpenTimeout )
  }
}

export default Door