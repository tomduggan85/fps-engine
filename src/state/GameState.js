/* global THREE, Physijs */

import Camera from './Camera'
import Player from './Player'
import Map from './Map/Map'
import Skybox from './Skybox'
import GameObjectTypes from '../shared/enum/GameObjectTypes'

import { action, observable } from 'mobx'

Physijs.scripts.worker = '/external_js/physijs_worker.js';
Physijs.scripts.ammo = '/external_js/ammo.js';

class GameState {

  @observable
  gameObjects = []

  @observable
  scene = null

  @observable
  player = null

  gameObjectsToRemove = []

  constructor() {
    this.gtlfLoader = new THREE.GLTFLoader()
    this.scene = new Physijs.Scene()
    this.scene.setGravity(new THREE.Vector3( 0, -30, 0 ))

    this.stepGameLoop = this.stepGameLoop.bind(this)
  }

  addGameObject( GameObjectType, props = {} ) {
    const gameObject = new GameObjectType({
      gameState: this,
      ...props
    })
    this.gameObjects.push( gameObject )
    return gameObject
  }

  createPlayer() {
    this.player = new Player({ gameState: this })
    this.gameObjects.push( this.player )
  }

  respawnPlayer() {
    this.respawnRequested = true
  }

  @action
  beginGame() {
    this.gameObjects = []
    this.gameObjectsToRemove = []

    this.camera = new Camera({ gameState: this })
    this.createPlayer()

    this.skybox = new Skybox({
      gameState: this
    })

    this.map = new Map({
      player: this.player,
      gameState: this,
    })
    
    this.startGameLoop()
  }

  @action
  startGameLoop() {
    this.lastStepTime = performance.now()
    this.stepGameLoop()
  }

  @action
  stopGameLoop() {
    cancelAnimationFrame(this._gameLoopRAF)
  }

  finishPlayerRespawn() {
    this.gameObjects.forEach( gameObject => {
      if ( gameObject.type === GameObjectTypes.Projectile ) {
        gameObject.remove()
      }
    })
    this.map.onPlayerRespawn()
    this.camera.onPlayerRespawn()
    this.player.respawn()
    this.respawnRequested = false
  }

  @action
  stepGameLoop() {
    // calculate delta time
    const now = performance.now()
    const deltaTime = ( now - this.lastStepTime ) || 0
    this.lastStepTime = now

    this.gameObjects.forEach( gameObject => gameObject.step( deltaTime ))
    this.map.step( deltaTime )
    this.scene.simulate()
    this.camera.step( deltaTime )

    if ( this.respawnRequested ) {
      this.finishPlayerRespawn()
    }

    this.cleanupRemovedGameObjects()

    this._gameLoopRAF = requestAnimationFrame(this.stepGameLoop)
  }

  removeGameObject( gameObject ) {
    this.gameObjectsToRemove.push( gameObject.id )
  }

  cleanupRemovedGameObjects() {
    this.gameObjectsToRemove.forEach( id => {
      const index = this.gameObjects.findIndex( gameObject => gameObject.id === id )
      this.gameObjects.splice(index, 1)
    })
    this.gameObjectsToRemove = []
  }

  getGameObjectsInRange( position, range ) {
    const rangeSquared = range * range
    return this.gameObjects.reduce(( results, gameObject ) => {
      const distSq = gameObject.sceneObject.position.distanceToSquared( position )
      if ( distSq <= rangeSquared ) {
        results.push({ gameObject, distance: Math.sqrt( distSq )})
      }
      return results
    }, [])
  }
}

export default GameState