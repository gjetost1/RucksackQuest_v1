import heart_1 from '../../assets/hud/heart_1.png'
import blood_container_1 from '../../assets/hud/blood_container_1.png'

class HudSprite {
  constructor({ image, position, crop, blockSize, animFramesBase, totalAnimFrames, animFramesMin}) {
    this.position = position
    this.image = image
    this.crop = crop
    this.blockSize = blockSize
    this.animFramesBase = animFramesBase
    this.animFrames = animFramesBase
    this.animCounter = 0
    this.totalAnimFrames = totalAnimFrames
    this.animFramesMin = animFramesMin
  }

  cropChange(cropX, cropY) {
    this.crop = {
      x: cropX,
      y: cropY
    }
  }
}

const heart_img = new Image()
heart_img.src = heart_1

export const hudHeart = new HudSprite({
  image: heart_img,
  position: {
    x: 0,
    y: 0
  },
  crop: {
    x: 0,
    y: 0
  },
  blockSize: 128,
  animFramesBase: 30,
  animFramesMin: 8,
  totalAnimFrames: 6
})

const blood_container_img = new Image()
blood_container_img.src = blood_container_1

export const bloodContainer_1 = new HudSprite({
  image: blood_container_img,
  position: {
    x: 34,
    y: 128
  },
  crop: {
    x: 0,
    y: 0
  },
  blockSize: 64,
  animFramesBase: 18,
  animFramesMin: 8,
  totalAnimFrames: 8
})
