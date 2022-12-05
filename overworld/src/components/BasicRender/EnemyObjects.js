import globalVars from './GlobalVars'

import wolfen_down from '../../assets/sprites/enemy_sprites/wolfen/wolfen_down.png'
import wolfen_up from '../../assets/sprites/enemy_sprites/wolfen/wolfen_up.png'
import wolfen_left from '../../assets/sprites/enemy_sprites/wolfen/wolfen_left.png'
import wolfen_right from '../../assets/sprites/enemy_sprites/wolfen/wolfen_right.png'
import wolfen_downleft from '../../assets/sprites/enemy_sprites/wolfen/wolfen_downleft.png'
import wolfen_downright from '../../assets/sprites/enemy_sprites/wolfen/wolfen_downright.png'
import wolfen_upleft from '../../assets/sprites/enemy_sprites/wolfen/wolfen_upleft.png'
import wolfen_upright from '../../assets/sprites/enemy_sprites/wolfen/wolfen_upright.png'

// used to create the collision box colBox
const colBuffer = 12 // number of pixels away from hero that detectors sit
const cornerBuffer = 4
const horzBuffer = 14
const vertBuffer = 12
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
  blockSize: 64,
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
