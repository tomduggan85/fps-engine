/* global THREE */

import GameObject from './GameObject'
import GameObjectTypes from '../shared/enum/GameObjectTypes'
import { action } from 'mobx'

const DEFAULT_INTENSITY = 2.2
const DEFAULT_COLOR = 0x404040

class AmbientLight extends GameObject {

  type = GameObjectTypes.Light

  createSceneObject() {
    return new THREE.AmbientLight( DEFAULT_COLOR, DEFAULT_INTENSITY );
  }

  @action
  step( deltaTime ) {
    super.step( deltaTime )
  }
}

export default AmbientLight