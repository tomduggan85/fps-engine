import AmbientLight from '../AmbientLight'
import { randomChoice, randomWeightedChoice } from '../../shared/mathUtils'
import { without } from 'lodash'
import BigRoom from './BigRoom'
import SmallRoom from './SmallRoom'
import Hall from './Hall'
import RoomTypes from '../../shared/enum/RoomTypes'

const DESIRED_BRANCH_LENGTH = 4
const FIRST_ROOM_WITH_ENEMIES = 3

class Map {
  constructor( props ) {
    this.player = props.player
    this.gameState = props.gameState

    this.gameState.addGameObject( AmbientLight )

    //Root node
    const rootNode = this.gameState.addGameObject( this.randomRoomType(), {
      position: { x: 0, y: 0, z: 0 },
      portalDirection: this.randomPortalDirection()
    })
    this.nodesCreatedCount = 1

    this.onEnterNode( rootNode )

  }

  randomPortalDirection( toAvoid = null ) {
    return randomChoice( without([ 'left', 'right', 'front' ], toAvoid ))
  }

  randomRoomType( fromNode ) {
    const fromHall = fromNode && fromNode.roomType === RoomTypes.Hall

    return randomWeightedChoice([
      { value: BigRoom, weight: 0.4 },
      { value: SmallRoom, weight: 0.4 },
      { value: Hall, weight: fromHall ? 0.5 : 0.3 },
    ])
  }

  addNodesTo( sourceNode, count ) {
    let currentNode = sourceNode
    const branchDirectionLeadingToNode = Object.keys( sourceNode.portals ).find( direction => !!sourceNode.portals[ direction ].node )
    const branchLeadingToNode = [ sourceNode, ...this.getBranch( sourceNode, sourceNode.portals[ branchDirectionLeadingToNode ] ) ]
    
    const portalDirectionsLeadingToNode = branchLeadingToNode.map( node => Object.keys( node.portals ).find( k => k !== 'rear' ))

    for( let i = 0; i < count; i++ ) {
      const turnToAvoid = portalDirectionsLeadingToNode.find( direction => direction !== 'front' )
      const portalDirection = this.randomPortalDirection( turnToAvoid )
      
      currentNode = currentNode.attachNewNode( this.randomRoomType( currentNode ), {
        portalDirection,
        includeEnemies: this.nodesCreatedCount >= FIRST_ROOM_WITH_ENEMIES - 1,
      })
      portalDirectionsLeadingToNode.unshift( portalDirection )
      if ( currentNode ) {
        this.nodesCreatedCount++
      } else {
        break
      }
    }
  }

  getBranch( node, portal ) {
    const branchNodes = []
    const traverse = ( n, p ) => {
      const nextNode = p.node
      if ( nextNode ) {
        branchNodes.push( nextNode )
        Object.values( nextNode.portals ).forEach( nextPortal => {
          if ( nextPortal.node !== n ) {
            traverse( nextNode, nextPortal )
          }
        })
      }
    }

    if (portal ) {
      traverse( node, portal )
    }

    return branchNodes
  }

  onEnterNode( node ) {
    this.currentlyOccupiedNode = node

    //Make sure that all branches from this node are exactly DESIRED_BRANCH_LENGTH nodes long
    Object.keys( node.portals ).forEach( portalDirection => {
      const portal = node.portals[ portalDirection ]
      const branch = this.getBranch( node, portal )
      const branchLength = branch.length
      if ( branchLength < DESIRED_BRANCH_LENGTH ) {
        // Add additional nodes
        this.addNodesTo( branch[ branchLength - 1 ] || node, DESIRED_BRANCH_LENGTH - branchLength )
      }
      else if ( branchLength > DESIRED_BRANCH_LENGTH ) {
        // Remove all extra nodes
        branch.slice( DESIRED_BRANCH_LENGTH ).forEach( node => node.remove() )
      }
    })
  }

  refreshPlayerNodeLocation() {
    // This assumes that if the player isn't still in the last-occupied node, they must be in an adjacent node (i.e. there's no skipping nodes)
    if ( !this.currentlyOccupiedNode.isPlayerIn( this.player )) {
      const { node } = Object.values( this.currentlyOccupiedNode.portals ).find(({ node }) => node.isPlayerIn( this.player ))
      this.onEnterNode( node )
    }
  }

  step() {
    this.refreshPlayerNodeLocation()
    
  }
}

export default Map