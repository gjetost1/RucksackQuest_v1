// used for rendering an arrow above the hero or something else.
// needs a sprite made from the arrow spritesheet and some other
// vars declared. not used currently, but saved here in case

const arrowImage = new Image()
arrowImage.src = arrow_spritesheets.indicator_arrow

const arrowSprite = new Sprite({
  image: arrowImage,
  position: {
    x: baseHero.x,
    y: baseHero.y - upscale * 3
  },
  crop: {
    x: 0,
    y: 0
  }
})

arrowSprite.position.x = playerSprite.position.x
arrowSprite.position.y = playerSprite.position.y - upscale * 2

let arrowCropX = 0
let arrowCropY = 0
let arrowSpeed = 0

arrowSpeed++
    if (arrowSpeed === 12) {
      if (arrowCropX >= blockSize * 12) {
        arrowCropX = 0
      }
      arrowCropX += blockSize
      arrowSprite.cropChange(arrowCropX, arrowCropY)
      arrowSpeed = 0
    }
    arrowSprite.draw()
