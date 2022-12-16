import attackAnimate from "./AttackAnimate";
import scavengeAnimate from "./ScavengeAnimate";
import bloodDrainAnimate from "./BloodDrainAnimate";
// renderArr is an array of all the sprite class elements
// that you want to render for the hero sprite -
// this includes the base hero sprite and any outfits or equipment

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

const animateHero = (renderArr, spriteCtx) => {
  for (let el of renderArr) {
    spriteCtx.drawImage(
      el.image,
      el.crop.x,
      el.crop.y,
      el.blocksize,
      el.blocksize,
      el.position.x,
      el.position.y,
      el.blocksize,
      el.blocksize
    );
    spriteCtx.fillRect(el.position.x, el.position.y, el.blockSize, el.blockSize)

  }

  return renderArr;
};

const heroRender = (baseHeroObj, baseHeroSprite, swordSprite, spriteCtx) => {
  let baseHero = baseHeroObj;

  // draws hero sprite and equipment in attack animation if there is an ongoing attack
  if (baseHero.attackAnimation) {
    // console.log('running attack animation')
    baseHero.spriteAnimSpeed = 12;
    baseHero = attackAnimate(baseHero);
    baseHeroSprite.cropChange(baseHero.cropX, baseHero.cropY);
    swordSprite.cropChange(baseHero.cropX, baseHero.cropY);
    // baseHero = heroRender([baseHeroObj, swordSprite], baseHero, spriteCtx);
    animateHero([baseHeroSprite, swordSprite], spriteCtx);
    // renderArr = animateHero
  } else if (baseHero.scavengeAnimation) {
    baseHero.spriteAnimSpeed = 12;
    // console.log('animating scavenge')
    baseHero = scavengeAnimate(baseHero);
    baseHeroSprite.cropChange(baseHero.cropX, baseHero.cropY);
    swordSprite.cropChange(10000, 10000);
    // baseHero = heroRender([baseHeroObj, swordSprite], baseHero, spriteCtx);
    animateHero([baseHeroSprite], spriteCtx);
  } else if (baseHero.bloodDrainAnimation) {
    // console.log('animating blood drain')
    baseHero.spriteAnimSpeed = 18;
    baseHero = bloodDrainAnimate(baseHero);
    baseHeroSprite.cropChange(baseHero.cropX, baseHero.cropY);
    swordSprite.cropChange(10000, 10000);
    animateHero([baseHeroSprite], spriteCtx);
  } else {
    // console.log('regular animation')

    baseHero.spriteAnimSpeed = baseHero.baseAnimSpeed;

    // draws hero sprite image to canvas without attack animation
    // feed in sprite class instances in the order you want them rendered
    // eg typically base player sprite first, then clothing, then equipment
    baseHeroSprite.cropChange(baseHero.cropX, baseHero.cropY);
    if (
      baseHero.currentHeroSprite !== baseHero.spriteSheets.scavenge &&
      baseHero.currentHeroSprite !== baseHero.spriteSheets.bloodDrain
    ) {
      swordSprite.cropChange(baseHero.cropX, baseHero.cropY);
    }
    // baseHero = heroRender([baseHeroObj, swordSprite], baseHero, spriteCtx);
    animateHero([baseHeroSprite, swordSprite], spriteCtx);
  }
  // draws blood effect if damaged
  if (baseHero.damageActive) {
    spriteCtx.drawImage(
      baseHero.damageAnim.image,
      baseHero.damageAnim.crop.x,
      baseHero.damageAnim.crop.y,
      baseHero.damageAnim.data.blockSize,
      baseHero.damageAnim.data.blockSize,
      baseHero.x,
      baseHero.y,
      baseHero.damageAnim.data.blockSize,
      baseHero.damageAnim.data.blockSize
    );
    const animated = animate(baseHero.damageAnim);
    baseHero.damageActive = animated[0];
    baseHero.damageAnim = animated[1];
  }

  // baseHeroObj.data = baseHero

  return baseHero;
};

export default heroRender;
