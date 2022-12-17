import globalVars from "./GlobalVars"

// checkCollision checks if baseHero.x,baseHero.y coordinates are inside one of the collision masks in cMask
// returns false if there is a collision and true if there is not
const checkBoxCollision = (x, y, cMasks, dataVisCtx) => {
  // console.log(x, y)
  // const colBuffer = 4 // number of pixels away from hero that detectors sit
  // const horzBuffer = 4
  // const vertBuffer = 12

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

    // uncomment to render the box coordinates where a hit will register
    // dataVisCtx.fillRect(tl[0],tl[1], 4, 4)
    // dataVisCtx.fillRect(tr[0], tr[1], 4, 4)
    // dataVisCtx.fillRect(bl[0], bl[1], 4, 4)
    // dataVisCtx.fillRect(br[0], br[1], 4, 4)

    if (
        x > tl[0] &&
        y > tl[1] &&
        x < tr[0] &&
        y > tr[1] &&
        x > bl[0] &&
        y < bl[1] &&
        x < br[0] &&
        y < br[1]
      ) {
        // console.log('!!!COLLISION ', corner)
        return false;
      }
  }
  return true;
}
 export default checkBoxCollision
