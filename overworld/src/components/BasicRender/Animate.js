// animates dying and blood drain
export const animateDyingAndBloodDrain = (element) => {
  console.log('here')
  element.data.animCounter++;
  if (element.data.animCounter >= element.data.spriteAnimSpeed) {
    element.crop.x += element.data.blockSize;
    element.data.animCounter = 0;
    console.log(element.crop.x, element.data.blockSize * element.data.animFrames)
    if (element.crop.x >= element.data.blockSize * element.data.animFrames) {
      element.crop.x = element.data.blockSize * element.data.deadFrame;
      return [false, element];
    }
  }
  return [true, element];
};
