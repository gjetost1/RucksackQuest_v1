import enemyMoveEngine from "./EnemyMoveEngine";
import globalVars from "./GlobalVars";

// animates damage effects
const animate = (element) => {
  // console.log(element)
  element.data.animCounter++;
  if (element.data.animCounter >= element.data.spriteAnimSpeed) {
    element.crop.x += element.data.blockSize;
    element.data.animCounter = 0;
    if (element.crop.x >= element.data.blockSize * element.data.animFrames) {
      element.crop.x = 0;
      // element.data.active = false
      return [false, element];
    }
  }
  return [true, element];
};

const enemyRender = (enemyArr, baseHero, spriteCtx, renderType) => {
  if (!enemyArr) return;

  for (let el of enemyArr) {
    // use 2 render instances so the enemy is in front of the hero when it's y value is less
    // and behind when the y value is more
    // console.log(el.data)
    if (
      (el.data.y + el.data.blockSize / (globalVars.upscale * 2) <= baseHero.y &&
        renderType !== "front" &&
        !el.data.dead) ||
      (el.data.y + el.data.blockSize / (globalVars.upscale * 2) > baseHero.y &&
        renderType !== "back" &&
        !el.data.dead) ||
      (el.data.dead && renderType === "back")
    ) {
      spriteCtx.drawImage(
        el.image,
        el.crop.x,
        el.crop.y,
        el.data.blockSize,
        el.data.blockSize,
        el.position.x,
        el.position.y,
        el.data.blockSize,
        el.data.blockSize
      );

      if (el.data.damageActive) {
        spriteCtx.drawImage(
          el.data.damageAnim.image,
          el.data.damageAnim.crop.x,
          el.data.damageAnim.crop.y,
          el.data.damageAnim.data.blockSize,
          el.data.damageAnim.data.blockSize,
          el.position.x,
          el.position.y,
          el.data.damageAnim.data.blockSize,
          el.data.damageAnim.data.blockSize
        );
        const animated = animate(el.data.damageAnim);
        el.data.damageActive = animated[0];
        el.data.damageAnim = animated[1];
      }
    }
  }

  return enemyArr;
};

export default enemyRender;
