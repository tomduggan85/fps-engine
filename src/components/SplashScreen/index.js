import React from 'react'
import classnames from 'classnames'
import './styles.scss'
import { randomBetween } from '../../shared/mathUtils'

const SLICES = 150
const EXIT_DELAY = 1500

const ANIMATION_STATES = {
  loading: 'loading',
  entering: 'entering',
  exiting: 'exiting',
  exited: 'exited',
}

class SplashScreen extends React.Component {
  state = {
    animationState: ANIMATION_STATES.loading
  }

  drawImageToCanvas() {
    const imageWidth = this.$canvasEl.width * 0.8
    const imageHeight = imageWidth * this.$imageEl.height / this.$imageEl.width
    const { width, height } = this.$canvasEl

    const context = this.$canvasEl.getContext( '2d' )
    context.fillStyle = '#000000'
    context.fillRect(0, 0, width, height )
    context.drawImage(
      this.$imageEl,
      ( width - imageWidth ) / 2,
      ( height - imageHeight ) / 2,
      imageWidth,
      imageHeight
    )

  }

  initializeCanvas = () => {
    this.drawImageToCanvas()

    this.canvasColumns = Array( SLICES ).fill().map(() => ({
      velocity: randomBetween( 0.0005, 0.0008 ),
      height: 0
    }))

    this.setState({ animationState: ANIMATION_STATES.entering })

    setTimeout(() => {
      this.setState({ animationState: ANIMATION_STATES.exiting })
      this.stepCanvasAnimation()
    }, EXIT_DELAY )
  }

  stepCanvasAnimation = () => {
    const now = performance.now()
    const dt = this.lastStep ? now - this.lastStep : 0
    this.lastStep = now

    const { width, height } = this.$canvasEl
    const context = this.$canvasEl.getContext( '2d' )

    let finished = true
    this.canvasColumns.forEach(( column, i ) => {
      column.height += dt * column.velocity
      if ( column.height < 1 ) {
        finished = false
      }
      context.clearRect( width * i / SLICES, 0, width / SLICES, height * column.height )
    })

    if ( finished ) {
      this.setState({ animationState: ANIMATION_STATES.exited })
    }
    else {
      requestAnimationFrame( this.stepCanvasAnimation )
    }
  }

  render() {
    const { animationState } = this.state
    if ( animationState === ANIMATION_STATES.exited ) {
      return null
    }

    return (
      <div className={classnames('SplashScreen', animationState )}>
        <img
          alt=''
          src='/assets/images/title.png'
          ref={el => this.$imageEl = el}
          onLoad={this.initializeCanvas}
        />
        <canvas
          width='1000px'
          height='1000px'
          ref={el => this.$canvasEl = el}
        />
      </div>
    )
  }
}

export default SplashScreen