import globalVars from "./GlobalVars";
import baseHero from "./BaseHero";

import wolfen_down from "../../assets/sprites/enemy_sprites/wolfen/wolfen_down.png";
import wolfen_up from "../../assets/sprites/enemy_sprites/wolfen/wolfen_up.png";
import wolfen_left from "../../assets/sprites/enemy_sprites/wolfen/wolfen_left.png";
import wolfen_right from "../../assets/sprites/enemy_sprites/wolfen/wolfen_right.png";
import wolfen_downleft from "../../assets/sprites/enemy_sprites/wolfen/wolfen_downleft.png";
import wolfen_downright from "../../assets/sprites/enemy_sprites/wolfen/wolfen_downright.png";
import wolfen_upleft from "../../assets/sprites/enemy_sprites/wolfen/wolfen_upleft.png";
import wolfen_upright from "../../assets/sprites/enemy_sprites/wolfen/wolfen_upright.png";

import blood_splatter_64 from "../../assets/sprites/enemy_sprites/blood_splatter_64.png";

import beast_bone from '../../assets/sprites/pickups/beast_bone.png'
import beast_gland from '../../assets/sprites/pickups/beast_gland.png'
import beast_guts from '../../assets/sprites/pickups/beast_guts.png'
import beast_heart from '../../assets/sprites/pickups/beast_heart.png'

import wolf_yelp_src from "../../assets/sounds/enemy/wolf_snarl.mp3";
import wolf_howl_src from "../../assets/sounds/enemy/wolf_howl_sad.mp3";

// const beast_bone = new Image();
// beast_bone.src = beast_bone_src;
// const beast_gland = new Image();
// beast_gland.src = beast_gland_src;
// const beast_guts = new Image();
// beast_guts.src = beast_guts_src;
// const beast_heart = new Image();
// beast_heart.src = beast_heart_src;

const wolf_yelp = new Audio(wolf_yelp_src);
wolf_yelp.volume = 0.5;
const wolf_howl = new Audio(wolf_howl_src);
wolf_howl.volume = 0.2;

// creates the sprite for enemy damage effects
class damageSprite {
  constructor({ data, image, position, crop }) {
    this.data = data;
    this.image = image;
    this.position = position;
    this.crop = crop;
  }

  cropChange(cropX, cropY) {
    this.crop = {
      x: cropX,
      y: cropY,
    };
  }
}

const blood_splatter = new Image();
blood_splatter.src = blood_splatter_64;

const bloodSplatter = new damageSprite({
  data: {
    spriteAnimSpeed: 8,
    baseAnimSpeed: 8,
    animCounter: 0,
    animFrames: 5,
    active: false,
    blockSize: 64,
  },
  image: blood_splatter,
  position: {
    x: 0,
    y: 0,
  },
  crop: {
    x: 0,
    y: 0,
  },
});

// used to create the collision box colBox
const colBuffer = 12; // number of pixels away from hero that detectors sit
const cornerBuffer = 4;
const horzBuffer = 6;
const vertBuffer = 4;
const blockSize = globalVars.blockSize;

export const wolfen = {
  type: 'enemy',
  x: globalVars.heroCenterX,
  y: globalVars.heroCenterY,
  cropX: 0,
  cropY: 0,
  xVel: 4,
  yVel: 4,
  eventX: -400,
  eventY: -400,
  direction: "down",
  attackActive: false,
  baseDamage: 30, // attack always does this amount of damage
  damageRange: 16, // attack may also do between 0 and this much additional damage
  knockBack: globalVars.upscale * 4, // amount enemy is knocked back if hit by attack
  attackBlockSize: globalVars.upscale,
  attackCooldownOff: true,
  moving: false,
  dashing: false,
  attacking: false,
  chasing: false,
  fleeing: false,
  aggroRadius: 340,
  fleeingRadius: 200,
  attackRadius: 180,
  currentSprite: wolfen_down,
  spriteSheets: {
    down: wolfen_down,
    up: wolfen_up,
    left: wolfen_left,
    right: wolfen_right,
    downleft: wolfen_downleft,
    downright: wolfen_downright,
    upleft: wolfen_upleft,
    upright: wolfen_upright,
  },
  movementFrames: 6,
  attackFrames: 4,
  dyingFrames: 3,
  bloodlessFrame: 15,
  scavengedFrame: 16,
  baseAnimSpeed: 2,
  spriteAnimSpeed: 2,
  spriteAnimCounter: 0,
  attackAnimCooldown: false,
  animFrames: 6,
  baseMoveSpeed: 20,
  moveSpeed: 20,
  dashSpeed: 34,
  attackDashSpeed: 64,
  baseDashSpeed: 34,
  frameCountLimiter: 0,
  maxFrameCountLimiter: 100,
  blockSize: 64,
  scavengeable: true,
  scavenged: false,
  scavengeTable: [
    {
      name: 'Nothing',
      image: null,
      dropPercent: 20,
      blockSize: 32,
    },
    {
      name: 'Beast Guts',
      image: beast_guts,
      dropPercent: 30,
      blockSize: 32,
    },
    {
      name: 'Beast Bone',
      image: beast_bone,
      dropPercent: 30,
      blockSize: 32,
    },
    {
      name: 'Beast Gland',
      image: beast_gland,
      dropPercent: 15,
      blockSize: 32,
    },
    {
      name: 'Wolf Heart',
      image: beast_heart,
      dropPercent: 5,
      blockSize: 32,
    },
],
  colBox: {
    0: [horzBuffer, colBuffer + vertBuffer],
    1: [horzBuffer + cornerBuffer, vertBuffer + cornerBuffer],
    2: [colBuffer + horzBuffer, vertBuffer],
    3: [blockSize - colBuffer - horzBuffer, vertBuffer],
    4: [blockSize - horzBuffer - cornerBuffer, vertBuffer + cornerBuffer],
    5: [blockSize - horzBuffer, colBuffer + vertBuffer],
    6: [
      blockSize - horzBuffer,
      blockSize - colBuffer - vertBuffer + globalVars.upscale * 2,
    ],
    7: [
      blockSize - horzBuffer - cornerBuffer,
      blockSize - vertBuffer + globalVars.upscale * 2 - cornerBuffer,
    ],
    8: [
      blockSize - colBuffer - horzBuffer,
      blockSize - vertBuffer + globalVars.upscale * 2,
    ],
    9: [
      colBuffer + horzBuffer,
      blockSize - vertBuffer + globalVars.upscale * 2,
    ],
    10: [
      horzBuffer + cornerBuffer,
      blockSize - vertBuffer + globalVars.upscale * 2 - cornerBuffer,
    ],
    11: [
      horzBuffer,
      blockSize - colBuffer - vertBuffer + globalVars.upscale * 2,
    ],
  },
  hitColBox: [
    [0, 0],
    [globalVars.blockSize, 0],
    [globalVars.blockSize, globalVars.blockSize],
    [0, globalVars.blockSize],
  ],
  moveDirections: [
    "down",
    "up",
    "left",
    "right",
    "upleft",
    "upright",
    "downleft",
    "downright",
  ],
  maxVitality: 100,
  currentVitality: 100,
  attackDamage: 25,
  maxFatigue: 300,
  currentFatigue: 300,
  fatigueDrain: 1,
  fatigueAttack: 10,
  fatigueRecovery: 1,
  takeDamage: false,
  dead: false,
  dying: false,
  damageSound: wolf_yelp,
  dyingSound: wolf_howl,
  damageAnim: bloodSplatter,
  damageActive: false,
  solid: true,
  maxBloodLevel: 100,
  currentBloodLevel: 100,
};
