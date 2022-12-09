import globalVars from "./GlobalVars";
import checkBoxCollision from "./CheckBoxCollision";
// handles hits on enemy or on hero
let collision = true;

const collisionCheck = (baseHero, el, tempCMasks) => {
  return (
    checkBoxCollision(
      baseHero.eventX,
      baseHero.eventY,
      el.hitColBox,
      tempCMasks,
      0
    ) &&
    checkBoxCollision(
      baseHero.eventX,
      baseHero.eventY,
      el.hitColBox,
      tempCMasks,
      1
    ) &&
    checkBoxCollision(
      baseHero.eventX,
      baseHero.eventY,
      el.hitColBox,
      tempCMasks,
      2
    ) &&
    checkBoxCollision(
      baseHero.eventX,
      baseHero.eventY,
      el.hitColBox,
      tempCMasks,
      3
    )
  );
};

const attackEngine = (attacker, target) => {
  const tempCMasks = [
    {
      tl: [target.x, target.y],
      tr: [target.x + target.blockSize, target.y],
      bl: [target.x, target.y + target.blockSize],
      br: [target.x + target.blockSize, target.y + target.blockSize],
    },
  ];

  collision = collisionCheck(attacker, target, tempCMasks);

  // uncomment to show corners of collisionMask where a hit will register on enemy
  // spriteCtx.fillRect(tempCMasks[0].tl[0], tempCMasks[0].tl[1], 4, 4)
  // spriteCtx.fillRect(tempCMasks[0].tr[0], tempCMasks[0].tr[1], 4, 4)
  // spriteCtx.fillRect(tempCMasks[0].bl[0], tempCMasks[0].bl[1], 4, 4)
  // spriteCtx.fillRect(tempCMasks[0].br[0], tempCMasks[0].br[1], 4, 4)

  if (attacker.attackActive && !collision && !target.takeDamage) {

    target.currentVitality -= 100;
    console.log('hit!!!', target.currentVitality, attacker.currentVitality)
    target.takeDamage = true;
    target.damageActive = true;
    target.damageAnim.active = true;
    // console.log(target.currentVitality)
    collision = false;
    // plays enemy damage sound if hit doesn't kill
    if (target.currentVitality > 0) {
      // target.damageSound.play();
    }
    target.moving = true;
    target.dashing = true;
    const damageMoveScale = target.blockSize / globalVars.upscale;
    target.fleeing = true;
    if (attacker.direction === "down") {
      target.y += damageMoveScale;
      target.direction = "down";
    } else if (attacker.direction === "up") {
      target.y -= damageMoveScale;
      target.direction = "up";
    } else if (attacker.direction === "left") {
      target.x -= damageMoveScale;
      target.direction = "left";
    } else if (attacker.direction === "right") {
      target.y += damageMoveScale;
      target.direction = "right";
    } else if (attacker.direction === "upleft") {
      target.x -= damageMoveScale;
      target.y -= damageMoveScale;
      target.direction = "upleft";
    } else if (attacker.direction === "upright") {
      target.x += damageMoveScale;
      target.y -= damageMoveScale;
      target.direction = "upright";
    } else if (attacker.direction === "downleft") {
      target.x -= damageMoveScale;
      target.y += damageMoveScale;
      target.direction = "downleft";
    } else if (attacker.direction === "downright") {
      target.x += damageMoveScale;
      target.y += damageMoveScale;
      target.direction = "downright";
    }
  }
  console.log()
  return [target, collision];
};

export default attackEngine;
