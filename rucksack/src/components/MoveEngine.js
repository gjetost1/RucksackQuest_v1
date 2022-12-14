import droneSprt from "./droneRef";

// const moveObj = {  // for reference here
//   x: x,
//   y: y,
//   cMasks: cMasks,
//   xVel: xVel,
//   yVel: yVel,
//   keys: keys,
//   maxVitality: maxVitality,
//   currentVitality: currentVitality,
//   baseMaxVel: baseMaxVel,
//   maxVel: maxVel,
//   rateAccel: rateAccel,
//   rateDecel: rateDecel,
//   topDashBoost: topDashBoost,
//   boostMaxVel: boostMaxVel,
//   dashBoost: dashBoost,
//   blockSize: blockSize
// }

let spriteCounter = 0; // counter is used to only update the sprite periodically
const imagePreLoad = Object.values(droneSprt); // values of droneSprt object which are sprite images

const moveEngine = (moveObj) => {
  if (!moveObj) return;

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
    baseMaxVel,
    maxVel,
    rateAccel,
    rateDecel,
    topDashBoost,
    boostMaxVel,
    dashBoost,
    blockSize,
    heroSprite,
  } = moveObj;

  // keysPressed is true if any directional input was given this frame, otherwise false.
  const keysPressed =
    keys.ArrowUp.pressed ||
    keys.ArrowDown.pressed ||
    keys.ArrowLeft.pressed ||
    keys.ArrowRight.pressed;
  const bounce = 1; // this var multiplies force of rebound on collision, should probably put this in moveObj eventually
  const diagScale = 0.8; // this var multiplies/reduces the speed of diagonal movement since it is faster than horz and vert movement

  // get boolean values for each detector of hero hitbox
  // false if it is in collision state
  // true if it is not in collision state
  // there are 8 detectors for better precision - 4 didn't capture some collision states properly
  // corners are arranged like this:
  //
  //    1______2
  //  0|        |3
  //   |        |
  //  7|        |4
  //    6------5
  //

  const col0 = checkCollision(x, y, cMasks, blockSize, 0);
  const col1 = checkCollision(x, y, cMasks, blockSize, 1);
  const col2 = checkCollision(x, y, cMasks, blockSize, 2);
  const col3 = checkCollision(x, y, cMasks, blockSize, 3);
  const col4 = checkCollision(x, y, cMasks, blockSize, 4);
  const col5 = checkCollision(x, y, cMasks, blockSize, 5);
  const col6 = checkCollision(x, y, cMasks, blockSize, 6);
  const col7 = checkCollision(x, y, cMasks, blockSize, 7);
  const allCol = col0 && col1 && col2 && col3 && col4 && col5 && col6 && col7;

  // moves hero out of collision
  if (!col0 || !col7) {
    x += 0.1;
    xVel = 0;
  }
  if (!col1 || !col2) {
    y += 0.1;
    yVel = 0;
  }
  if (!col3 || !col4) {
    x -= 0.1;
    xVel = 0;
  }
  if (!col5 || !col6) {
    y -= 0.1;
    yVel = 0;
  }

  // if shift/dash is active increase the max velocity and add a boost to acceleration
  if (keys.Shift.pressed && currentVitality > 0) {
    maxVel = boostMaxVel;
    dashBoost = topDashBoost;
    // drains stamina if dash is active and there is directional input
    if (
      currentVitality > 0 &&
      (keys.ArrowDown.pressed ||
        keys.ArrowUp.pressed ||
        keys.ArrowRight.pressed ||
        keys.ArrowLeft.pressed)
    ) {
      currentVitality = currentVitality - 0.1;
    }
  } else {
    maxVel = baseMaxVel;
    dashBoost = 0;
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

  // deceleratorX increments xVel towards 0.
  // activated if there is no directional input
  const deceleratorX = () => {
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
  };

  const deceleratorY = () => {
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
  };

  // if chain to handle all directional inputs and collision
  if (keys.ArrowUp.pressed && keys.ArrowLeft.pressed) {
    // console.log('upleft')
    heroSprite = droneSprt.upleft; //sets appropriate sprite for direction of movement

    if (allCol) {
      // if no collisions move normally  - diagScale used to reduce diagonal movement speed
      if (yVel > -maxVel * diagScale) {
        yVel = (yVel - rateAccel - dashBoost) * diagScale;
      } else {
        yVel = -maxVel * diagScale;
      }
      if (xVel > -maxVel * diagScale) {
        xVel = (xVel - rateAccel - dashBoost) * diagScale;
      } else {
        xVel = -maxVel * diagScale;
      }
    } else if (!col0 && !col1) {
      // if both the forward moving corner detectors collide reverse both x and y velocity
      xVel = -xVel * bounce;
      yVel = -yVel * bounce;
    } else if (!col1 || !col2) {
      // if either top corners collide reverse y velocity but allow x movement
      yVel = -yVel * bounce;
      if (xVel > -maxVel * diagScale) {
        xVel = (xVel - rateAccel - dashBoost) * diagScale;
      } else {
        xVel = -maxVel * diagScale;
      }
    } else if (!col0 || !col7) {
      // if either side corners collide reverse x velocity but allow y movement
      xVel = -xVel * bounce;
      if (yVel > -maxVel * diagScale) {
        yVel = (yVel - rateAccel - dashBoost) * diagScale;
      } else {
        yVel = -maxVel * diagScale;
      }
    } else {
      // catchall to make sure you can still move in unforseen collision instances
      if (yVel > -maxVel * diagScale) {
        yVel = (yVel - rateAccel - dashBoost) * diagScale;
      } else {
        yVel = -maxVel * diagScale;
      }
      if (xVel > -maxVel * diagScale) {
        xVel = (xVel - rateAccel - dashBoost) * diagScale;
      } else {
        xVel = -maxVel * diagScale;
      }
    }
  } else if (keys.ArrowUp.pressed && keys.ArrowRight.pressed) {
    // console.log('upright')

    heroSprite = droneSprt.upright; //sets appropriate sprite for direction of movement

    if (allCol) {
      // if no collisions move normally - diagScale used to reduce diagonal movement speed
      if (yVel > -maxVel * diagScale) {
        yVel = (yVel - rateAccel - dashBoost) * diagScale;
      } else {
        yVel = -maxVel * diagScale;
      }
      if (xVel < maxVel * diagScale) {
        xVel = (xVel + rateAccel + dashBoost) * diagScale;
      } else {
        xVel = maxVel * diagScale;
      }
    } else if (!col2 && !col3) {
      // if both the forward moving corner detectors collide reverse both x and y velocity
      xVel = -xVel * bounce;
      yVel = -yVel * bounce;
    } else if (!col1 || !col2) {
      // if either top corners collide reverse y velocity but allow x movement
      yVel = -yVel * bounce;
      if (xVel < maxVel * diagScale) {
        xVel = (xVel + rateAccel + dashBoost) * diagScale;
      } else {
        xVel = maxVel * diagScale;
      }
    } else if (!col3 || !col4) {
      // if either side corners collide reverse x velocity but allow y movement
      xVel = -xVel * bounce;
      if (yVel > -maxVel * diagScale) {
        yVel = (yVel - rateAccel - dashBoost) * diagScale;
      } else {
        yVel = -maxVel * diagScale;
      }
    } else {
      // catchall to make sure you can still move in unforseen collision instances
      if (yVel > -maxVel * diagScale) {
        yVel = (yVel - rateAccel - dashBoost) * diagScale;
      } else {
        yVel = -maxVel * diagScale;
      }
      if (xVel < maxVel * diagScale) {
        xVel = (xVel + rateAccel + dashBoost) * diagScale;
      } else {
        xVel = maxVel * diagScale;
      }
    }
  } else if (keys.ArrowDown.pressed && keys.ArrowLeft.pressed) {
    // console.log('downleft')

    heroSprite = droneSprt.downleft; //sets appropriate sprite for direction of movement

    if (allCol) {
      // if no collisions move normally  - diagScale used to reduce diagonal movement speed
      if (yVel < maxVel * diagScale) {
        yVel = (yVel + rateAccel + dashBoost) * diagScale;
      } else {
        yVel = maxVel * diagScale;
      }
      if (xVel > -maxVel * diagScale) {
        xVel = (xVel - rateAccel - dashBoost) * diagScale;
      } else {
        xVel = -maxVel * diagScale;
      }
    } else if (!col6 && !col7) {
      // if both the forward moving corner detectors collide reverse both x and y velocity
      xVel = -xVel * bounce;
      yVel = -yVel * bounce;
    } else if (!col5 || !col6) {
      // if either bottom corners collide reverse y velocity but allow x movement
      yVel = -yVel * bounce;
      if (xVel > -maxVel * diagScale) {
        xVel = (xVel - rateAccel - dashBoost) * diagScale;
      } else {
        xVel = -maxVel * diagScale;
      }
    } else if (!col0 || !col7) {
      // if either side corners collide reverse x velocity but allow x movement
      xVel = -xVel * bounce;
      if (yVel < maxVel * diagScale) {
        yVel = (yVel + rateAccel + dashBoost) * diagScale;
      } else {
        yVel = maxVel * diagScale;
      }
    } else {
      // catchall to make sure you can still move in unforseen collision instances
      if (yVel < maxVel * diagScale) {
        yVel = (yVel + rateAccel + dashBoost) * diagScale;
      } else {
        yVel = maxVel * diagScale;
      }
      if (xVel > -maxVel * diagScale) {
        xVel = (xVel - rateAccel - dashBoost) * diagScale;
      } else {
        xVel = -maxVel * diagScale;
      }
    }
  } else if (keys.ArrowDown.pressed && keys.ArrowRight.pressed) {
    // console.log('downright')

    heroSprite = droneSprt.downright; //sets appropriate sprite for direction of movement

    if (allCol) {
      // if no collisions move normally  - diagScale used to reduce diagonal movement speed
      if (yVel < maxVel * diagScale) {
        yVel = (yVel + rateAccel + dashBoost) * diagScale;
      } else {
        yVel = maxVel * diagScale;
      }
      if (xVel < maxVel * diagScale) {
        xVel = (xVel + rateAccel + dashBoost) * diagScale;
      } else {
        xVel = maxVel * diagScale;
      }
    } else if (!col4 && !col5) {
      // if both the forward moving corner detectors collide reverse both x and y velocity
      xVel = -xVel * bounce;
      yVel = -yVel * bounce;
    } else if (!col5 || !col6) {
      // if either bottom corners collide reverse y velocity but allow x movement
      yVel = -yVel * bounce;
      if (xVel < maxVel * diagScale) {
        xVel = (xVel + rateAccel + dashBoost) * diagScale;
      } else {
        xVel = maxVel * diagScale;
      }
    } else if (!col3 || !col4) {
      // if either side corners collide reverse x velocity but allow y movement
      xVel = -xVel * bounce;
      if (yVel < maxVel * diagScale) {
        yVel = (yVel + rateAccel + dashBoost) * diagScale;
      } else {
        yVel = maxVel * diagScale;
      }
    } else {
      // catchall to make sure you can still move in unforseen collision instances
      if (yVel < maxVel * diagScale) {
        yVel = (yVel + rateAccel + dashBoost) * diagScale;
      } else {
        yVel = maxVel * diagScale;
      }
      if (xVel < maxVel * diagScale) {
        xVel = (xVel + rateAccel + dashBoost) * diagScale;
      } else {
        xVel = maxVel * diagScale;
      }
    }
  } else if (keys.ArrowUp.pressed) {
    // console.log('up')

    heroSprite = droneSprt.up; //sets appropriate sprite for direction of movement

    if (allCol) {
      // if no collisions move normally
      if (yVel > -maxVel) {
        yVel = yVel - rateAccel - dashBoost;
      }
      // xVel = 0
      deceleratorX();
    } else if (!col1 || !col2) {
      // if either detector on forward moving side collides reverse the velocity
      yVel = -yVel * bounce;
      // xVel = 0
      deceleratorX();
    } else {
      // catchall to make sure you can still move in unforseen collision instances
      if (yVel > -maxVel) {
        yVel = yVel - rateAccel - dashBoost;
      }
      // xVel = 0
      deceleratorX();
    }
  } else if (keys.ArrowDown.pressed) {
    // console.log('down')

    heroSprite = droneSprt.down; //sets appropriate sprite for direction of movement

    if (allCol) {
      // if no collisions move normally
      if (yVel < maxVel) {
        yVel = yVel + rateAccel + dashBoost;
      }
      // xVel = 0
      deceleratorX();
    } else if (!col5 || !col6) {
      // if either detector on forward moving side collides reverse the velocity
      yVel = -yVel * bounce;
      // xVel = 0
      deceleratorX();
    } else {
      // catchall to make sure you can still move in unforseen collision instances
      if (yVel < maxVel) {
        yVel = yVel + rateAccel + dashBoost;
      }
      // xVel = 0
      deceleratorX();
    }
  } else if (keys.ArrowLeft.pressed) {
    // console.log('left')

    heroSprite = droneSprt.left; //sets appropriate sprite for direction of movement

    if (allCol) {
      // if no collisions move normally
      if (xVel > -maxVel) {
        xVel = xVel - rateAccel - dashBoost;
      }
      // yVel = 0
      deceleratorY();
    } else if (!col0 || !col7) {
      // if either detector on forward moving side collides reverse the velocity
      xVel = -xVel * bounce;
      // yVel = 0
      deceleratorY();
    } else {
      // catchall to make sure you can still move in unforseen collision instances
      if (xVel > -maxVel) {
        xVel = xVel - rateAccel - dashBoost;
      }
      deceleratorY();
      // yVel = 0
    }
  } else if (keys.ArrowRight.pressed) {
    // console.log('right')

    heroSprite = droneSprt.right; //sets appropriate sprite for direction of movement

    if (allCol) {
      // if no collisions move normally
      if (xVel < maxVel) {
        xVel = xVel + rateAccel + dashBoost;
      }
      deceleratorY();
      // yVel = 0
    } else if (!col3 || !col4) {
      // if either detector on forward moving side collides reverse the velocity
      xVel = -xVel * bounce;
      deceleratorY();
      // yVel = 0
    } else {
      // catchall to make sure you can still move in unforseen collision instances
      if (xVel < maxVel) {
        xVel = xVel + rateAccel + dashBoost;
      }
      deceleratorY();
      // yVel = 0
    }
  } else {
    // reduces velocity back to zero for x and y every frame that input is not given
    deceleratorX();
    deceleratorY();
  }

  // sets moveObj x and y coordinates based on current xVel and yVel values
  x = x + xVel;
  y = y + yVel;

  // preloads sprite images every so often (every counter number of frames)
  // to prevent sprite flickering from image loading by browser
  if (spriteCounter >= 1000) {
    // console.log('preloading')
    for (let element of imagePreLoad) {
      const img = new Image();
      img.src = element;
    }
    spriteCounter = 0;
  }

  spriteCounter++;

  if (!keysPressed) {
    if (xVel < 0 && yVel < 0) {
      heroSprite = droneSprt.upleft; //sets appropriate sprite for direction of movement
    } else if (xVel < 0 && yVel > 0) {
      heroSprite = droneSprt.downleft;
    } else if (xVel > 0 && yVel > 0) {
      heroSprite = droneSprt.downright;
    } else if (xVel > 0 && yVel < 0) {
      heroSprite = droneSprt.upright;
    } else if (xVel < 0) {
      heroSprite = droneSprt.left;
    } else if (xVel > 0) {
      heroSprite = droneSprt.right;
    } else if (yVel < 0) {
      heroSprite = droneSprt.up;
    } else if (yVel > 0) {
      heroSprite = droneSprt.down;
    }
  }

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
    heroSprite,
  };
};

// checkCollision checks if x,y coordinates are inside one of the collision masks in cMask
// returns false if there is a collision and true if there is not
const checkCollision = (x, y, cMasks, blockSize, corner) => {
  const colBuffer = 1; // number of pixels away from hero that detectors sit
  const heroColBox = [
    // array of coordinates for all detectors of hero object
    [0, colBuffer],
    [colBuffer, 0],
    [blockSize - colBuffer, 0],
    [blockSize, colBuffer],
    [blockSize, blockSize - colBuffer],
    [blockSize - colBuffer, blockSize],
    [colBuffer, blockSize],
    [0, blockSize - colBuffer],
  ];

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
};

export default moveEngine;
