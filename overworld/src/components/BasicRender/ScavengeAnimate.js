const scavengeAnimate = (baseHero) => {
  // console.log('scavenge animation')
  baseHero.spriteAnimCounter++;
  if (baseHero.spriteAnimCounter >= baseHero.spriteAnimSpeed) {
    baseHero.cropX += baseHero.blockSize;
    if (baseHero.cropX >= baseHero.blockSize * (baseHero.scavengeFrames - 1)) {
      baseHero.cropX = baseHero.blockSize * 2;
      // baseHero.spriteAnimCounter = 0
      // baseHero.scavengeAnimate = false
    }
    baseHero.spriteAnimCounter = 0;
  }
  return baseHero;
};

export default scavengeAnimate;
