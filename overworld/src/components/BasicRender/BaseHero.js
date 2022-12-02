import { hero_spritesheets, sword_spritesheets } from "./spriteRef"

import globalVars from "./GlobalVars"

const baseHero = {
  cameraX: globalVars.heroStartXCoord,
  cameraY: globalVars.heroStartYCoord,
  targetCameraX: globalVars.heroStartXCoord,
  targetCameraY: globalVars.heroStartYCoord,
  heroX: globalVars.heroCenterX,
  heroY: globalVars.heroCenterY,
  targetHeroX: globalVars.heroCenterX,
  targetHeroY: globalVars.heroCenterY,
  baseXVel: 4,
  baseYVel: 2,
  currentXVel: 4,
  currentYVel: 2,
  baseMoveSpeed: 20,
  moveSpeed: 20,
  dashSpeed: 34,
  frameCountLimiter: 0,
  maxFrameCountLimiter: 100,
  heroCropX: 0,
  heroCropY: 0,
  heroSprite: hero_spritesheets.down,
  swordSpriteSheet: sword_spritesheets.down,
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
}

export default baseHero
