/* global THREE, Physijs */

import Camera from './Camera'
import Player from './Player'
import BoxScenery from './BoxScenery'
import Soldier from './Soldier'
import Monster from './Monster'
import AmbientLight from './AmbientLight'
import { action, observable } from 'mobx'
import RoomNode from './Map/RoomNode'

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
    this.gameObjects.push( new GameObjectType({
      gameState: this,
      ...props
    }))
  }

  createPlayer() {
    this.player = new Player({ gameState: this })
    this.gameObjects.push( this.player )
  }

  generateMap() {
    this.addGameObject( AmbientLight )

    //Root node
    this.addGameObject( RoomNode, {
      position: { x: 0, y: 0, z: -5 },
    })
  }

  createLevelOld() {
    // TODO load a level

    this.addGameObject( AmbientLight )

    //Ground
    this.addGameObject( BoxScenery, {
      position: { x: 0, y: -2, z: -35 },
      size: { x: 200, y: 5, z: 120 },
      textureUrl: '/assets/textures/concrete2.jpg',
      textureRepeat: [ 20, 20 ],
    })

    this.addGameObject( BoxScenery, {
      position: { x: 0, y: -6, z: 65 },
      size: { x: 200, y: 5, z: 120 },
      textureUrl: '/assets/textures/concrete2.jpg',
      textureRepeat: [ 20, 20 ],
    })

    this.addGameObject( BoxScenery, {
      position: { x: 0, y: -4.5, z: 50 },
      rotation: { x: 0.1, y: 0, z: 0 },
      size: { x: 10, y: 5, z: 52 },
      textureUrl: '/assets/textures/concrete4.jpg',
      textureRepeat: [ 10, 10 ],
      friction: 0.5
    })

    //Ceiling
    this.addGameObject( BoxScenery, {
      position: { x: 0, y: 10, z: 0 },
      size: { x: 200, y: 5, z: 200 },
      textureUrl: '/assets/textures/roof1.jpg',
      textureRepeat: [ 30, 30 ],
    })

    //Walls
    this.addGameObject( BoxScenery, {
      position: { x: -12, y: 0, z: -20 },
      size: { x: 5, y: 15, z: 85 },
      textureUrl: '/assets/textures/concrete3.jpg',
      textureRepeat: [ 20, 1 ],
      friction: 0.1
    })

    this.addGameObject( BoxScenery, {
      position: { x: 37, y: 0, z: -20 },
      size: { x: 60, y: 15, z: 65 },
      textureUrl: '/assets/textures/dirt4.jpg',
      textureRepeat: [ 10, 2 ],
      friction: 0.1
    })

    this.addGameObject( BoxScenery, {
      position: { x: 15, y: 0, z: -85 },
      size: { x: 60, y: 15, z: 60 },
      textureUrl: '/assets/textures/dirt4.jpg',
      textureRepeat: [ 10, 2 ],
      friction: 0.1
    })

    this.addGameObject( BoxScenery, {
      position: { x: 65, y: 0, z: -60 },
      size: { x: 5, y: 15, z: 80 },
      textureUrl: '/assets/textures/dirt4.jpg',
      textureRepeat: [ 10, 2 ],
      friction: 0.1
    })

    this.addGameObject( BoxScenery, {
      position: { x: 0, y: 0, z: -110 },
      size: { x: 200, y: 15, z: 20 },
      textureUrl: '/assets/textures/dirt4.jpg',
      textureRepeat: [ 10, 2 ],
      friction: 0.1
    })

    this.addGameObject( BoxScenery, {
      position: { x: 0, y: 0, z: 90 },
      size: { x: 200, y: 15, z: 10 },
      textureUrl: '/assets/textures/dirt4.jpg',
      textureRepeat: [ 10, 2 ],
      friction: 0.1
    })

    this.addGameObject( BoxScenery, {
      position: { x: 100, y: 0, z: 0 },
      size: { x: 15, y: 15, z: 200 },
      textureUrl: '/assets/textures/dirt4.jpg',
      textureRepeat: [ 10, 2 ],
      friction: 0.1
    })

    this.addGameObject( BoxScenery, {
      position: { x: -100, y: 0, z: 0 },
      size: { x: 15, y: 15, z: 200 },
      textureUrl: '/assets/textures/dirt4.jpg',
      textureRepeat: [ 10, 2 ],
      friction: 0.1
    })

    //boxes
    this.addGameObject( BoxScenery, {
      position: { x: 0, y: 2, z: -20 },
      size: { x: 2, y: 2, z: 2 },
      textureUrl: '/assets/textures/wood floor 2.png',
      textureRepeat: [ 1, 1 ],
      friction: 0.5,
      mass: 25,
    })

    this.addGameObject( BoxScenery, {
      position: { x: 0, y: 4, z: -20 },
      size: { x: 2, y: 2, z: 2 },
      textureUrl: '/assets/textures/wood floor 2.png',
      textureRepeat: [ 1, 1 ],
      friction: 0.8,
      mass: 25,
    })

    this.addGameObject( BoxScenery, {
      position: { x: -2, y: 2, z: -20 },
      size: { x: 2, y: 2, z: 2 },
      textureUrl: '/assets/textures/wood floor 2.png',
      textureRepeat: [ 1, 1 ],
      friction: 0.8,
      mass: 25,
    })

    this.addGameObject( BoxScenery, {
      position: { x: -2, y: 4, z: -20 },
      size: { x: 2, y: 2, z: 2 },
      textureUrl: '/assets/textures/wood floor 2.png',
      textureRepeat: [ 1, 1 ],
      friction: 0.8,
      mass: 25,
    })

    this.addGameObject( BoxScenery, {
      position: { x: -2, y: 6, z: -20 },
      size: { x: 2, y: 2, z: 2 },
      textureUrl: '/assets/textures/wood floor 2.png',
      textureRepeat: [ 1, 1 ],
      friction: 0.8,
      mass: 25,
    })

    //enemies
    this.addGameObject( Soldier, {
      position: { x: 0, y: 2.25, z: -45 },
      direction: { x: -1, y: 0, z: 0 },
      patrol: true,
      patrolDurations: [ 2000, 1000 ]
    })

    this.addGameObject( Monster, {
      position: { x: 0, y: 2.25, z: -28 },
      patrol: false
    })

    this.addGameObject( Soldier, {
      position: { x: -30, y: -3, z: 60 },
      patrol: false
    })

    this.addGameObject( Soldier, {
      position: { x: 30, y: -3, z: 60 },
      patrol: false
    })
  }

  @action
  beginGame() {
    this.gameObjects = []
    this.gameObjectsToRemove = []

    this.camera = new Camera({ gameState: this })
    this.createPlayer()
    this.generateMap()
    
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

  @action
  stepGameLoop() {
    // calculate delta time
    const now = performance.now()
    const deltaTime = ( now - this.lastStepTime ) || 0
    this.lastStepTime = now

    this.player.step( deltaTime )
    this.gameObjects.forEach( gameObject => gameObject.step( deltaTime ))
    this.scene.simulate()
    this.camera.step( deltaTime )

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