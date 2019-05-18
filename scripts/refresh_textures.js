const sharp = require('sharp')
const fs = require('fs')

const isImageFile = ( fileName ) => {
  return ['.png', '.jpg', '.jpeg'].some( extension => fileName.endsWith( extension ))
}

const textureUrlFile = 'src/shared/allTextureUrls.json'
const texturesPath = 'public/assets/textures'
const targetSize = 128
const textureUrls = []

const files = fs.readdirSync( texturesPath )
files.forEach(fileName => {
  if (!isImageFile( fileName )) {
    return
  }

  const filePath = `${texturesPath}/${fileName}`
  console.error(filePath)
  
  textureUrls.push(filePath.replace('public/assets/textures', '/assets/textures'))
  const image = sharp( filePath );

  image
    .metadata()
    .then(({ width, height }) => {
      if ( width > targetSize && height > targetSize) {
        const isLandscape = width >= height
        return image
          .resize(isLandscape ? undefined : targetSize, !isLandscape ? undefined : targetSize)
          .toBuffer(function(err, buffer) {
            fs.writeFile(filePath, buffer, () => {})
          })
      }
    })
    .catch(err => console.error(`error with image ${ filePath }: ${ err }`))
})

fs.writeFile(textureUrlFile, JSON.stringify(textureUrls, null, 2), () => {})