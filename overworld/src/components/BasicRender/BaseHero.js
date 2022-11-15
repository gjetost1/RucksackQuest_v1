import { hero_spritesheets, sword_spritesheets } from "./spriteRef"

const upscale = 4

const baseHero = {
  x: 620,
  y: 380,
  blockSize: 16 * upscale,
  upscale: upscale,
  heroSpriteSize: 64,
  heroCropX: 0,
  heroCropY: 0,
  topDashBoost: 1,
  dashBoost: 0,
  boostMaxVel: 3,
  baseMaxVel: 2,
  maxVel: 2,
  rateAccel: 1,
  rateDecel: 1,
  heroSprite: hero_spritesheets.down,
  swordSpriteSheet: sword_spritesheets.down,
  heroDirection: 'down',
  attackAnimation: false,
  coolDownLevel: 0,
  coolDownLevelMax: 100,
  attackCooldownOff: true,
  attackActive: false,
  maxStam: 100,
  currentStam: 100,
  xVel: 0,
  yVel: 0,
  baseMoveSpeed: 30,
  moveSpeed: 30,
  frameCountLimiter: 0,
  maxFrameCountLimiter: 180,
  eventX: null,
  eventY: null,
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
