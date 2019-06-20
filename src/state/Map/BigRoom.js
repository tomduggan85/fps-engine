import RoomTypes from '../../shared/enum/RoomTypes'
import RoomNode, { wallThickness } from './RoomNode'
import { randomBetween } from '../../shared/mathUtils'

class BigRoom extends RoomNode {

  constructor( props ) {
    super({
      ...props,
      roomType: RoomTypes.Big
    })
  }

  chooseDimensions() {
    this.length = randomBetween( 35, 60 )
    this.width = randomBetween( this.props.from ? this.props.from.width + 2 * wallThickness : 25, 45 )
    this.height = randomBetween( this.props.from ? this.props.from.height + 2 * wallThickness : 5, 15 )
  }
}

export default BigRoom