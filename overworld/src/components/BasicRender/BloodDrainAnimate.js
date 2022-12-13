

const bloodDrainAnimate = (baseHero) => {
  // baseHero.heroCropX = baseHero.blockSize * 2
  // console.log('scavenge animation')
  baseHero.spriteAnimCounter++
  if (baseHero.spriteAnimCounter >= baseHero.spriteAnimSpeed) {
    // console.log(baseHero.heroCropX, baseHero.blockSize * baseHero.bloodDrainFrames)
    baseHero.heroCropX += baseHero.blockSize;
    // console.log(baseHero.heroCropX, baseHero.blockSize * baseHero.bloodDrainFrames)
    if (baseHero.heroCropX >= baseHero.blockSize * baseHero.bloodDrainFrames) {
      baseHero.heroCropX = baseHero.blockSize * 2
      // baseHero.spriteAnimCounter = 0
      // baseHero.scavengeAnimate = false
    }
    baseHero.spriteAnimCounter = 0;
  }
  return baseHero
}

export default bloodDrainAnimate
