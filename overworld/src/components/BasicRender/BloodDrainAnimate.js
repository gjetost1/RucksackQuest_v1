const bloodDrainAnimate = (baseHero) => {
  // baseHero.cropX = baseHero.blockSize * 2
  // console.log('scavenge animation')
  baseHero.spriteAnimCounter++;
  if (baseHero.spriteAnimCounter >= baseHero.spriteAnimSpeed) {
    // console.log(baseHero.cropX, baseHero.blockSize * baseHero.bloodDrainFrames)
    baseHero.cropX += baseHero.blockSize;
    // console.log(baseHero.cropX, baseHero.blockSize * baseHero.bloodDrainFrames)
    if (baseHero.cropX >= baseHero.blockSize * baseHero.bloodDrainFrames) {
      baseHero.cropX = baseHero.blockSize * 2;
      // baseHero.spriteAnimCounter = 0
      // baseHero.scavengeAnimate = false
    }
    baseHero.spriteAnimCounter = 0;
  }
  return baseHero;
};

export default bloodDrainAnimate;
