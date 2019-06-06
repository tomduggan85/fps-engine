import RoomTypes from '../../shared/enum/RoomTypes'
import RoomNode, { wallThickness } from './RoomNode'
import { randomBetween } from '../../shared/mathUtils'

const NO_CEILING_CHANCE = 0.5

class BigRoom extends RoomNode {

  constructor( props ) {
    super({
      ...props,
      roomType: RoomTypes.Big,
      noCeiling: Math.random() < NO_CEILING_CHANCE
    })
  }

  chooseDimensions() {
    this.length = randomBetween( 15, 40 )
    this.width = randomBetween( this.props.from ? this.props.from.width + 2 * wallThickness : 15, 40 )
    this.height = randomBetween( this.props.from ? this.props.from.height + 2 * wallThickness : 6, 12 )
  }
}

export default BigRoom