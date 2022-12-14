// const moveObj = {
//   x: x,
//   y: y,
//   cMasks: cMasks,
//   xVel: xVel,
//   yVel: yVel,
//   keys: keys,
//   maxVitality: maxVitality,
//   currentVitality: currentVitality,
//   maxVel: maxVel,
//   rateAccel: rateAccel,
//   rateDecel: rateDecel,
//   dashBoost: dashBoost,
//   blockSize: blockSize
// }

const moveEngine = (moveObj) => {
  const newMoveObj = handleInput(moveObj);
  // console.log(newMoveObj.yVel)

  // console.log('newMoveObj', newMoveObj)
  return newMoveObj;
};

// checkCollision checks if x,y coordinates are inside one of the collision masks in cMask
// returns false if there is a collision and true if there is not
const checkCollision = (x, y, cMasks, blockSize, corner) => {
  const colBuffer = 0; // number of pixels away from hero that cause collision
  const heroColBox = [
    // array of coordinates for all 4 corners of colliding object
    [-colBuffer, -colBuffer],
    [blockSize + colBuffer, -colBuffer],
    [blockSize + colBuffer, blockSize + colBuffer],
    [-colBuffer, blockSize + colBuffer],
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
        console.log("!!!COLLISION!!!");
        return false;
      }
    }
  }
  return true;
};

const handleInput = (moveObj) => {
  // destructure all the values from moveObj
  let {
    x,
    y,
    cMasks,
    xVel,
    yVel,
    keys,
    maxVitality,
    currentVitality,
    maxVel,
    rateAccel,
    rateDecel,
    dashBoost,
    blockSize,
  } = moveObj;

  // get boolean values for each corner of hero hitbox - false if it is in collision state
  // true if it is not in collision state
  // corners sent to checkCollision must be in an array and are arranged like this:
  //
  // tl  0--1  tr
  //     |  |
  // bl  3--2  br
  //
  const tlCol = checkCollision(x, y, cMasks, blockSize, [0]);
  const trCol = checkCollision(x, y, cMasks, blockSize, [1]);
  const brCol = checkCollision(x, y, cMasks, blockSize, [2]);
  const blCol = checkCollision(x, y, cMasks, blockSize, [3]);

  // if shift/dash is active increase the max velocity and add a boost to acceleration
  if (keys.Shift.pressed && currentVitality > 0) {
    maxVel = 2;
    dashBoost = 0.2;
    // drains stamina if dash is active and there is directional input
    if (
      currentVitality > 0 &&
      (keys.ArrowDown.pressed ||
        keys.ArrowUp.pressed ||
        keys.ArrowRight.pressed ||
        keys.ArrowLeft.pressed)
    ) {
      currentVitality = currentVitality - 0.2;
    }
  } else {
    maxVel = 1;
    dashBoost = 0;
    if (currentVitality < maxVitality) {
      currentVitality = currentVitality + 0.1;
    }
  }

  // if x or y velocity is higher than the current maxVel this brings it back down
  // this handles deceleration when dash is deactivated
  if (xVel > maxVel) {
    xVel = xVel - rateDecel;
  }
  if (xVel < -maxVel) {
    xVel = xVel + rateDecel;
  }
  if (yVel > maxVel) {
    yVel = yVel - rateDecel;
  }
  if (yVel < -maxVel) {
    yVel = yVel + rateDecel;
  }

  // if chain to handle all directional inputs plus collision
  if (keys.ArrowUp.pressed && keys.ArrowLeft.pressed) {
    if (tlCol) {
      if (yVel >= -maxVel) {
        yVel = yVel - rateAccel - dashBoost;
      }
      if (xVel >= -maxVel) {
        xVel = xVel - rateAccel - dashBoost;
      }
    } else {
      if (!trCol && !blCol) {
        xVel = 0;
        yVel = 0;
      } else if (!trCol) {
        yVel = 0;
      } else if (!blCol) {
        xVel = 0;
      }
    }
  } else if (keys.ArrowUp.pressed && keys.ArrowRight.pressed) {
    if (trCol) {
      if (yVel >= -maxVel) {
        yVel = yVel - rateAccel - dashBoost;
      }
      if (xVel <= maxVel) {
        xVel = xVel + rateAccel + dashBoost;
      }
    } else {
      if (!tlCol && !brCol) {
        xVel = 0;
        yVel = 0;
      } else if (!tlCol) {
        yVel = 0;
      } else if (!brCol) {
        xVel = 0;
      }
    }
  } else if (keys.ArrowDown.pressed && keys.ArrowLeft.pressed) {
    if (blCol) {
      if (yVel <= maxVel) {
        yVel = yVel + rateAccel + dashBoost;
      }
      if (xVel >= -maxVel) {
        xVel = xVel - rateAccel - dashBoost;
      }
    } else {
      if (!tlCol && !brCol) {
        xVel = 0;
        yVel = 0;
      } else if (!tlCol) {
        xVel = 0;
      } else if (!brCol) {
        yVel = 0;
      }
    }
  } else if (keys.ArrowDown.pressed && keys.ArrowRight.pressed) {
    if (brCol) {
      if (yVel <= maxVel) {
        yVel = yVel + rateAccel + dashBoost;
      }
      if (xVel <= maxVel) {
        xVel = xVel + rateAccel + dashBoost;
      }
    } else {
      if (!trCol && !blCol) {
        xVel = 0;
        yVel = 0;
      } else if (!trCol) {
        xVel = 0;
      } else if (!blCol) {
        yVel = 0;
      }
    }
  } else if (keys.ArrowUp.pressed) {
    if (tlCol && trCol && blCol && brCol) {
      if (yVel > -maxVel) {
        yVel = yVel - rateAccel - dashBoost;
      }
      xVel = 0;
    } else if (!tlCol && !trCol) {
      yVel = -yVel / 2;
    } else if ((!tlCol && trCol && !blCol) || (tlCol && !trCol && !brCol)) {
      if (yVel > -maxVel) {
        yVel = yVel - rateAccel - dashBoost;
      }
      xVel = 0;
    } else if (!tlCol || !trCol) {
      x -= 0.1;
      y -= 0.1;
      yVel = 0;
    } else {
      if (yVel > -maxVel) {
        yVel = yVel - rateAccel - dashBoost;
      }
      xVel = 0;
    }
  } else if (keys.ArrowDown.pressed) {
    if (tlCol && trCol && blCol && brCol) {
      if (yVel < maxVel) {
        yVel = yVel + rateAccel + dashBoost;
      }
      xVel = 0;
    } else if (!blCol && !brCol) {
      yVel = -yVel / 2;
    } else if ((!blCol && brCol && !tlCol) || (blCol && !brCol && !trCol)) {
      if (yVel < maxVel) {
        yVel = yVel + rateAccel + dashBoost;
      }
      xVel = 0;
    } else if (!blCol || !brCol) {
      yVel = 0;
    } else {
      if (yVel < maxVel) {
        yVel = yVel + rateAccel + dashBoost;
      }
      xVel = 0;
    }
  } else if (keys.ArrowLeft.pressed) {
    if (tlCol && trCol && blCol && brCol) {
      if (xVel > -maxVel) {
        xVel = xVel - rateAccel - dashBoost;
      }
      yVel = 0;
    } else if (!tlCol && !blCol) {
      xVel = -xVel / 2;
    } else if ((!tlCol && blCol && !trCol) || (!blCol && tlCol && !brCol)) {
      if (xVel > -maxVel) {
        xVel = xVel - rateAccel - dashBoost;
      }
      yVel = 0;
    } else if (!tlCol || !blCol) {
      xVel = 0;
    } else {
      if (xVel > -maxVel) {
        xVel = xVel - rateAccel - dashBoost;
      }
      yVel = 0;
    }
  } else if (keys.ArrowRight.pressed) {
    if (tlCol && trCol && blCol && brCol) {
      if (xVel < maxVel) {
        xVel = xVel + rateAccel + dashBoost;
      }
      yVel = 0;
    } else if (!trCol && !brCol) {
      xVel = -xVel / 2;
    } else if ((!trCol && brCol && !tlCol) || (!brCol && trCol && !blCol)) {
      if (xVel < maxVel) {
        xVel = xVel + rateAccel + dashBoost;
      }
      yVel = 0;
    } else if (!trCol || !brCol) {
      xVel = 0;
    } else {
      if (xVel < maxVel) {
        xVel = xVel + rateAccel + dashBoost;
      }
      yVel = 0;
    }
  } else {
    // reduces velocity back to zero for x and y every frame that input is not given
    if (xVel < 0) {
      if (xVel >= -rateDecel) {
        xVel = 0;
      } else {
        xVel = xVel + rateDecel;
      }
    }
    if (xVel > 0) {
      if (xVel <= rateDecel) {
        xVel = 0;
      } else {
        xVel = xVel - rateDecel;
      }
    }
    if (yVel < 0) {
      if (yVel >= -rateDecel) {
        yVel = 0;
      } else {
        yVel = yVel + rateDecel;
      }
    }
    if (yVel > 0) {
      if (yVel <= rateDecel) {
        yVel = 0;
      } else {
        yVel = yVel - rateDecel;
      }
    }
  }

  x = x + xVel;
  y = y + yVel;

  return {
    // returns moveObj with updated values for xVel, yVel, currentVitality
    x,
    y,
    cMasks,
    xVel,
    yVel,
    keys,
    maxVitality,
    currentVitality,
    maxVel,
    rateAccel,
    rateDecel,
    dashBoost,
    blockSize,
  };
};

export default moveEngine;
