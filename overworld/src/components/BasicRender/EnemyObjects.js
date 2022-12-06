import globalVars from './GlobalVars'
import baseHero from './BaseHero'

import wolfen_down from '../../assets/sprites/enemy_sprites/wolfen/wolfen_down.png'
import wolfen_up from '../../assets/sprites/enemy_sprites/wolfen/wolfen_up.png'
import wolfen_left from '../../assets/sprites/enemy_sprites/wolfen/wolfen_left.png'
import wolfen_right from '../../assets/sprites/enemy_sprites/wolfen/wolfen_right.png'
import wolfen_downleft from '../../assets/sprites/enemy_sprites/wolfen/wolfen_downleft.png'
import wolfen_downright from '../../assets/sprites/enemy_sprites/wolfen/wolfen_downright.png'
import wolfen_upleft from '../../assets/sprites/enemy_sprites/wolfen/wolfen_upleft.png'
import wolfen_upright from '../../assets/sprites/enemy_sprites/wolfen/wolfen_upright.png'

import blood_splatter_64 from '../../assets/sprites/enemy_sprites/blood_splatter_64.png'

import wolf_yelp_src from '../../assets/sounds/enemy/wolf_yelp.wav'

const wolf_yelp = new Audio(wolf_yelp_src)
wolf_yelp.volume = 0.2

class damageSprite {
  constructor({ data, image, position, crop}) {
    this.data = data
    this.image = image
    this.position = position
    this.crop = crop
  }

  cropChange(cropX, cropY) {
    this.crop = {
      x: cropX,
      y: cropY
    }
  }
}

const blood_splatter = new Image()
blood_splatter.src = blood_splatter_64

// const blood_splatter_obj = {
//   image: blood_splatter_64,
//   data: {
//     spriteAnimSpeed: 2,
//     spriteAnimCounter: 0,
//     maxFrames: 5,
//     active: false,
//     blockSize: 64
//   }
// }

const bloodSplatter = new damageSprite({
  data: {
  spriteAnimSpeed: 8,
  animCounter: 0,
  animFrames: 5,
  active: false,
  blockSize: 64,
  },
  image: blood_splatter,
  position: {
    x: 0,
    y: 0
  },
  crop: {
    x: 0,
    y: 0
  }
})


// used to create the collision box colBox
const colBuffer = 12 // number of pixels away from hero that detectors sit
const cornerBuffer = 4
const horzBuffer = 6
const vertBuffer = 4
const blockSize = globalVars.blockSize

export const wolfen = {
  x: globalVars.heroCenterX,
  y: globalVars.heroCenterY,
  cropX: 0,
  cropY: 0,
  xVel: 4,
  yVel: 4,
  direction: 'down',
  moving: true,
  dashing: false,
  currentSprite: wolfen_down,
  spriteSheets: {
    down: wolfen_down,
    up: wolfen_up,
    left: wolfen_left,
    right: wolfen_right,
    downleft: wolfen_downleft,
    downright: wolfen_downright,
    upleft: wolfen_upleft,
    upright: wolfen_upright
  },
  movementFrames: 5,
  baseAnimSpeed: 2,
  spriteAnimSpeed: 2,
  spriteAnimCounter: 0,
  baseMoveSpeed: 20,
  moveSpeed: 20,
  dashSpeed: 34,
  frameCountLimiter: 0,
  maxFrameCountLimiter: 100,
  blockSize: 64,
  colBox: {
    0: [horzBuffer, colBuffer + vertBuffer ],
    1: [horzBuffer + cornerBuffer, vertBuffer  + cornerBuffer],
    2: [colBuffer + horzBuffer, vertBuffer ],
    3: [blockSize - colBuffer - horzBuffer, vertBuffer ],
    4: [blockSize - horzBuffer - cornerBuffer, vertBuffer  + cornerBuffer],
    5: [blockSize - horzBuffer, colBuffer + vertBuffer ],
    6: [blockSize - horzBuffer, blockSize - colBuffer - vertBuffer + (globalVars.upscale * 2)],
    7: [blockSize - horzBuffer - cornerBuffer, blockSize - vertBuffer  + (globalVars.upscale * 2) - cornerBuffer],
    8: [blockSize - colBuffer - horzBuffer, blockSize - vertBuffer  + (globalVars.upscale * 2)],
    9: [colBuffer + horzBuffer, blockSize - vertBuffer  + (globalVars.upscale * 2)],
    10: [horzBuffer + cornerBuffer, blockSize - vertBuffer  + (globalVars.upscale * 2) - cornerBuffer],
    11: [horzBuffer, blockSize - colBuffer - vertBuffer  + (globalVars.upscale * 2)]
  },
  hitColBox: [
    [0, 0],
    [baseHero.attackBlockSize, 0],
    [baseHero.attackBlockSize, baseHero.attackBlockSize],
    [0, baseHero.attackBlockSize],
  ],
  maxVitality: 100,
  currentVitality: 100,
  takeDamage: false,
  dead: false,
  damageSound: wolf_yelp,
  damageAnim: bloodSplatter,
  damageActive: false
}
