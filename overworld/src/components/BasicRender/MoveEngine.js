// const moveObj = {
//   x: playerSprite.position.x,
//   y: playerSprite.position.y,
//   cMasks: cMasks,
//   xVel: xVel,
//   yVel: yVel,
//   keys: keys,
//   maxStam: maxStam,
//   currentStam: currentStam,
//   maxVel: maxVel,
//   rateAccel: rateAccel,
//   rateDecel: rateDecel,
//   dashBoost: dashBoost,
//   blockSize: blockSize
// }

const moveEngine = (moveObj) => {
  let {x, y, cMasks, xVel, yVel, keys,
      maxStam, currentStam, maxVel,
      rateAccel, rateDecel, dashBoost,
      blockSize} = moveObj

  // checkCollision(x, y, cMasks, blockSize, corner)
  handleInput(keys, xVel, yVel, rateAccel, rateDecel, maxVel, dashBoost)

  return moveObj
}

// checkCollision checks if x,y coordinates are inside one of the collision masks in cMask
// returns true if there is a collision and false if there is not
const checkCollision = (x, y, cMasks, blockSize, corner) => {

  const heroColBox = [  // array of coordinates for all 4 corners of colliding object
    [1, 1],
    [blockSize - 1, 1],
    [blockSize - 1, blockSize - 1],
    [1, blockSize - 1]
  ]

  for (let i = 0; i < cMasks.length; i++) {  //  loops every collision mask in cMasks array to check for collisions with hero
    let {tl, tr, bl, br} = cMasks[i] // coordinates of the 4 corners of the collision mask
    if (corner) { // if there is a specified corner just check collision for that
      if (
        x + heroColBox[corner][0] >= tl[0] &&
        y + heroColBox[corner][1] >= tl[1] &&
        x + heroColBox[corner][0] <= tr[0] &&
        y + heroColBox[corner][1] >= tr[1] &&
        x + heroColBox[corner][0] >= bl[0] &&
        y + heroColBox[corner][1] <= bl[1] &&
        x + heroColBox[corner][0] <= br[0] &&
        y + heroColBox[corner][1] <= br[1]
      ) {
        return true
      }
    } else { // otherwise check all the corners
      for (let j = 0; j < heroColBox.length; j++) {
        if (
          x + heroColBox[j][0] >= tl[0] &&
          y + heroColBox[j][1] >= tl[1] &&
          x + heroColBox[j][0] <= tr[0] &&
          y + heroColBox[j][1] >= tr[1] &&
          x + heroColBox[j][0] >= bl[0] &&
          y + heroColBox[j][1] <= bl[1] &&
          x + heroColBox[j][0] <= br[0] &&
          y + heroColBox[j][1] <= br[1]
          ) {
            // console.log('!!!COLLISION!!!')
            return true
          }
        }
      }
  }
  return false
}

const handleInput = (keys, xVel, yVel, rateAccel, rateDecel, maxVel, dashBoost) => {

}

export default moveEngine
