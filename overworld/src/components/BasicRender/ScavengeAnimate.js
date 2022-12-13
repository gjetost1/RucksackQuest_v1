

const scavengeAnimate = (baseHero) => {
  // console.log('scavenge animation')
  baseHero.spriteAnimCounter++
  if (baseHero.spriteAnimCounter >= baseHero.spriteAnimSpeed) {
    baseHero.heroCropX += baseHero.blockSize;
    if (baseHero.heroCropX >= baseHero.blockSize * (baseHero.scavengeFrames - 1)) {
      baseHero.heroCropX = baseHero.blockSize * 2
      // baseHero.spriteAnimCounter = 0
      // baseHero.scavengeAnimate = false
    }
    baseHero.spriteAnimCounter = 0;
  }
  return baseHero
}

export default scavengeAnimate
