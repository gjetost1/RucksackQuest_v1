import globalVars from "./GlobalVars";

import down from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_down.png";
import up from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_up.png";
import left from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_left.png";
import right from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_right.png";
import downleft from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_downleft.png";
import downright from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_downright.png";
import upleft from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_upleft.png";
import upright from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_upright.png";
import scavenge from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_scavenge.png";
import blood_drain from "../../assets/sprites/hero_sprite_sheets/base_mini_sprite_blood_drain.png";

import sword_down from "../../assets/sprites/hero_sword/hero_sword_down.png";
import sword_up from "../../assets/sprites/hero_sword/hero_sword_up.png";
import sword_left from "../../assets/sprites/hero_sword/hero_sword_left.png";
import sword_right from "../../assets/sprites/hero_sword/hero_sword_right.png";
import sword_downleft from "../../assets/sprites/hero_sword/hero_sword_downleft.png";
import sword_downright from "../../assets/sprites/hero_sword/hero_sword_downright.png";
import sword_upleft from "../../assets/sprites/hero_sword/hero_sword_upleft.png";
import sword_upright from "../../assets/sprites/hero_sword/hero_sword_upright.png";
import sword_icon from "../../assets/sprites/hero_sword/sword_icon.png";

import hero_shadow_src from "../../assets/sprites/hero_sprite_sheets/hero_shadow.png";
import blood_splatter_64 from "../../assets/sprites/enemy_sprites/blood_splatter_64.png";

import { bloodTank_1, bloodTank_2, bloodTank_3 } from "./HudObjects";

import sword_swing_fx from "../../assets/sounds/sword/damage_sound.wav";
import sword_hit_fx from "../../assets/sounds/sword/flesh_hit.mp3";
import blood_pour_src from "../../assets/sounds/hero/blood_pour.mp3";
import damage_grunt_src from "../../assets/sounds/hero/man_grunt.mp3";
import scavenge_splat_src from "../../assets/sounds/hero/scavenge_splat.mp3";

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

const hero_shadow = new Image();
hero_shadow.src = hero_shadow_src;

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

const swordSwingFx = new Audio(sword_swing_fx);
swordSwingFx.volume = 0.05;

const swordHitFx = new Audio(sword_hit_fx);
swordHitFx.volume = 0.3;

const blood_pour = new Audio(blood_pour_src);
blood_pour.volume = 1;
blood_pour.loop = true;

const damage_grunt = new Audio(damage_grunt_src);
damage_grunt.volume = 0.4;

const scavenge_splat = new Audio(scavenge_splat_src);
scavenge_splat.volume = 0.3;

// used to create the collision box colBox for hero
const colBuffer = 12; // number of pixels away from hero that detectors sit
const cornerBuffer = 4;
const horzBuffer = 14;
const vertBuffer = 12;
const blockSize = globalVars.blockSize;

export const baseHeroTemplate = {
  type: "hero",
  cameraX: globalVars.heroStartXCoord,
  cameraY: globalVars.heroStartYCoord,
  targetCameraX: globalVars.heroStartXCoord,
  targetCameraY: globalVars.heroStartYCoord,
  x: globalVars.heroCenterX,
  y: globalVars.heroCenterY,
  middleX: globalVars.heroCenterX + blockSize / 2,
  middleY: globalVars.heroCenterY + blockSize / 2,
  targetHeroX: globalVars.heroCenterX,
  targetHeroY: globalVars.heroCenterY,
  shadowX: 0,
  shadowY: 0,
  shadowYChange: 0,
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
  baseMoveSpeed: 200,
  moveSpeed: 200,
  dashSpeed: 340,
  frameCountLimiter: 0,
  maxFrameCountLimiter: 1000,
  spriteAnimCounter: 0,
  spriteAnimSpeed: 2,
  baseAnimSpeed: 2,
  moveFrames: 7,
  attackFrames: 3,
  scavengeFrames: 9,
  jumpFrame: 11,
  animFrames: 7,
  cropX: 0,
  cropY: 0,
  spriteSheets: {
    up,
    down,
    left,
    right,
    downleft,
    downright,
    upleft,
    upright,
    scavenge,
    blood_drain,
    hero_shadow
  },
  currentHeroSprite: down,
  equipment: {
    weapon: {
      type: "sword",
      attackSound: swordSwingFx,
      hitSound: swordHitFx,
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
      inventory: [bloodTank_1, bloodTank_2, bloodTank_3],
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
  jumpActive: false,
  currentJumpFrames: 10,
  baseJumpFrames: 10,
  jumpCounter: 0,
  bloodDrainActive: false,
  bloodDrainPause: false,
  bloodDrainRate: 0.5,
  bloodDrainAnimation: false,
  bloodDrainFrames: 4,
  scavengeActive: false,
  scavengePause: false,
  scavengeAnimation: false,
  scavengeFx: scavenge_splat,
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
    mouse2: {
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

class Sprite {
  constructor({ image, position, crop, blockSize, data }) {
    this.position = position;
    this.image = image;
    this.crop = crop;
    this.blocksize = blockSize;
  }

  cropChange(cropX, cropY) {
    this.crop = {
      x: cropX,
      y: cropY,
    };
  }

  // draw() {
  //   spriteCtx.drawImage(
  //     this.image,
  //     this.crop.x,
  //     this.crop.y,
  //     this.blocksize,
  //     this.blocksize,
  //     this.position.x,
  //     this.position.y,
  //     this.blocksize,
  //     this.blocksize
  //   );
  // }
}

// we create the sprite, background, and foreground instances we will be rendering
const playerImage = new Image();
playerImage.src = baseHeroTemplate.currentHeroSprite;

export const baseHeroSprite = new Sprite({
  image: playerImage,
  position: {
    x: globalVars.heroCenterX,
    y: globalVars.heroCenterY,
  },
  crop: {
    x: baseHeroTemplate.cropX,
    y: baseHeroTemplate.cropY,
  },
  blockSize: baseHeroTemplate.blockSize,
});

const equipImage = new Image();
equipImage.src = baseHeroTemplate.currentEquipmentSprite;

export const swordSprite = new Sprite({
  image: equipImage,
  position: {
    x: globalVars.heroCenterX,
    y: globalVars.heroCenterY,
  },
  crop: {
    x: baseHeroTemplate.cropX,
    y: baseHeroTemplate.cropY,
  },
  blockSize: baseHeroTemplate.blockSize,
});

// export default baseHero;
