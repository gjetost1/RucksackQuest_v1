import globalVars from "./GlobalVars"

// checkCollision checks if baseHero.x,baseHero.y coordinates are inside one of the collision masks in cMask
// returns false if there is a collision and true if there is not
const checkCollision = (x, y, cMasks, blockSize, corner) => {
  const colBuffer = 4 // number of pixels away from hero that detectors sit
  const horzBuffer = 4
  const vertBuffer = 12
  const heroColBox = [
    // array of coordinates for all detectors of hero object
    [horzBuffer, colBuffer + vertBuffer * 2],
    [colBuffer + horzBuffer, vertBuffer * 2],
    [blockSize - colBuffer - horzBuffer, vertBuffer * 2],
    [blockSize - horzBuffer, colBuffer + vertBuffer * 2],
    [blockSize - horzBuffer, blockSize - colBuffer - vertBuffer + (globalVars.upscale * 2)],
    [blockSize - colBuffer - horzBuffer, blockSize - vertBuffer  + (globalVars.upscale * 2)],
    [colBuffer + horzBuffer, blockSize - vertBuffer  + (globalVars.upscale * 2)],
    [horzBuffer, blockSize - colBuffer - vertBuffer  + (globalVars.upscale * 2)]
  ]

  // const heroColBox = [
  //   // array of coordinates for all detectors of hero object
  //   [0, colBuffer],
  //   [colBuffer, 0],
  //   [blockSize - colBuffer, 0],
  //   [blockSize, colBuffer],
  //   [blockSize, blockSize - colBuffer],
  //   [blockSize - colBuffer, blockSize],
  //   [colBuffer, blockSize],
  //   [0, blockSize - colBuffer]
  // ]

  // const heroColBox = [
  //   // array of coordinates for all detectors of hero object
  //   [-colBuffer, 0],
  //   [0, -colBuffer],
  //   [blockSize, -colBuffer],
  //   [blockSize + colBuffer, 0],
  //   [blockSize + colBuffer, blockSize],
  //   [blockSize, blockSize + colBuffer],
  //   [0, blockSize + colBuffer],
  //   [-colBuffer, blockSize]
  // ]

  for (let i = 0; i < cMasks.length; i++) {
    //  loops every collision mask in cMasks array to check for collisions with hero
    let { tl, tr, bl, br } = cMasks[i]; // coordinates of the 4 corners of the collision mask
    if (
        x + heroColBox[corner][0] > tl[0] &&
        y + heroColBox[corner][1] > tl[1] &&
        x + heroColBox[corner][0] < tr[0] &&
        y + heroColBox[corner][1] > tr[1] &&
        x + heroColBox[corner][0] > bl[0] &&
        y + heroColBox[corner][1] < bl[1] &&
        x + heroColBox[corner][0] < br[0] &&
        y + heroColBox[corner][1] < br[1]
      ) {
        // console.log('!!!COLLISION ', corner)
        return false;
      }
  }
  return true;
}
 export default checkCollision
