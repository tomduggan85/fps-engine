/* global THREE */
import { action } from 'mobx'

const DOWNSAMPLE_RATIO = 3;

const MOUSE_PITCH_RATE = 0.008
const MOUSE_YAW_RATE = 0.005
const TURN_RATE = 0.003
const CAMERA_HEIGHT = 0.25

class Camera {

  constructor( props ) {
    this.gameState = props.gameState
    this.scene = this.gameState.scene;
    this.player = this.gameState.player

    this.sceneObject = new THREE.PerspectiveCamera(
      60, //Field of view
      4/3, //Aspect ratio, will be recalculated on mount
      0.1, //Near plane
      1500 //Far plane
    );
    this.sceneObject.position.set( 0, CAMERA_HEIGHT, 0 )
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

  onPlayerRespawn() {
    this.sceneObject.position.y = CAMERA_HEIGHT
    this.sceneObject.rotation.x = 0
  }

  stepMovement( deltaTime ) {
    
    const deltaTurnRate = deltaTime * TURN_RATE
    this.sceneObject.rotation.y += this.turningLeft ? deltaTurnRate : ( this.turningRight ? -deltaTurnRate : 0 )
  }

  stepDeathCam( deltaTime ) {
    this.sceneObject.rotation.x = Math.max( this.sceneObject.rotation.x - deltaTime * 0.001, -0.4 * Math.PI / 2 )
    this.sceneObject.position.y = Math.max( -2, this.sceneObject.position.y - deltaTime * 0.005 )
  }

  @action
  step( deltaTime ) {
    
    if ( this.player && this.player.isDead ) {
      this.stepDeathCam( deltaTime )
    }
    else {
      this.stepMovement( deltaTime )
    }

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