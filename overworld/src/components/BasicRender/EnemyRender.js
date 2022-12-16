import globalVars from "./GlobalVars";
import attackAnimate from "./AttackAnimate";

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

const animateEnemy = (renderArr, spriteCtx) => {
  // console.log('running')
  for (let el of renderArr) {
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
  }
  return renderArr
}

const frameCropLimit = 20
let frameCropCounter = 0

const enemyRender = (enemyArr, baseHeroObj, spriteCtx, renderType) => {
  let baseHero = baseHeroObj
  if (!enemyArr) return;

  for (let el of enemyArr) {

    // console.log(el.data)
    // if (
    //   (el.data.x <= 0 ||
    //     el.data.x >= globalVars.width ||
    //     el.data.y <= 0 ||
    //     el.data.y >= globalVars.height) &&
    //   !el.data.dead
    // ) {
    //   frameCropCounter++
    //   if (frameCropCounter >= frameCropLimit) {
    //   frameCropCounter = 0

    //     if (el.data.x <= 0) {
    //       el.data.x -= globalVars.upscale
    //       el.data.moving = true

    //     } else if (el.data.x >= globalVars.width) {
    //       el.data.x += globalVars.upscale
    //     } else if (el.data.y <= 0) {
    //       el.data.y -= globalVars.upscale
    //     } else if (el.data.y >= globalVars.height) {
    //       el.data.y += globalVars.upscale
    //     }
    //     // if (el.data.x <= 0) {
    //     //   el.crop.x += globalVars.upscale
    //     // } else if (el.data.x >= globalVars.width) {
    //     //   el.crop.x -= globalVars.upscale
    //     // } else if (el.data.y <= 0) {
    //     //   el.crop.y += globalVars.upscale
    //     // } else if (el.data.y >= globalVars.height) {
    //     //   el.crop.y -= globalVars.upscale
    //     // }
    //   }
    //   spriteCtx.drawImage(
    //     el.image,
    //     el.crop.x,
    //     el.crop.y,
    //     el.data.blockSize,
    //     el.data.blockSize,
    //     el.position.x,
    //     el.position.y,
    //     el.data.blockSize,
    //     el.data.blockSize
    //   );
    // }

    // use 2 render instances so the enemy is in front of the hero when it's y value is less
    // and behind when the y value is more
    // console.log(el.data.attackAnimation)
   if (
      (el.data.y + el.data.blockSize / (globalVars.upscale * 2) <= baseHero.y &&
        renderType !== "front" &&
        !el.data.dead) ||
      (el.data.y + el.data.blockSize / (globalVars.upscale * 2) > baseHero.y &&
        renderType !== "back" &&
        !el.data.dead) ||
      (el.data.dead && renderType === "back")
    ) {

      if (el.data.attackAnimation) {
        // console.log('attack animation')
        el.data.spriteAnimSpeed = 4
        el.data = attackAnimate(el.data);
        // console.log(el.data)
        el.cropChange(el.data.cropX, el.data.cropY);
        // baseHero = heroRender([baseHeroObj, swordSprite], baseHero, spriteCtx);
        animateEnemy([el], spriteCtx)
      } else {
        // console.log('moving animation')
        animateEnemy([el], spriteCtx)
        el.cropChange(el.data.cropX, el.data.cropY);

        if (el.data.damageActive) {
          const animated = animate(el.data.damageAnim);
          el.data.damageActive = animated[0];
          el.data.damageAnim = animated[1];
        }
      }

    }
  }

  return enemyArr;
};

export default enemyRender;
