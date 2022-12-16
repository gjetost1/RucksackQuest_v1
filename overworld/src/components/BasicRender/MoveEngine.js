import pixelPerfect from "./PixelPerfect";
// import baseHero from './BaseHero'
import globalVars from "./GlobalVars";
import checkCollision from "./CheckCollision";

// const baseAnimSpeed = 2;
// let spriteAnimSpeed = baseAnimSpeed; // after how many frames the sprite frame will progress for walking animation
// let spriteAnimCounter = 0; // increments to trigger render of next animation frame

const colBuffer = 12; // number of pixels away from hero that detectors sit
const cornerBuffer = 4;
const horzBuffer = 14;
const vertBuffer = 12;
const blockSize = globalVars.blockSize;

const moveEngine = (baseHero, collisionCtx, dataVisCtx) => {

  if (!baseHero) return;

  const lastTargetCameraX = baseHero.targetCameraX;
  const lastTargetCameraY = baseHero.targetCameraY;

  // bonusFrameXChange/yChange currently come from damage knockback in the attackEngine if
  // hero is hit and knocked back
  baseHero.frameXChange = baseHero.bonusFrameXChange;
  baseHero.frameYChange = baseHero.bonusFrameYChange;

  baseHero.bonusFrameXChange = 0
  baseHero.bonusFrameYChange = 0

  // keysPressed is true if any directional input was given this frame, otherwise false.
  const keysPressed =
    baseHero.keys.ArrowUp.pressed ||
    baseHero.keys.ArrowDown.pressed ||
    baseHero.keys.ArrowLeft.pressed ||
    baseHero.keys.ArrowRight.pressed;
  const bounce = 0; // this var multiplies force of rebound on collision, should probably put this in moveObj eventually
  const diagScale = 1; // this var multiplies/reduces the speed of diagonal movement since it is different than horz and vert movement

  // imgData checks the collision canvas around the hero in a 64 x 64 pixel grid. getImageData.data contains an array with all color and alpha values
  // we can use this to see if the collision canvas is transparent or not, and also check for specific colors
  // this is fed to the collision detector function with an object of the pixel coordinates we want to check.
  // heroColBox above is an example of the format for this, but pretty much it is sub-arrays with [x, y] coordinates

  // const imgData = collisionCtx.getImageData(
  //   baseHero.targetHeroX,
  //   baseHero.targetHeroY,
  //   baseHero.targetHeroX + globalVars.blockSize,
  //   baseHero.targetHeroY + globalVars.blockSize
  // );



  // console.log(baseHero.targetHeroX, baseHero.targetHeroY)

  // get boolean values for each detector of hero hitbox (heroColBox)
  // true if it is in collision state
  // false if it is not in collision state
  // there are 12 detectors for better precision - 4 or 8 didn't capture some collision states properly
  // corners are arranged more or less like this:
  //
  //   1_2____3_4
  //  0|        |5
  //   |        |
  // 11|        |6
  //  10-9----8-7
  //
  // the hit box is actually more like a circle than a square generally, but can be adjusted
  // by the colBuffer, cornerBuffer, horzeBuffer, and vertBuffer variables
  // in each respective hero object or enemy object file.



  // let heroCollisions = checkCollision(
  //   imgData,
  //   baseHero.colBox,
  //   collisionCtx,
  //   dataVisCtx
  // );
  let heroCollisions = checkCollision(
    baseHero.colBox,
    baseHero.x,
    baseHero.y,
    collisionCtx,
    dataVisCtx
  );
  const col0 = heroCollisions[0];
  const col1 = heroCollisions[1];
  const col2 = heroCollisions[2];
  const col3 = heroCollisions[3];
  const col4 = heroCollisions[4];
  const col5 = heroCollisions[5];
  const col6 = heroCollisions[6];
  const col7 = heroCollisions[7];
  const col8 = heroCollisions[8];
  const col9 = heroCollisions[9];
  const col10 = heroCollisions[10];
  const col11 = heroCollisions[11];
  let allCol =
    col0 &&
    col1 &&
    col2 &&
    col3 &&
    col4 &&
    col5 &&
    col6 &&
    col7 &&
    col8 &&
    col9 &&
    col10 &&
    col11;

  let xVel = 0;
  let yVel = 0;

  // jumps if space is pressed
  if (baseHero.jumpActive) {
    baseHero.moveSpeed = baseHero.dashSpeed * 2
    if (baseHero.jumpCounter <= baseHero.currentJumpFrames / 2) {
      baseHero.targetCameraY -= baseHero.currentYVel;
      baseHero.frameYChange += baseHero.currentYVel;
    } else if (baseHero.jumpCounter >= baseHero.currentJumpFrames) {
      baseHero.jumpActive = false
      baseHero.jumpCounter = 0
      baseHero.moveSpeed = baseHero.baseMoveSpeed
    } else if (baseHero.jumpCounter > baseHero.currentJumpFrames / 2) {
      baseHero.targetCameraY += baseHero.currentYVel;
      baseHero.frameYChange -= baseHero.currentYVel;
    }
    baseHero.jumpCounter++
    // console.log(baseHero.moveSpeed, baseHero.baseMoveSpeed)
  }

  // if shift/dash is active increase the max velocity and add a boost to acceleration
  if (baseHero.keys.Shift.pressed && baseHero.currentFatigue > 0) {
    baseHero.moveSpeed = baseHero.dashSpeed;
    // drains stamina if dash is active and there is directional input
    if (baseHero.currentFatigue > 0 && keysPressed) {
      baseHero.currentFatigue = baseHero.currentFatigue - baseHero.fatigueDrain;
    }
  } else {
    baseHero.moveSpeed = baseHero.baseMoveSpeed;
    // regenerates stamina
    if (baseHero.currentFatigue < baseHero.maxFatigue) {
      baseHero.currentFatigue =
        baseHero.currentFatigue + baseHero.fatigueRecovery;
    } else if (baseHero.currentFatigue >= baseHero.maxFatigue) {
      baseHero.currentFatigue = baseHero.maxFatigue;
    }
  }

  // recovers hero vitality if bloodTank is active
  if (
    baseHero.currentVitality < baseHero.maxVitality &&
    baseHero.equipment.bloodTanks.tankDrainActive &&
    baseHero.equipment.bloodTanks.currentTank.data.currentVolume > 0
  ) {
    baseHero.currentVitality +=
      baseHero.equipment.bloodTanks.currentTank.data.recoveryRate;
  } else if (baseHero.currentVitality >= baseHero.maxVitality) {
    baseHero.currentVitality = baseHero.maxVitality;
  }

  // big if/else chain moves hero based on input
  if (baseHero.keys.ArrowUp.pressed) {
    // handles up input movement and collision
    yVel = -1; // sets velocity which determines the direction hero sprite that is displayed

    if ((col1 && col4) || (col2 && col3)) {
      // if all forward corners collide, do nothing to prevent juddering
    } else if (col1 && col2) {
      // if top left corner collides but not top right corner, move hero right
      baseHero.targetCameraX += baseHero.currentXVel;
      baseHero.frameXChange -= baseHero.currentXVel;
      // console.log(1,2)
    } else if (col3 && col4) {
      baseHero.targetCameraX -= baseHero.currentXVel;
      baseHero.frameXChange += baseHero.currentXVel;
      // console.log(3,4)
    } else if (col2 && col3) {
      // console.log(2,3)
    } else {
      // if no top corners collide, move up
      baseHero.targetCameraY -= baseHero.currentYVel;
      baseHero.frameYChange += baseHero.currentYVel;
    }
  }
  if (baseHero.keys.ArrowDown.pressed) {
    yVel = 1;
    if ((col7 && col10) || (col8 && col9)) {
    } else if (col7 && col8) {
      baseHero.targetCameraX -= baseHero.currentXVel;
      baseHero.frameXChange += baseHero.currentXVel;
      // console.log(7,8)
    } else if (col9 && col10) {
      baseHero.targetCameraX += baseHero.currentXVel;
      baseHero.frameXChange -= baseHero.currentXVel;
      // console.log(9,10)
    } else if (col8 && col9) {
      // console.log(8,9)
    } else {
      baseHero.targetCameraY += baseHero.currentYVel;
      baseHero.frameYChange -= baseHero.currentYVel;
    }
  }
  if (baseHero.keys.ArrowLeft.pressed) {
    xVel = -1;
    if ((col1 && col10) || (col0 && col11)) {
    } else if (col0 && col1) {
      baseHero.targetCameraY += baseHero.currentYVel;
      baseHero.frameYChange -= baseHero.currentYVel;
      // console.log(0,1)
    } else if (col11 && col10) {
      baseHero.targetCameraY -= baseHero.currentYVel;
      baseHero.frameYChange += baseHero.currentYVel;
      // console.log(11,10)
    } else if (col0 && col11) {
      // console.log(0,11)
    } else {
      baseHero.targetCameraX -= baseHero.currentXVel;
      baseHero.frameXChange += baseHero.currentXVel;
    }
  }
  if (baseHero.keys.ArrowRight.pressed) {
    xVel = 1;
    if ((col4 && col7) || (col5 && col6)) {
    } else if (col4 && col5) {
      baseHero.targetCameraY += baseHero.currentYVel;
      baseHero.frameYChange -= baseHero.currentYVel;
      // console.log(4,5)
    } else if (col6 && col7) {
      baseHero.targetCameraY -= baseHero.currentYVel;
      baseHero.frameYChange += baseHero.currentYVel;
      // console.log(6,7)
    } else if (col5 && col6) {
      // console.log(5,6)
    } else {
      baseHero.targetCameraX += baseHero.currentXVel;
      baseHero.frameXChange -= baseHero.currentXVel;
    }
  }

  if (baseHero.keys.ArrowUp.pressed && baseHero.keys.ArrowLeft.pressed) {

    if (col0 && col1 && col2) {
      baseHero.targetCameraX = lastTargetCameraX;
      baseHero.targetCameraY = lastTargetCameraY;
      baseHero.frameXChange = 0;
      baseHero.frameYChange = 0;

    }
  } else if (
    baseHero.keys.ArrowUp.pressed &&
    baseHero.keys.ArrowRight.pressed
  ) {

    if (col3 && col4 && col5) {
      baseHero.targetCameraX = lastTargetCameraX;
      baseHero.targetCameraY = lastTargetCameraY;
      baseHero.frameXChange = 0;
      baseHero.frameYChange = 0;

    }
  } else if (
    baseHero.keys.ArrowDown.pressed &&
    baseHero.keys.ArrowLeft.pressed
  ) {

    if (col9 && col10 && col11) {
      baseHero.targetCameraX = lastTargetCameraX;
      baseHero.targetCameraY = lastTargetCameraY;
      baseHero.frameXChange = 0;
      baseHero.frameYChange = 0;

    }
  } else if (
    baseHero.keys.ArrowDown.pressed &&
    baseHero.keys.ArrowRight.pressed
  ) {

    if (col6 && col7 && col8) {
      baseHero.targetCameraX = lastTargetCameraX;
      baseHero.targetCameraY = lastTargetCameraY;
      baseHero.frameXChange = 0;
      baseHero.frameYChange = 0;

    }
  }


  //sets appropriate sprite for direction of movement
  if (xVel < 0 && yVel < 0) {
    baseHero.currentHeroSprite = baseHero.spriteSheets.upleft;
    baseHero.currentEquipmentSprite =
      baseHero.equipment.weapon.spriteSheets.upleft;
    baseHero.direction = "upleft";
  }
  if (xVel > 0 && yVel < 0) {
    baseHero.currentHeroSprite = baseHero.spriteSheets.upright;
    baseHero.currentEquipmentSprite =
      baseHero.equipment.weapon.spriteSheets.upright;
    baseHero.direction = "upright";
  }
  if (xVel < 0 && yVel > 0) {
    baseHero.currentHeroSprite = baseHero.spriteSheets.downleft;
    baseHero.currentEquipmentSprite =
      baseHero.equipment.weapon.spriteSheets.downleft;
    baseHero.direction = "downleft";
  }
  if (xVel > 0 && yVel > 0) {
    baseHero.currentHeroSprite = baseHero.spriteSheets.downright;
    baseHero.currentEquipmentSprite =
      baseHero.equipment.weapon.spriteSheets.downright;
    baseHero.direction = "downright";
  }
  if (xVel === 0 && yVel < 0) {
    baseHero.currentHeroSprite = baseHero.spriteSheets.up;
    baseHero.currentEquipmentSprite = baseHero.equipment.weapon.spriteSheets.up;
    baseHero.direction = "up";
  }
  if (xVel === 0 && yVel > 0) {
    baseHero.currentHeroSprite = baseHero.spriteSheets.down;
    baseHero.currentEquipmentSprite =
      baseHero.equipment.weapon.spriteSheets.down;
    baseHero.direction = "down";
  }
  if (xVel < 0 && yVel === 0) {
    baseHero.currentHeroSprite = baseHero.spriteSheets.left;
    baseHero.currentEquipmentSprite =
      baseHero.equipment.weapon.spriteSheets.left;
    baseHero.direction = "left";
  }
  if (xVel > 0 && yVel === 0) {
    baseHero.currentHeroSprite = baseHero.spriteSheets.right;
    baseHero.currentEquipmentSprite =
      baseHero.equipment.weapon.spriteSheets.right;
    baseHero.direction = "right";
  }
  if (!keysPressed && !baseHero.attackAnimation && !baseHero.scavengeAnimation && !baseHero.bloodDrainAnimation) {
    baseHero.heroCropX = 0;
  }


  // console.log(baseHero.targetCameraX)

  baseHero.cameraX = pixelPerfect(
    baseHero.targetCameraX,
    baseHero.direction,
    "x",
    globalVars.upscale
  );
  baseHero.cameraY = pixelPerfect(
    baseHero.targetCameraY,
    baseHero.direction,
    "y",
    globalVars.upscale
  );

  baseHero.totalXChange = pixelPerfect(
    baseHero.totalXChange + baseHero.frameXChange,
    baseHero.direction,
    "x",
    globalVars.upscale
  );
  baseHero.totalYChange = pixelPerfect(
    baseHero.totalYChange + baseHero.frameYChange,
    baseHero.direction,
    "y",
    globalVars.upscale
  );


  // iterates through the sprite sheet images to animate sprite - spriteAnimSpeed sets how fast this happens
  if (keysPressed) {
    if (baseHero.spriteAnimCounter >= baseHero.spriteAnimSpeed) {
      baseHero.heroCropX += baseHero.blockSize;
      if (baseHero.heroCropX > baseHero.blockSize * (baseHero.moveFrames - 1)) {
        baseHero.heroCropX = baseHero.blockSize;
      }
      baseHero.spriteAnimCounter = 0;
    }
    baseHero.spriteAnimCounter++;
  }


  // console.log('x:', baseHero.targetCameraX, baseHero.targetHeroX, 'y', baseHero.targetCameraY, baseHero.targetHeroY)

  return baseHero;
};

export default moveEngine;
