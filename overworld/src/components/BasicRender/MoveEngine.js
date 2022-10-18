// const moveObj = {
//   x: x,
//   y: y,
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
  const newMoveObj = handleInput(moveObj)
  // console.log(newMoveObj.yVel)

  // console.log('newMoveObj', newMoveObj)
  return newMoveObj
};

// checkCollision checks if x,y coordinates are inside one of the collision masks in cMask
// returns false if there is a collision and true if there is not
const checkCollision = (x, y, cMasks, blockSize, corner) => {
  const colBuffer = 1; // number of pixels away from hero that cause collision
  const heroColBox = [
    // array of coordinates for all 4 corners of colliding object
    [-colBuffer, -colBuffer],
    [blockSize + colBuffer, -colBuffer],
    [blockSize + colBuffer, blockSize + colBuffer],
    [-colBuffer, blockSize + colBuffer]
  ];

  for (let i = 0; i < cMasks.length; i++) {
    //  loops every collision mask in cMasks array to check for collisions with hero
    let { tl, tr, bl, br } = cMasks[i]; // coordinates of the 4 corners of the collision mask
      // check all the corners given in the corner array for collisions
    for (let j = 0; j < corner.length; j++) {
      if (
        x + heroColBox[corner[j]][0] >= tl[0] &&
        y + heroColBox[corner[j]][1] >= tl[1] &&
        x + heroColBox[corner[j]][0] <= tr[0] &&
        y + heroColBox[corner[j]][1] >= tr[1] &&
        x + heroColBox[corner[j]][0] >= bl[0] &&
        y + heroColBox[corner[j]][1] <= bl[1] &&
        x + heroColBox[corner[j]][0] <= br[0] &&
        y + heroColBox[corner[j]][1] <= br[1]
      ) {
        console.log('!!!COLLISION!!!')
        return false;
      }
    }
  }
  return true;
};

const handleInput = (moveObj) => {
  let {
    x,
    y,
    cMasks,
    xVel,
    yVel,
    keys,
    maxStam,
    currentStam,
    maxVel,
    rateAccel,
    rateDecel,
    dashBoost,
    blockSize,
  } = moveObj;


  // if shift/dash is active increase the max velocity and adds a boost to acceleration
  if (keys.Shift.pressed && currentStam > 0) {
    maxVel = 2
    dashBoost = .2
    currentStam = currentStam - .2
  } else {
    maxVel = 1
    dashBoost = 0
    if (currentStam < maxStam) {
      currentStam = currentStam + .1
    }
  }

  // if (xVel > maxVel) {
  //   xVel = xVel - rateDecel
  // }
  // if (xVel < -maxVel) {
  //   xVel = xVel + rateDecel
  // }
  // if (yVel > maxVel) {
  //   yVel = yVel - rateDecel
  // }
  // if (yVel < -maxVel) {
  //   yVel = yVel + rateDecel
  // }


  if (keys.ArrowUp.pressed && keys.ArrowLeft.pressed) {
    if (checkCollision(x, y, cMasks, blockSize, [0])) {
      if (yVel >= -maxVel) {
        yVel = yVel - rateAccel - dashBoost;
      }
      if (xVel >= -maxVel) {
        xVel = xVel - rateAccel - dashBoost;
      }
    } else {
      if (!checkCollision(x, y, cMasks, blockSize, [1]) && !checkCollision(x, y, cMasks, blockSize, [3])) {
        xVel = 0
        yVel = 0
      } else if (!checkCollision(x, y, cMasks, blockSize, [1])) {
        yVel = 0
      } else if (!checkCollision(x, y, cMasks, blockSize, [3])) {
        xVel = 0
      }
    }
  } else if (keys.ArrowUp.pressed && keys.ArrowRight.pressed) {
    if (checkCollision(x, y, cMasks, blockSize, [1])) {
      if (yVel >= -maxVel) {
        yVel = yVel - rateAccel - dashBoost;
      }
      if (xVel <= maxVel) {
        xVel = xVel + rateAccel + dashBoost;
      }
    } else {
      if (!checkCollision(x, y, cMasks, blockSize, [0]) && !checkCollision(x, y, cMasks, blockSize, [2])) {
        xVel = 0
        yVel = 0
      } else if (!checkCollision(x, y, cMasks, blockSize, [0])) {
        yVel = 0
      } else if (!checkCollision(x, y, cMasks, blockSize, [2])) {
        xVel = 0
      }
    }
  } else if (keys.ArrowDown.pressed && keys.ArrowLeft.pressed) {
    if (checkCollision(x, y, cMasks, blockSize, [3])) {
      if (yVel <= maxVel) {
        yVel = yVel + rateAccel + dashBoost;
      }
      if (xVel >= -maxVel) {
        xVel = xVel - rateAccel - dashBoost;
      }
    } else {
      if (!checkCollision(x, y, cMasks, blockSize, [0]) && !checkCollision(x, y, cMasks, blockSize, [2])) {
        xVel = 0
        yVel = 0
      } else if (!checkCollision(x, y, cMasks, blockSize, [0])) {
        xVel = 0
      } else if (!checkCollision(x, y, cMasks, blockSize, [2])) {
        yVel = 0
      }
    }
  } else if (keys.ArrowDown.pressed && keys.ArrowRight.pressed) {
    if (checkCollision(x, y, cMasks, blockSize, [2])) {
      if (yVel <= maxVel) {
        yVel = yVel + rateAccel + dashBoost
      }
      if (xVel <= maxVel) {
        xVel = xVel + rateAccel + dashBoost
      }
    } else {
      if (!checkCollision(x, y, cMasks, blockSize, [1]) && !checkCollision(x, y, cMasks, blockSize, [3])) {
        xVel = 0
        yVel = 0
      } else if (!checkCollision(x, y, cMasks, blockSize, [1])) {
        xVel = 0
      } else if (!checkCollision(x, y, cMasks, blockSize, [3])) {
        yVel = 0
      }
    }
  } else if (keys.ArrowUp.pressed) {
    if (checkCollision(x, y, cMasks, blockSize, [0, 1])) {
      if (yVel >= -maxVel) {
        yVel = yVel - rateAccel - dashBoost
      }
      xVel = 0
    } else if (checkCollision(x, y, cMasks, blockSize, [0])) {
      if (yVel >= -maxVel) {
        yVel = yVel - rateAccel - dashBoost
      }
      xVel = 0
    }
  } else if (keys.ArrowDown.pressed) {
    if (checkCollision(x, y, cMasks, blockSize, [2, 3])) {
      if (yVel <= maxVel) {
        yVel = yVel + rateAccel + dashBoost
      }
      xVel = 0
    } else {
      yVel = 0
      // xVel = 0
    }
  } else if (keys.ArrowLeft.pressed) {
    if (checkCollision(x, y, cMasks, blockSize, [0, 3])) {
      if (xVel >= -maxVel) {
        xVel = xVel - rateAccel - dashBoost
      }
      yVel = 0
    } else {
      // yVel = 0
      xVel = 0
    }
  } else if (keys.ArrowRight.pressed) {
    if (checkCollision(x, y, cMasks, blockSize, [1, 2])) {
      if (xVel <= maxVel) {
        xVel = xVel + rateAccel + dashBoost
      }
      yVel = 0
    } else {
      // yVel = 0
      xVel = 0
    }
  } else {
    // reduces velocity back to zero for x and y every frame that input is not given
    if (xVel < 0) {
      xVel = xVel + rateDecel
    }
    if (xVel < 0 && xVel >= -rateDecel) {
      xVel = 0
    }
    if (xVel > 0) {
      xVel = xVel - rateDecel
    }
    if (xVel > 0 && xVel <= rateDecel) {
      xVel = 0
    }
    if (yVel < 0) {
      yVel = yVel + rateDecel
    }
    if (yVel < 0 && yVel >= -rateDecel) {
      yVel = 0
    }
    if (yVel > 0) {
      yVel = yVel - rateDecel
    }
    if (yVel > 0 && yVel <= rateDecel) {
      yVel = 0
    }
  }

  x = x + xVel
  y = y + yVel


  return (
    {   // returns moveObj with updated values for xVel, yVel, currentStam
      x,
      y,
      cMasks,
      xVel,
      yVel,
      keys,
      maxStam,
      currentStam,
      maxVel,
      rateAccel,
      rateDecel,
      dashBoost,
      blockSize
    }
  )
};

export default moveEngine;
