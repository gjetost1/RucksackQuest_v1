import globalVars from "./GlobalVars"

import down from '../../assets/sprites/hero_sprite_sheets/base_mini_sprite_down.png'
import up from '../../assets/sprites/hero_sprite_sheets/base_mini_sprite_up.png'
import left from '../../assets/sprites/hero_sprite_sheets/base_mini_sprite_left.png'
import right from '../../assets/sprites/hero_sprite_sheets/base_mini_sprite_right.png'
import downleft from '../../assets/sprites/hero_sprite_sheets/base_mini_sprite_downleft.png'
import downright from '../../assets/sprites/hero_sprite_sheets/base_mini_sprite_downright.png'
import upleft from '../../assets/sprites/hero_sprite_sheets/base_mini_sprite_upleft.png'
import upright from '../../assets/sprites/hero_sprite_sheets/base_mini_sprite_upright.png'

import sword_down from '../../assets/sprites/hero_sword/hero_sword_down.png'
import sword_up from '../../assets/sprites/hero_sword/hero_sword_up.png'
import sword_left from '../../assets/sprites/hero_sword/hero_sword_left.png'
import sword_right from '../../assets/sprites/hero_sword/hero_sword_right.png'
import sword_downleft from '../../assets/sprites/hero_sword/hero_sword_downleft.png'
import sword_downright from '../../assets/sprites/hero_sword/hero_sword_downright.png'
import sword_upleft from '../../assets/sprites/hero_sword/hero_sword_upleft.png'
import sword_upright from '../../assets/sprites/hero_sword/hero_sword_upright.png'
import sword_icon from '../../assets/sprites/hero_sword/sword_icon.png'

// used to create the collision box colBox for hero
const colBuffer = 12 // number of pixels away from hero that detectors sit
const cornerBuffer = 4
const horzBuffer = 14
const vertBuffer = 12
const blockSize = globalVars.blockSize

const baseHero = {
  cameraX: globalVars.heroStartXCoord,
  cameraY: globalVars.heroStartYCoord,
  targetCameraX: globalVars.heroStartXCoord,
  targetCameraY: globalVars.heroStartYCoord,
  heroX: globalVars.heroCenterX,
  heroY: globalVars.heroCenterY,
  targetHeroX: globalVars.heroCenterX,
  targetHeroY: globalVars.heroCenterY,
  frameXChange:0,
  frameYChange:0,
  totalXChange:0,
  totalYChange:0,
  baseXVel: 4,
  baseYVel: 2,
  currentXVel: 4,
  currentYVel: 4,
  baseMoveSpeed: 20,
  moveSpeed: 20,
  dashSpeed: 34,
  frameCountLimiter: 0,
  maxFrameCountLimiter: 100,
  heroCropX: 0,
  heroCropY: 0,
  spriteSheets:{
    up,
    down,
    left,
    right,
    downleft,
    downright,
    upleft,
    upright
  },
  currentHeroSprite: down,
  equipment: {
    spriteSheets: {
      up: sword_up,
      down: sword_down,
      left: sword_left,
      right: sword_right,
      downleft: sword_downleft,
      downright: sword_downright,
      upleft: sword_upleft,
      upright: sword_upright,
      icon: sword_icon
    }
  },
  currentEquipmentSprite: sword_down,
  heroDirection: 'down',
  attackAnimation: false,
  blockSize: globalVars.blockSize,
  attackBlockSize: 4,
  heroSpriteSize: 64,
  coolDownLevel: 0,
  coolDownLevelMax: 100,
  attackCooldownOff: true,
  attackActive: false,
  maxStam: 10000,
  currentStam: 10000,
  eventX: -400,
  eventY: -400,
  keys: {
    ArrowUp: {
      pressed:false
    },
    ArrowDown: {
      pressed:false
    },
    ArrowLeft: {
      pressed:false
    },
    ArrowRight: {
      pressed:false
    },
    Space: {
      pressed:false
    },
    Shift: {
      pressed:false
    },
    e: {
      pressed:false
    },
    mouse1: {
      pressed:false
    }
  },
  colBox: {
    0: [horzBuffer, colBuffer + vertBuffer * 2],
    1: [horzBuffer + cornerBuffer, vertBuffer * 2 + cornerBuffer],
    2: [colBuffer + horzBuffer, vertBuffer * 2],
    3: [blockSize - colBuffer - horzBuffer, vertBuffer * 2],
    4: [blockSize - horzBuffer - cornerBuffer, vertBuffer * 2 + cornerBuffer],
    5: [blockSize - horzBuffer, colBuffer + vertBuffer * 2],
    6: [blockSize - horzBuffer, blockSize - colBuffer - vertBuffer + (globalVars.upscale * 2)],
    7: [blockSize - horzBuffer - cornerBuffer, blockSize - vertBuffer  + (globalVars.upscale * 2) - cornerBuffer],
    8: [blockSize - colBuffer - horzBuffer, blockSize - vertBuffer  + (globalVars.upscale * 2)],
    9: [colBuffer + horzBuffer, blockSize - vertBuffer  + (globalVars.upscale * 2)],
    10: [horzBuffer + cornerBuffer, blockSize - vertBuffer  + (globalVars.upscale * 2) - cornerBuffer],
    11: [horzBuffer, blockSize - colBuffer - vertBuffer  + (globalVars.upscale * 2)]
  }
}

export default baseHero
