import globalVars from "./GlobalVars";
import checkBoxCollision from "./CheckBoxCollision";
// handles hits on enemy or on hero

const collisionCheck = (attacker, target, tempCMasks, dataVisCtx) => {
  return (
    checkBoxCollision(
      attacker.eventX,
      attacker.eventY,
      target.hitColBox,
      tempCMasks,
      0,
      dataVisCtx
      ) &&
      checkBoxCollision(
        attacker.eventX,
        attacker.eventY,
        target.hitColBox,
        tempCMasks,
        1,
        dataVisCtx
      ) &&
      checkBoxCollision(
        attacker.eventX,
        attacker.eventY,
        target.hitColBox,
        tempCMasks,
        2,
        dataVisCtx
    ) &&
    checkBoxCollision(
      attacker.eventX,
      attacker.eventY,
      target.hitColBox,
      tempCMasks,
      3,
      dataVisCtx
    )
  );
};

const attackEngine = (attacker, target, dataVisCtx) => {
  // let collision = true;
  const tempCMasks = [
    {
      tl: [target.x, target.y],
      tr: [target.x + target.blockSize, target.y],
      bl: [target.x, target.y + target.blockSize],
      br: [target.x + target.blockSize, target.y + target.blockSize],
    },
  ];


  let collision = collisionCheck(attacker, target, tempCMasks, dataVisCtx);
  // console.log(collision)
  // uncomment to show corners of collisionMask where a hit will register on enemy
  // spriteCtx.fillRect(tempCMasks[0].tl[0], tempCMasks[0].tl[1], 4, 4)
  // spriteCtx.fillRect(tempCMasks[0].tr[0], tempCMasks[0].tr[1], 4, 4)
  // spriteCtx.fillRect(tempCMasks[0].bl[0], tempCMasks[0].bl[1], 4, 4)
  // spriteCtx.fillRect(tempCMasks[0].br[0], tempCMasks[0].br[1], 4, 4)

  if (attacker.attackActive && !collision && !target.takeDamage) {
    // different effects if target is enemy or hero
    let tempX
    let tempY
    let tempBaseDamage
    let tempDamageRange
    let tempXRef = tempX // used to set x and y frame changes from knockback if enemy hits hero
    let tempYRef = tempY
    if (target.type === 'enemy') {
      tempX = target.x
      tempY = target.y
      tempBaseDamage = attacker.equipment.weapon.baseDamage
      tempDamageRange = attacker.equipment.weapon.damageRange
      target.fleeing = true;
      target.moving = true;
      target.dashing = true;
    } else if (target.type === 'hero') {
      tempX = target.targetCameraX
      tempY = target.targetCameraY
      tempBaseDamage = attacker.baseDamage
      tempDamageRange = attacker.damageRange
      tempXRef = tempX
      tempYRef = tempY
    }
    const damageRange = Math.round(Math.random() * tempDamageRange)
    // console.log(tempBaseDamage + damageRange)
    target.currentVitality -= tempBaseDamage + damageRange;
    target.takeDamage = true;
    target.damageActive = true;
    target.damageAnim.active = true;
    // console.log(target.currentVitality)
    collision = false;
    // plays enemy damage sound if hit doesn't kill
    if (target.currentVitality > 0) {
      target.damageSound.play();
    } else if (target.currentVitality <= 0) {
      target.currentVitality = 0
    }

    const damageMoveScale = target.blockSize / globalVars.upscale;



    if (attacker.direction === "down") {
      tempY += damageMoveScale;
      target.direction = "down";
    } else if (attacker.direction === "up") {
      tempY -= damageMoveScale;
      target.direction = "up";
    } else if (attacker.direction === "left") {
      tempX -= damageMoveScale;
      target.direction = "left";
    } else if (attacker.direction === "right") {
      tempY += damageMoveScale;
      target.direction = "right";
    } else if (attacker.direction === "upleft") {
      tempX -= damageMoveScale;
      tempY -= damageMoveScale;
      target.direction = "upleft";
    } else if (attacker.direction === "upright") {
      tempX += damageMoveScale;
      tempY -= damageMoveScale;
      target.direction = "upright";
    } else if (attacker.direction === "downleft") {
      tempX -= damageMoveScale;
      tempY += damageMoveScale;
      target.direction = "downleft";
    } else if (attacker.direction === "downright") {
      tempX += damageMoveScale;
      tempY += damageMoveScale;
      target.direction = "downright";
    }
    if (target.type === 'enemy') {
      target.x = tempX
      target.y = tempY
    } else if (target.type === 'hero') {
      target.targetCameraX = tempX
      target.targetCameraY = tempY
      target.bonusFrameXChange = tempXRef - tempX
      target.bonusFrameYChange = tempYRef - tempY
    }
  }
  // console.log('after', target)
  return [target, collision];
};

export default attackEngine;
