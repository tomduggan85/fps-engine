import RoomTypes from '../../shared/enum/RoomTypes'
import RoomNode, { wallThickness } from './RoomNode'
import { randomBetween } from '../../shared/mathUtils'

class SmallRoom extends RoomNode {

  constructor( props ) {
    super({
      ...props,
      roomType: RoomTypes.Small,
    })
  }

  chooseDimensions() {
    this.length = randomBetween( 10, 40 )
    this.width = randomBetween( this.props.from ? this.props.from.width + 2 * wallThickness : 10, 30 )
    this.height = randomBetween( this.props.from ? this.props.from.height + 2 * wallThickness : 5, 6 )
  }
}

export default SmallRoom