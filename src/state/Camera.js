/* global THREE */
import { action } from 'mobx'

const DOWNSAMPLE_RATIO = 3;

const MOUSE_PITCH_RATE = 0.008
const MOUSE_YAW_RATE = 0.005
const TURN_RATE = 0.003

class Camera {

  constructor( props ) {
    this.gameState = props.gameState
    this.scene = this.gameState.scene;

    this.sceneObject = new THREE.PerspectiveCamera(
      60, //Field of view
      4/3, //Aspect ratio, will be recalculated on mount
      0.1, //Near plane
      1500 //Far plane
    );
    this.renderer = new THREE.WebGLRenderer({ alpha: false });
    this.sceneObject.rotation.order = 'ZYX'
  }

  mount( $el ) {
    this.$mountedEl = $el
    this.$mountedEl.appendChild(this.renderer.domElement);
    this.updateSize()
  }

  unmount() {
    this.$mountedEl.removeChild( this.renderer.domElement )
  }

  getScreenDims() {
    const { width, height } = this.$mountedEl.getBoundingClientRect();
    const aspectRatio = width/height;

    return {
      screenWidth: width / DOWNSAMPLE_RATIO,
      screenHeight: height / DOWNSAMPLE_RATIO,
      aspectRatio
    }
  }

  updateSize = () => {
    const {
      screenWidth,
      screenHeight,
      aspectRatio
    } = this.getScreenDims();
    
    this.sceneObject.aspect = aspectRatio;
    this.sceneObject.updateProjectionMatrix();
    this.renderer.setSize( screenWidth, screenHeight );
  }

  @action
  step( deltaTime ) {
    const deltaTurnRate = deltaTime * TURN_RATE
    this.sceneObject.rotation.y += this.turningLeft ? deltaTurnRate : ( this.turningRight ? -deltaTurnRate : 0 )

    this.renderer.render(
      this.scene,
      this.sceneObject
    );
  }

  onMouseMove = e => {
    this.sceneObject.rotation.y -= e.movementX * MOUSE_YAW_RATE
    this.sceneObject.rotation.x = Math.min( Math.PI/2, Math.max( -Math.PI/2, this.sceneObject.rotation.x - e.movementY * MOUSE_PITCH_RATE ))
  }

  onTurnLeft = () => this.turningLeft = true
  onTurnRight = () => this.turningRight = true
  offTurnLeft = () => this.turningLeft = false
  offTurnRight = () => this.turningRight = false
}

export default Camera