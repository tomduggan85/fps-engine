import { action } from 'mobx'
import GameObjectTypes from '../shared/enum/GameObjectTypes'
import uuid from 'uuid'

class GameObject {

  type = GameObjectTypes.GameObject
  id = uuid.v4()

  constructor( props ) {
    this.props = props
    this.gameState = props.gameState
    this.scene = this.gameState.scene
    this.components = {}

    this.sceneObject = this.createSceneObject()
    this.sceneObject.traverse( object => object.gameObject = this )
    this.scene.add( this.sceneObject )
  }

  addComponent( component ) {
    if ( !component.componentType ) {
      throw new Error('No component type')
    }

    this.components[ component.componentType ] = component
  }

  @action
  step( deltaTime ) {
    Object.values( this.components ).forEach( component => component.step && component.step( deltaTime ))
  }

  remove = () => {
    this.scene.remove( this.sceneObject )
    this.gameState.removeGameObject( this )
  }
}

export default GameObject