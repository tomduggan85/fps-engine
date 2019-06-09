import RoomTypes from '../../shared/enum/RoomTypes'
import RoomNode, { wallThickness } from './RoomNode'
import { randomBetween } from '../../shared/mathUtils'

class NoCeilingRoom extends RoomNode {

  constructor( props ) {
    super({
      ...props,
      roomType: RoomTypes.NoCeiling,
      noCeiling: true
    })
  }

  chooseDimensions() {
    this.length = randomBetween( 15, 40 )
    this.width = randomBetween( this.props.from ? this.props.from.width + 2 * wallThickness : 15, 40 )
    this.height = randomBetween( this.props.from ? this.props.from.height + 2 * wallThickness : 5, 10 )
  }
}

export default NoCeilingRoom