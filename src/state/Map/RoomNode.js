/* global THREE Physijs */

import MapNode from './MapNode'

const WALL_FRICTION = 1
const FLOOR_FRICTION = 1
const RESTITUTION = 0.5

const WALL_THICKNESS = 1

class RoomNode extends MapNode {

  chooseDimensions() {
    //TODO should be at least as big as the rear door
    this.length = 10 + Math.random() * 30
    this.width = 10 + Math.random() * 30
    this.height = 6 + Math.random() * 10
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
      (isSideWall ? ( this.width / 2 - WALL_THICKNESS / 2 ) * ( direction === 'right' ? 1 : -1 ) : wall.position.x ),
      this.height / 2 + wall.position.y,
      !isSideWall ? ( this.length / 2 - WALL_THICKNESS / 2 ) * ( direction === 'front' ? -1 : 1 ) : -wall.position.x
    )
    
    this.floor.add(wall)
  }

  createSolidWallGeometry( width, height ) {
    return new Physijs.BoxMesh(
      new THREE.BoxGeometry( width, this.height, WALL_THICKNESS ),
      this.createMaterial( '/assets/textures/metal_floor_3.jpg', width / 4, height / 4, WALL_FRICTION ),
      0,
    );
  }

  createPortalWallGeometry( width, height, direction ) {
    const portal = this.portals[ direction ]

    const boxes = []

    if ( portal.positionX + portal.width < width ) {
      console.error('make a rightbox')
      const rightWidth = width - portal.positionX - portal.width
      const rightBox = new Physijs.BoxMesh(
        new THREE.BoxGeometry( rightWidth, height, WALL_THICKNESS ),
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
      console.error('make a middle')
      const middleHeight = (height - portal.height)
      const middleBox = new Physijs.BoxMesh(
        new THREE.BoxGeometry( portal.width, middleHeight, WALL_THICKNESS ),
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
      console.error('make a leftbox')
      const leftBox = new Physijs.BoxMesh(
        new THREE.BoxGeometry( portal.positionX, height, WALL_THICKNESS ),
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
    const { position } = this.props

    console.error(this.portals)

    //Floor
    this.floor = new Physijs.BoxMesh(
      new THREE.BoxGeometry( this.width, WALL_THICKNESS, this.length ),
      this.createMaterial( '/assets/textures/metal_ground_1.jpg', this.width / 4, this.length / 4, FLOOR_FRICTION ),
      0,
    );
    this.floor.position.set( position.x, position.y - WALL_THICKNESS / 2, position.z )

    //Ceiling
    const ceiling = new Physijs.BoxMesh(
      new THREE.BoxGeometry( this.width, WALL_THICKNESS, this.length ),
      this.createMaterial( '/assets/textures/roof1.jpg', this.width / 4, this.length / 4, WALL_FRICTION ),
      0,
    );
    ceiling.position.set( 0, this.height - WALL_THICKNESS / 2, 0 )
    //this.floor.add( ceiling )

    this.createWall( 'left' )
    this.createWall( 'right' )
    this.createWall( 'front' )
    this.createWall( 'rear' )

    /*//Left wall
    const leftWall = new Physijs.BoxMesh(
      new THREE.BoxGeometry( WALL_THICKNESS, this.height, this.length ),
      this.createMaterial( '/assets/textures/metal_floor_3.jpg', this.width / 4, this.height / 4, WALL_FRICTION ),
      0,
    );
    leftWall.position.set( -this.width / 2 - WALL_THICKNESS / 2, this.height / 2, 0 )
    floor.add( leftWall )

    //Right wall
    const rightWall = new Physijs.BoxMesh(
      new THREE.BoxGeometry( WALL_THICKNESS, this.height, this.length ),
      this.createMaterial( '/assets/textures/metal_floor_3.jpg', this.width / 4, this.height / 4, WALL_FRICTION ),
      0,
    );
    rightWall.position.set( this.width / 2 + WALL_THICKNESS / 2, this.height / 2, 0 )
    floor.add( rightWall )

    //Front wall
    const frontWall = new Physijs.BoxMesh(
      new THREE.BoxGeometry( this.width, this.height, WALL_THICKNESS ),
      this.createMaterial( '/assets/textures/metal_floor_3.jpg', this.width / 4, this.height / 4, WALL_FRICTION ),
      0,
    );
    frontWall.position.set( 0, this.height / 2, this.length / 2 + WALL_THICKNESS / 2 )
    floor.add( frontWall )

    //Rear wall
    const rearWall = new Physijs.BoxMesh(
      new THREE.BoxGeometry( this.width, this.height, WALL_THICKNESS ),
      this.createMaterial( '/assets/textures/metal_floor_3.jpg', this.width / 4, this.height / 4, WALL_FRICTION ),
      0,
    );
    rearWall.position.set( 0, this.height / 2, -this.length / 2 - WALL_THICKNESS / 2 )
    floor.add( rearWall )*/

    return this.floor
  }
}

export default RoomNode