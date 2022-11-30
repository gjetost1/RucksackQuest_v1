import { hero_spritesheets, sword_spritesheets } from "./spriteRef"

import globalVars from "./GlobalVars"

const baseHero = {
  x: 0,
  y: 0,
  bounceX: 0,
  bounceY: 0,
  topDashBoost: 1,
  dashBoost: 0,
  boostMaxVel: 3,
  baseMaxVel: 2,
  maxVel: 2,
  rateAccel: 1,
  rateDecel: .5,
  xVel: 0,
  yVel: 0,
  baseMoveSpeed: 30,
  moveSpeed: 30,
  frameCountLimiter: 0,
  maxFrameCountLimiter: 180,
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
  maxStam: 100,
  currentStam: 100,
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
