
import GameObject from '../GameObject'
import GameObjectTypes from '../../shared/enum/GameObjectTypes'
import { randomChoice } from '../../shared/mathUtils'

class MapNode extends GameObject {

  type = GameObjectTypes.Scenery

  setupPortals() {
    this.portals = {}
    if ( this.props.from ) {
      this.portals.rear = {
        node: this.props.from.node,
        width: this.props.from.width,
        height: this.props.from.height,
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
}

export default MapNode