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

const heroRender = (renderArr, baseHero, spriteCtx) => {
  for (let el of renderArr) {
    el.draw()

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
  }
  return baseHero
}

export default heroRender
