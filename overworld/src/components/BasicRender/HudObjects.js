import globalVars from './GlobalVars'
import heart_1 from '../../assets/hud/heart_1.png'
import blood_container from '../../assets/hud/blood_container.png'
import blood from '../../assets/hud/blood.png'
import blood_container_large from '../../assets/hud/blood_container_large.png'
import blood_large from '../../assets/hud/blood_large.png'

class HudSprite {
  constructor({ image, contentsImage, position, crop, blockSize, animFramesBase, totalAnimFrames, animFramesMin, data}) {
    this.image = image
    this.contentsImage = contentsImage
    this.position = position
    this.crop = crop
    this.blockSize = blockSize
    this.animFramesBase = animFramesBase
    this.animFrames = animFramesBase
    this.animCounter = 0
    this.totalAnimFrames = totalAnimFrames
    this.animFramesMin = animFramesMin
    this.data = data
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
    y: globalVars.perfectHeight - 136
  },
  crop: {
    x: 0,
    y: 0
  },
  blockSize: 128,
  animFramesBase: 26,
  animFramesMin: 8,
  totalAnimFrames: 6
})

const blood_container_img = new Image()
blood_container_img.src = blood_container

const blood_img = new Image()
blood_img.src = blood

export const bloodContainer_1 = new HudSprite({
  image: blood_container_img,
  contentsImage: blood_img,
  position: {
    x: 36,
    y: globalVars.perfectHeight - 200
  },
  crop: {
    x: 0,
    y: 0
  },
  blockSize: 64,
  animFramesBase: 18,
  animFramesMin: 8,
  totalAnimFrames: 8,
  data: {
    currentVolume: 100,
    maxVolume: 100,
    type: 'vitality'
  }
})

const blood_container_large_img = new Image()
blood_container_large_img.src = blood_container_large

const blood_large_img = new Image()
blood_large_img.src = blood_large

export const bloodContainer_2 = new HudSprite({
  image: blood_container_large_img,
  contentsImage: blood_large_img,
  position: {
    x: 36,
    y: globalVars.perfectHeight - 264
  },
  crop: {
    x: 0,
    y: 0
  },
  blockSize: 64,
  animFramesBase: 18,
  animFramesMin: 8,
  totalAnimFrames: 8,
  data: {
    currentVolume: 200,
    maxVolume: 200,
    type: 'vitality'
  }
})
