/* global THREE Physijs */

import MapNode, { wallThickness } from './MapNode'
import { randomBetween } from '../../shared/mathUtils'

const WALL_FRICTION = 1
const FLOOR_FRICTION = 1
const RESTITUTION = 0.5



class RoomNode extends MapNode {

  chooseDimensions() {
    this.length = randomBetween( 10, 40 )
    this.width = randomBetween( this.props.from ? this.props.from.width : 10, 40 )
    this.height = randomBetween( this.props.from ? this.props.from.height : 7, 17 )
  }

  createMaterial( url, repeatX, repeatY, friction ) {
    const texture = new THREE.TextureLoader().load( url )
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter //Pixelate!
    texture.minFilter = THREE.NearestMipMapLinearFilter //Pixelate!
    texture.repeat.set( repeatX, repeatY )

    return Physijs.createMaterial(
      new THREE.MeshLambertMaterial({
        map: texture
      }),
      friction,
      RESTITUTION,
    );
  }

  createWall( direction ) {
    const isSideWall = direction === 'left' || direction === 'right'
    const wallWidth = isSideWall ? this.length : this.width
    
    const wall = this.portals[ direction ] ? 
      this.createPortalWallGeometry( wallWidth, this.height, direction ) : 
      this.createSolidWallGeometry( wallWidth, this.height )
    
    if ( isSideWall ) {
      wall.rotation.y = Math.PI / 2
    }

    wall.position.set(
      (isSideWall ? ( this.width / 2 - wallThickness / 2 ) * ( direction === 'right' ? 1 : -1 ) : wall.position.x ),
      this.height / 2 + wall.position.y,
      !isSideWall ? ( this.length / 2 - wallThickness / 2 ) * ( direction === 'front' ? -1 : 1 ) : -wall.position.x
    )
    
    this.floor.add(wall)
  }

  createSolidWallGeometry( width, height ) {
    return new Physijs.BoxMesh(
      new THREE.BoxGeometry( width, this.height, wallThickness ),
      this.createMaterial( '/assets/textures/metal_floor_3.jpg', width / 4, height / 4, WALL_FRICTION ),
      0,
    );
  }

  createPortalWallGeometry( width, height, direction ) {
    const portal = this.portals[ direction ]

    const boxes = []

    if ( portal.positionX + portal.width < width ) {
      const rightWidth = width - portal.positionX - portal.width
      const rightBox = new Physijs.BoxMesh(
        new THREE.BoxGeometry( rightWidth, height, wallThickness ),
        this.createMaterial( '/assets/textures/metal_floor_3.jpg', rightWidth / 4, height / 4, WALL_FRICTION ),
        0,
      );
      rightBox.position.set(
        width / 2 - rightWidth / 2,
        0,
        0
      )
      boxes.push(rightBox)
    }

    if ( height > portal.height ) {
      const middleHeight = (height - portal.height)
      const middleBox = new Physijs.BoxMesh(
        new THREE.BoxGeometry( portal.width, middleHeight, wallThickness ),
        this.createMaterial( '/assets/textures/metal_floor_3.jpg', portal.width / 4, middleHeight / 4, WALL_FRICTION ),
        0,
      );
      middleBox.position.set(
        -width / 2 + portal.positionX + portal.width / 2,
        height/2 - middleHeight / 2,
        0
      )
      boxes.push(middleBox)
    }

    if ( portal.positionX > 0 ) {
      const leftBox = new Physijs.BoxMesh(
        new THREE.BoxGeometry( portal.positionX, height, wallThickness ),
        this.createMaterial( '/assets/textures/metal_floor_3.jpg', portal.positionX / 4, height / 4, WALL_FRICTION ),
        0,
      );
      leftBox.position.set(
        -width / 2 + portal.positionX / 2,
        0,
        0
      )
      boxes.push(leftBox)
    }

    //Attach every subsequent box to the first box, and move to be relative to the first box's position
    for ( let i = 1; i < boxes.length; i++ ) {
      boxes[ i ].position.sub( boxes[ 0 ].position )
      boxes[ 0 ].add( boxes[ i ])
    }

    return boxes.length && boxes[ 0 ]
  }

  createSceneObject() {
    super.setupNode()
    const { position = { x: 0, y: 0, z: 0 } } = this.props

    //Floor
    this.floor = new Physijs.BoxMesh(
      new THREE.BoxGeometry( this.width, wallThickness, this.length ),
      this.createMaterial( '/assets/textures/metal_ground_1.jpg', this.width / 4, this.length / 4, FLOOR_FRICTION ),
      0,
    );
    this.floor.position.set( position.x, position.y, position.z )

    //Ceiling
    const ceiling = new Physijs.BoxMesh(
      new THREE.BoxGeometry( this.width, wallThickness, this.length ),
      this.createMaterial( '/assets/textures/roof1.jpg', this.width / 4, this.length / 4, WALL_FRICTION ),
      0,
    );
    ceiling.position.set( 0, this.height - wallThickness / 2, 0 )
    this.floor.add( ceiling )

    this.createWall( 'left' )
    this.createWall( 'right' )
    this.createWall( 'front' )
    this.createWall( 'rear' )

    return this.floor
  }
}

export default RoomNode