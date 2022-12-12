import globalVars from "./GlobalVars";

import down from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_down.png";
import up from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_up.png";
import left from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_left.png";
import right from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_right.png";
import downleft from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_downleft.png";
import downright from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_downright.png";
import upleft from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_upleft.png";
import upright from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_upright.png";

import sword_down from "../../assets/sprites/hero_sword/hero_sword_down.png";
import sword_up from "../../assets/sprites/hero_sword/hero_sword_up.png";
import sword_left from "../../assets/sprites/hero_sword/hero_sword_left.png";
import sword_right from "../../assets/sprites/hero_sword/hero_sword_right.png";
import sword_downleft from "../../assets/sprites/hero_sword/hero_sword_downleft.png";
import sword_downright from "../../assets/sprites/hero_sword/hero_sword_downright.png";
import sword_upleft from "../../assets/sprites/hero_sword/hero_sword_upleft.png";
import sword_upright from "../../assets/sprites/hero_sword/hero_sword_upright.png";
import sword_icon from "../../assets/sprites/hero_sword/sword_icon.png";

import blood_splatter_64 from "../../assets/sprites/enemy_sprites/blood_splatter_64.png";

import { bloodTank_1, bloodTank_2, bloodTank_3 } from "./HudObjects";

import blood_pour_src from "../../assets/sounds/hero/blood_pour.mp3";
import damage_grunt_src from "../../assets/sounds/hero/man_grunt.mp3";

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

const blood_pour = new Audio(blood_pour_src);
blood_pour.volume = 1;
blood_pour.loop = true;

const damage_grunt = new Audio(damage_grunt_src);
damage_grunt.volume = .4;

// used to create the collision box colBox for hero
const colBuffer = 12; // number of pixels away from hero that detectors sit
const cornerBuffer = 4;
const horzBuffer = 14;
const vertBuffer = 12;
const blockSize = globalVars.blockSize;

const baseHero = {
  type: 'hero',
  cameraX: globalVars.heroStartXCoord,
  cameraY: globalVars.heroStartYCoord,
  targetCameraX: globalVars.heroStartXCoord,
  targetCameraY: globalVars.heroStartYCoord,
  x: globalVars.heroCenterX,
  y: globalVars.heroCenterY,
  targetHeroX: globalVars.heroCenterX,
  targetHeroY: globalVars.heroCenterY,
  frameXChange: 0,
  frameYChange: 0,
  bonusFrameXChange: 0,
  bonusFrameYChange: 0,
  totalXChange: 0,
  totalYChange: 0,
  baseXVel: 4,
  baseYVel: 4,
  currentXVel: 4,
  currentYVel: 4,
  baseMoveSpeed: 20,
  moveSpeed: 20,
  dashSpeed: 34,
  frameCountLimiter: 0,
  maxFrameCountLimiter: 100,
  heroCropX: 0,
  heroCropY: 0,
  spriteSheets: {
    up,
    down,
    left,
    right,
    downleft,
    downright,
    upleft,
    upright,
  },
  currentHeroSprite: down,
  equipment: {
    weapon: {
      type: 'sword',
      baseDamage: 20, // attack always does this amount of damage
      damageRange: 14, // attack may also do between 0 and this much additional damage
      knockBack: globalVars.upscale * 4, // amount enemy is knocked back if hit by attack
      spriteSheets: {
        up: sword_up,
        down: sword_down,
        left: sword_left,
        right: sword_right,
        downleft: sword_downleft,
        downright: sword_downright,
        upleft: sword_upleft,
        upright: sword_upright,
        icon: sword_icon,
      },
    },
    bloodTanks: {
      inventory: [
        bloodTank_1,
        bloodTank_2,
        bloodTank_3,
      ],
      allTanksEmpty: false,
      currentTank: false,
      currentFillTank: false,
      changeCurrentFillTank: false,
      changeCurrentTank: false,
      tankDrainActive: false,
      bloodSound: blood_pour,
    },
  },
  currentEquipmentSprite: sword_down,
  direction: "down",
  attackAnimation: false,
  blockSize: globalVars.blockSize,
  attackBlockSize: globalVars.upscale,
  heroSpriteSize: 64,
  // coolDownLevel: 0,
  // coolDownLevelMax: 100,
  attackCooldownOff: true,
  attackActive: false,
  bloodDrainActive: false,
  bloodDrainRate: 0.5,
  scavengeActive: false,
  scavengeAnimActive: false,
  maxVitality: 300,
  currentVitality: 300,
  // attackDamage: 25,
  maxFatigue: 300,
  currentFatigue: 300,
  fatigueDrain: 1,
  fatigueAttack: 30,
  fatigueRecovery: 1,
  eventX: -400,
  eventY: -400,
  damageAnim: bloodSplatter,
  damageSound: damage_grunt,
  damageActive: false,
  takeDamage: false,
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
    x: {
      pressed: false,
    },
    q: {
      pressed: false,
    },
    mouse1: {
      pressed: false,
    },
  },
  colBox: {
    0: [horzBuffer, colBuffer + vertBuffer * 2],
    1: [horzBuffer + cornerBuffer, vertBuffer * 2 + cornerBuffer],
    2: [colBuffer + horzBuffer, vertBuffer * 2],
    3: [blockSize - colBuffer - horzBuffer, vertBuffer * 2],
    4: [blockSize - horzBuffer - cornerBuffer, vertBuffer * 2 + cornerBuffer],
    5: [blockSize - horzBuffer, colBuffer + vertBuffer * 2],
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
    [globalVars.upscale, 0],
    [globalVars.blockSize, globalVars.blockSize],
    [0, globalVars.blockSize],
  ],
};

export default baseHero;
