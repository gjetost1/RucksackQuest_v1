import { hero_spritesheets, sword_spritesheets } from "./spriteRef";

import globalVars from "./GlobalVars";

const baseHero = {
  cameraX: 1000,
  cameraY: 1000,
  targetCameraX: 1000,
  targetCameraY: 1000,
  x: globalVars.heroCenterX,
  y: globalVars.heroCenterY,
  targetHeroX: globalVars.heroCenterX,
  targetHeroY: globalVars.heroCenterY,
  topDashBoost: 1,
  dashBoost: 0,
  boostMaxVel: 6,
  baseMaxVel: 4,
  maxVel: 4,
  rateAccel: 1,
  rateDecel: 1,
  xVel: 0,
  yVel: 0,
  baseMoveSpeed: 20,
  moveSpeed: 20,
  frameCountLimiter: 0,
  maxFrameCountLimiter: 100,
  heroCropX: 0,
  heroCropY: 0,
  heroSprite: hero_spritesheets.down,
  swordSpriteSheet: sword_spritesheets.down,
  direction: "down",
  attackAnimation: false,
  blockSize: globalVars.blockSize,
  attackBlockSize: 4,
  heroSpriteSize: 64,
  coolDownLevel: 0,
  coolDownLevelMax: 100,
  attackCooldownOff: true,
  attackActive: false,
  maxVitality: 100,
  currentVitality: 100,
  eventX: -400,
  eventY: -400,
  keys: {
    ArrowUp: {
      pressed: false,
    },
    ArrowDown: {
      pressed: false,
    },
    ArrowLeft: {
      pressed: false,
    },
    ArrowRight: {
      pressed: false,
    },
    Space: {
      pressed: false,
    },
    Shift: {
      pressed: false,
    },
    e: {
      pressed: false,
    },
    mouse1: {
      pressed: false,
    },
  },
};

export default baseHero;
