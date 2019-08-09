import AmbientLight from '../AmbientLight'
import { randomChoice, randomWeightedChoice } from '../../shared/mathUtils'
import { without } from 'lodash'
import BigRoom from './BigRoom'
import NoCeilingRoom from './NoCeilingRoom'
import SmallRoom from './SmallRoom'
import Hall from './Hall'
import RoomTypes from '../../shared/enum/RoomTypes'
import GameObjectTypes from '../../shared/enum/GameObjectTypes'

const DESIRED_BRANCH_LENGTH = 5
const FIRST_ROOM_WITH_ENEMIES = 3

class Map {
  constructor( props ) {
    this.player = props.player
    this.gameState = props.gameState

    this.gameState.addGameObject( AmbientLight )

    //Root node
    const rootNode = this.gameState.addGameObject( SmallRoom, {
      position: { x: 0, y: 0, z: 0 },
      portalDirection: this.randomPortalDirection(),
      noInteriorDecor: true,
      forceAddDoor: true,
    })
    rootNode.markAsPositioned()
    this.nodesCreatedCount = 1

    this.onEnterNode( rootNode )
  }

  cleanOutEnemiesFromNode( node ) {
    node.containedGameObjects = node.containedGameObjects.filter( gameObject => {
      if ( gameObject.type === GameObjectTypes.Enemy ) {
        gameObject.remove()
        return false
      }
      return true
    })
  }

  onPlayerRespawn() {
    this.cleanOutEnemiesFromNode( this.currentlyOccupiedNode )
    Object.keys( this.currentlyOccupiedNode.portals ).forEach( portalDirection => {
      /* Clean out enemies from immediately adjacent nodes */
      const portal = this.currentlyOccupiedNode.portals[ portalDirection ]
      this.cleanOutEnemiesFromNode( portal.node )
    })
  }

  randomPortalDirection( toAvoid = null ) {
    return randomChoice( without([ 'left', 'right', 'front' ], toAvoid ))
  }

  randomRoomType( fromNode ) {
    const fromHall = fromNode && fromNode.roomType === RoomTypes.Hall

    return randomWeightedChoice([
      { value: BigRoom, weight: 0.35 },
      { value: NoCeilingRoom, weight: 0.25 },
      { value: SmallRoom, weight: 0.42 },
      { value: Hall, weight: fromHall ? 0.45 : 0.3 },
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
        for ( let i = DESIRED_BRANCH_LENGTH; i < branchLength; i++ ) {
          branch[i].remove()
        }
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