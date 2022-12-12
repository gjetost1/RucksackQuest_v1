// animates dying and blood drain
export const animateDyingAndBloodDrain = (element) => {
  element.data.animCounter++;

  if (element.data.animCounter >= element.data.spriteAnimSpeed) {
    element.crop.x += element.data.blockSize;
    element.data.animCounter = 0;
    if (element.crop.x >= element.data.blockSize * element.data.animFrames) {
      element.crop.x = element.data.blockSize * element.data.animFrames;
      return [false, element];
    }
  }
  return [true, element];
};
