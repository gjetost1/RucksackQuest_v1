// handles animation of hero attack

const attackAnimate = (baseHero) => {
  baseHero.spriteAnimCounter++
  if (baseHero.spriteAnimCounter >= baseHero.spriteAnimSpeed) {
    baseHero.heroCropX += baseHero.blockSize;
    if (baseHero.heroCropX >= baseHero.blockSize * (baseHero.moveFrames + baseHero.attackFrames)) {
      baseHero.heroCropX = 0
      baseHero.spriteAnimCounter = 0
      baseHero.attackAnimation = false
    }
    baseHero.spriteAnimCounter = 0;
  }
  return baseHero
}

export default attackAnimate
