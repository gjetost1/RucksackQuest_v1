import globalVars from './GlobalVars'
import heart_1 from '../../assets/hud/heart_1.png'
import blood_container_small_off from '../../assets/hud/blood_container_small_off.png'
import blood_container_small_on from '../../assets/hud/blood_container_small_on.png'
import blood from '../../assets/hud/blood.png'
import blood_container_large_off from '../../assets/hud/blood_container_large_off.png'
import blood_container_large_on from '../../assets/hud/blood_container_large_on.png'
import blood_large from '../../assets/hud/blood_large.png'

class HudSprite {
  constructor({ image, offImage, onImage, contentsImage, position, crop, blockSize, animFramesBase, totalAnimFrames, animFramesMin, data}) {
    this.image = image
    this.offImage = offImage
    this.onImage = onImage
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

const blood_container_small_off_img = new Image()
blood_container_small_off_img.src = blood_container_small_off

const blood_container_small_on_img = new Image()
blood_container_small_on_img.src = blood_container_small_on

const blood_img = new Image()
blood_img.src = blood

export const bloodTank_1 = new HudSprite({
  offImage: blood_container_small_off_img,
  onImage: blood_container_small_on_img,
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
    currentVolume: 0,
    maxVolume: 300,
    type: 'vitality',
    active: false,
    depleted: false,
    growthFactor: 4.5
  }
})

const blood_container_large_off_img = new Image()
blood_container_large_off_img.src = blood_container_large_off

const blood_container_large_on_img = new Image()
blood_container_large_on_img.src = blood_container_large_on

const blood_large_img = new Image()
blood_large_img.src = blood_large

export const bloodTank_2 = new HudSprite({
  offImage: blood_container_large_off_img,
  onImage: blood_container_large_on_img,
  contentsImage: blood_large_img,
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
    maxVolume: 600,
    type: 'vitality',
    active: false,
    depleted: false,
    growthFactor: 4
  }
})

export const bloodTank_3 = new HudSprite({
  offImage: blood_container_small_off_img,
  onImage: blood_container_small_on_img,
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
    currentVolume: 200,
    maxVolume: 300,
    type: 'vitality',
    active: false,
    depleted: false,
    growthFactor: 4.5
  }
})
