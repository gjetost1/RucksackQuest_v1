// handles animation of hero attack

const attackAnimate = (target) => {
  target.spriteAnimCounter++;
  if (target.spriteAnimCounter >= target.spriteAnimSpeed) {
    target.cropX += target.blockSize;
    if (
      target.cropX >=
      target.blockSize * (target.moveFrames + target.attackFrames)
    ) {
      target.cropX = 0;
      target.spriteAnimCounter = 0;
      target.attackAnimation = false;
    }
    target.spriteAnimCounter = 0;
  }
  return target;
};

export default attackAnimate;
