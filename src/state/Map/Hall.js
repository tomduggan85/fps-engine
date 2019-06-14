import RoomTypes from '../../shared/enum/RoomTypes'
import RoomNode, { wallThickness } from './RoomNode'
import { randomBetween } from '../../shared/mathUtils'

const DEFAULT_HALL_WIDTH = 7
const DEFAULT_HALL_HEIGHT = 6

class Hall extends RoomNode {

  constructor( props ) {
    super({
      ...props,
      roomType: RoomTypes.Hall,
    })
  }

  chooseDimensions() {
    this.length = randomBetween( 15, 40 )
    this.height = this.props.from ? this.props.from.height : DEFAULT_HALL_HEIGHT
    this.width = this.props.from ? this.props.from.width + wallThickness : DEFAULT_HALL_WIDTH
  }

  choosePortalDimensions() {
    const { portalDirection } = this.props

    const basePortalWidth = this.props.from ? this.props.from.width : this.width
    const portalWidth = portalDirection === 'front' ? basePortalWidth : randomBetween(0.8, 1.5) * basePortalWidth

    return {
      width: portalWidth,
      height: this.height,
      positionX: portalDirection !== 'front' ? (this.getMaxPortalWidth() - portalWidth - wallThickness) : 0,
    }
  }

  getEnemyRowCount() {
    return 1 // Only ever one enemy per hall section
  }

  addInteriorDecor() {
    //Override as no-op since there is not enough space
  }

  addDoorTrim() {
    //Override as no-op
  }

  createPortalWallGeometry( width, height, direction ) {
    //Only create wall geometry if exiting to the left or right.  Otherwise, it's unnecessary
    if ( direction === 'left' || direction === 'right' ) {
      return super.createPortalWallGeometry( width, height, direction )
    }
  }
}

export default Hall