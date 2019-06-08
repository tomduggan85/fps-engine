/* global THREE */

import { randomChoice } from '../shared/mathUtils'

const SKYBOX_CHOICES = [
  'red_gloom',
  //'asteroids',
  'distant_sunset',
  'exosystem',
  'exosystem2',
  'heaven',
  'interstellar',
  'storm',
  'sunset',
  'yellow'
]

class Skybox {
  constructor( props ) {
    this.scene = props.gameState.scene

    const skyTexture = new THREE.CubeTextureLoader()
    .setPath( `/assets/skybox/${ randomChoice( SKYBOX_CHOICES ) }/` )
    .load( [
      'posx.jpg',
      'negx.jpg',
      'posy.jpg',
      'negy.jpg',
      'posz.jpg',
      'negz.jpg',
    ])

    skyTexture.magFilter = THREE.NearestFilter //Pixelate!

    this.scene.background = skyTexture
  }
}

export default Skybox