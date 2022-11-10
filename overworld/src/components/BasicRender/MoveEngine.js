import droneSprt from './droneRef'
import { hero_down, hero_up, hero_left, hero_right, hero_downleft, hero_downright, hero_upleft, hero_upright } from './spriteRef'
import { hero_spritesheets, sword_spritesheets } from './spriteRef'

// const moveObj = {  // for reference here
//   x: x,
//   y: y,
//   cMasks: cMasks,
//   xVel: xVel,
//   yVel: yVel,
//   keys: keys,
//   maxStam: maxStam,
//   currentStam: currentStam,
//   baseMaxVel: baseMaxVel,
//   maxVel: maxVel,
//   rateAccel: rateAccel,
//   rateDecel: rateDecel,
//   topDashBoost: topDashBoost,
//   boostMaxVel: boostMaxVel,
//   dashBoost: dashBoost,
//   blockSize: blockSize,
//   heroSprite,
//   equipImage,
//   heroSpriteSize,
//   heroCropX,
//   heroCropY,
//   heroDirection,
// }

let spriteCounter = 160 // counter is used to only update the sprite periodically
// const imagePreLoad = Object.values(droneSprt) // values of droneSprt object which are sprite images
const imagePreLoad = [...hero_down, ...hero_up, ...hero_left, ...hero_right, ...hero_downleft, ...hero_downright, ...hero_upleft, ...hero_upright] // values of droneSprt object which are sprite images
let spriteIndex = 1 // increments for sprite animation while walking
const baseAnimSpeed = 3
let spriteAnimSpeed = baseAnimSpeed // after how many frames the sprite frame will progress for walking animation
let spriteAnimCounter = 0 // increments to trigger render of next animation frame


const moveEngine = (moveObj) => {
  if (!moveObj) return

  // destructure all the values from moveObj
  let {
    x,
    y,
    cMasks,
    xVel,
    yVel,
    keys,
    maxStam,
    currentStam,
    baseMaxVel,
    maxVel,
    rateAccel,
    rateDecel,
    topDashBoost,
    boostMaxVel,
    dashBoost,
    blockSize,
    heroSprite,
    equipImage,
    heroSpriteSize,
    heroCropX,
    heroCropY,
    heroDirection
  } = moveObj


  // keysPressed is true if any directional input was given this frame, otherwise false.
  const keysPressed = (keys.ArrowUp.pressed || keys.ArrowDown.pressed || keys.ArrowLeft.pressed || keys.ArrowRight.pressed)
  const bounce = 1 // this var multiplies force of rebound on collision, should probably put this in moveObj eventually
  const diagScale = 1 // this var multiplies/reduces the speed of diagonal movement since it is faster than horz and vert movement

  // preloads sprite images every so often (every counter number of frames)
  // to prevent sprite flickering from image loading by browser
  // if (spriteCounter >= 100) {
  //   console.log('preloading')
  //   for (let element of imagePreLoad) {
  //     const img = new Image()
  //       img.src = element
  //   }
  //   spriteCounter = 0
  // }

  // spriteCounter++

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

  const col0 = checkCollision(x, y, cMasks, blockSize, 0)
  const col1 = checkCollision(x, y, cMasks, blockSize, 1)
  const col2 = checkCollision(x, y, cMasks, blockSize, 2)
  const col3 = checkCollision(x, y, cMasks, blockSize, 3)
  const col4 = checkCollision(x, y, cMasks, blockSize, 4)
  const col5 = checkCollision(x, y, cMasks, blockSize, 5)
  const col6 = checkCollision(x, y, cMasks, blockSize, 6)
  const col7 = checkCollision(x, y, cMasks, blockSize, 7)
  const allCol = (col0 && col1 && col2 && col3 && col4 && col5 && col6 && col7)

  // moves hero out of collision
  if (!col0 || !col7) {
      x += .4
      xVel = 0
  }
  if (!col1 || !col2) {
    y += .4
    yVel = 0
  }
  if (!col3 || !col4) {
    x -= .4
    xVel = 0
  }
  if (!col5 || !col6) {
    y -= .4
    yVel = 0
  }


  // if shift/dash is active increase the max velocity and add a boost to acceleration
  if (keys.Shift.pressed && currentStam > 0) {
    spriteAnimSpeed = 2
    maxVel = boostMaxVel
    dashBoost = topDashBoost
    // drains stamina if dash is active and there is directional input
    if (currentStam > 0 && (keys.ArrowDown.pressed || keys.ArrowUp.pressed || keys.ArrowRight.pressed || keys.ArrowLeft.pressed)) {
      currentStam = currentStam - .1
    }
  } else {
    maxVel = baseMaxVel
    dashBoost = 0
    spriteAnimSpeed = baseAnimSpeed
  }

  // if x or y velocity is higher than the current maxVel this brings it back down
  // this handles deceleration when dash is deactivated
  if (xVel > maxVel) {
    xVel = xVel - rateDecel
  }
  if (xVel < -maxVel) {
    xVel = xVel + rateDecel
  }
  if (yVel > maxVel) {
    yVel = yVel - rateDecel
  }
  if (yVel < -maxVel) {
    yVel = yVel + rateDecel
  }

  // deceleratorX increments xVel towards 0.
  // activated if there is no directional input
  const deceleratorX = () => {
    if (xVel < 0) {
      if (xVel >= -rateDecel) {
        xVel = 0
      } else {
        xVel = xVel + rateDecel
      }
    }
    if (xVel > 0) {
      if (xVel <= rateDecel) {
        xVel = 0
      } else {
        xVel = xVel - rateDecel
      }
    }
  }

  const deceleratorY = () => {
    if (yVel < 0) {
      if (yVel >= -rateDecel) {
        yVel = 0
      } else {
        yVel = yVel + rateDecel
      }
    }
    if (yVel > 0) {
      if (yVel <= rateDecel) {
        yVel = 0
      } else {
        yVel = yVel - rateDecel
      }
    }
  }


  // if chain to handle all directional inputs and collision
  if (keys.ArrowUp.pressed && keys.ArrowLeft.pressed) {
    // console.log('upleft')
    heroSprite = hero_spritesheets.upleft //sets appropriate sprite for direction of movement
    equipImage = sword_spritesheets.upleft //sets appropriate sprite for direction of movement
    // heroSprite = hero_upleft[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally  - diagScale used to reduce diagonal movement speed
      if (yVel > -maxVel * diagScale) {
        yVel = (yVel - rateAccel - dashBoost) * diagScale
      } else { yVel = -maxVel * diagScale}
      if (xVel > -maxVel * diagScale) {
        xVel = (xVel - rateAccel - dashBoost) * diagScale
      } else { xVel = -maxVel * diagScale}
    } else if (!col0 && !col1) { // if both the forward moving corner detectors collide reverse both x and y velocity
      xVel = -xVel * bounce
      yVel = -yVel * bounce
    } else if (!col1 || !col2) { // if either top corners collide reverse y velocity but allow x movement
      yVel = -yVel * bounce
      if (xVel > -maxVel * diagScale) {
        xVel = (xVel - rateAccel - dashBoost) * diagScale
      } else { xVel = -maxVel * diagScale}
    } else if (!col0 || !col7) { // if either side corners collide reverse x velocity but allow y movement
      xVel = -xVel * bounce
      if (yVel > -maxVel * diagScale) {
        yVel = (yVel - rateAccel - dashBoost) * diagScale
      } else { yVel = -maxVel * diagScale}
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (yVel > -maxVel * diagScale) {
        yVel = (yVel - rateAccel - dashBoost) * diagScale
      } else { yVel = -maxVel * diagScale}
      if (xVel > -maxVel * diagScale) {
        xVel = (xVel - rateAccel - dashBoost) * diagScale
      } else { xVel = -maxVel * diagScale}
    }
  } else if (keys.ArrowUp.pressed && keys.ArrowRight.pressed) {
    // console.log('upright')

    heroSprite = hero_spritesheets.upright //sets appropriate sprite for direction of movement
    equipImage = sword_spritesheets.upright
    // heroSprite = hero_upright[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally - diagScale used to reduce diagonal movement speed
      if (yVel > -maxVel * diagScale) {
        yVel = (yVel - rateAccel - dashBoost) * diagScale
      } else { yVel = -maxVel * diagScale}
      if (xVel < maxVel * diagScale) {
        xVel = (xVel + rateAccel + dashBoost) * diagScale
      } else { xVel = maxVel * diagScale}
    } else if (!col2 && !col3) { // if both the forward moving corner detectors collide reverse both x and y velocity
      xVel = -xVel * bounce
      yVel = -yVel * bounce
    } else if (!col1 || !col2) { // if either top corners collide reverse y velocity but allow x movement
      yVel = -yVel * bounce
      if (xVel < maxVel * diagScale) {
        xVel = (xVel + rateAccel + dashBoost) * diagScale
      } else { xVel = maxVel * diagScale}
    } else if (!col3 || !col4) { // if either side corners collide reverse x velocity but allow y movement
      xVel = -xVel * bounce
      if (yVel > -maxVel * diagScale) {
        yVel = (yVel - rateAccel - dashBoost) * diagScale
      } else { yVel = -maxVel * diagScale}
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (yVel > -maxVel * diagScale) {
        yVel = (yVel - rateAccel - dashBoost) * diagScale
      } else { yVel = -maxVel * diagScale}
      if (xVel < maxVel * diagScale) {
        xVel = (xVel + rateAccel + dashBoost) * diagScale
      } else { xVel = maxVel * diagScale}
    }
  } else if (keys.ArrowDown.pressed && keys.ArrowLeft.pressed) {
    // console.log('downleft')

    heroSprite = hero_spritesheets.downleft //sets appropriate sprite for direction of movement
    equipImage = sword_spritesheets.downleft
    // heroSprite = hero_downleft[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally  - diagScale used to reduce diagonal movement speed
      if (yVel < maxVel * diagScale) {
        yVel = (yVel + rateAccel + dashBoost) * diagScale
      } else { yVel = maxVel * diagScale}
      if (xVel > -maxVel * diagScale) {
        xVel = (xVel - rateAccel - dashBoost) * diagScale
      } else { xVel = -maxVel * diagScale}
    } else if (!col6 && !col7) { // if both the forward moving corner detectors collide reverse both x and y velocity
      xVel = -xVel * bounce
      yVel = -yVel * bounce
    } else if (!col5 || !col6) { // if either bottom corners collide reverse y velocity but allow x movement
      yVel = -yVel * bounce
      if (xVel > -maxVel * diagScale) {
        xVel = (xVel - rateAccel - dashBoost) * diagScale
      } else { xVel = -maxVel * diagScale}
    } else if (!col0 || !col7) { // if either side corners collide reverse x velocity but allow x movement
      xVel = -xVel * bounce
      if (yVel < maxVel * diagScale) {
        yVel = (yVel + rateAccel + dashBoost) * diagScale
      } else { yVel = maxVel * diagScale}
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (yVel < maxVel * diagScale) {
        yVel = (yVel + rateAccel + dashBoost) * diagScale
      } else { yVel = maxVel * diagScale}
      if (xVel > -maxVel * diagScale) {
        xVel = (xVel - rateAccel - dashBoost) * diagScale
      } else { xVel = -maxVel * diagScale}
    }
  } else if (keys.ArrowDown.pressed && keys.ArrowRight.pressed) {
    // console.log('downright')

    heroSprite = hero_spritesheets.downright //sets appropriate sprite for direction of movement
    equipImage = sword_spritesheets.downright
    // heroSprite = hero_downright[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally  - diagScale used to reduce diagonal movement speed
      if (yVel < maxVel * diagScale) {
        yVel = (yVel + rateAccel + dashBoost) * diagScale
      } else { yVel = maxVel * diagScale}
      if (xVel < maxVel * diagScale) {
        xVel = (xVel + rateAccel + dashBoost) * diagScale
      } else { xVel = maxVel * diagScale}
    } else if (!col4 && !col5) { // if both the forward moving corner detectors collide reverse both x and y velocity
      xVel = -xVel * bounce
      yVel = -yVel * bounce
    } else if (!col5 || !col6) { // if either bottom corners collide reverse y velocity but allow x movement
      yVel = -yVel * bounce
      if (xVel < maxVel * diagScale) {
        xVel = (xVel + rateAccel + dashBoost) * diagScale
      } else { xVel = maxVel * diagScale}
    } else if (!col3 || !col4) { // if either side corners collide reverse x velocity but allow y movement
      xVel = -xVel * bounce
      if (yVel < maxVel * diagScale) {
        yVel = (yVel + rateAccel + dashBoost) * diagScale
      } else { yVel = maxVel * diagScale}
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (yVel < maxVel * diagScale) {
        yVel = (yVel + rateAccel + dashBoost) * diagScale
      } else { yVel = maxVel * diagScale}
      if (xVel < maxVel * diagScale) {
        xVel = (xVel + rateAccel + dashBoost) * diagScale
      } else { xVel = maxVel * diagScale}
    }
  } else if (keys.ArrowUp.pressed) {
    // console.log('up')

    heroSprite = hero_spritesheets.up //sets appropriate sprite for direction of movement
    equipImage = sword_spritesheets.up
    // heroSprite = hero_up[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally
      if (yVel > -maxVel) {
        yVel = yVel - rateAccel - dashBoost
      }
      // xVel = 0
      deceleratorX()
    } else if (!col1 || !col2) { // if either detector on forward moving side collides reverse the velocity
      yVel = -yVel * bounce
      // xVel = 0
      deceleratorX()
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (yVel > -maxVel) {
        yVel = yVel - rateAccel - dashBoost
      }
      // xVel = 0
      deceleratorX()
    }
  } else if (keys.ArrowDown.pressed) {
    // console.log('down')

    heroSprite = hero_spritesheets.down //sets appropriate sprite for direction of movement
    equipImage = sword_spritesheets.down
    // heroSprite = hero_down[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally
      if (yVel < maxVel) {
        yVel = yVel + rateAccel + dashBoost
      }
      // xVel = 0
      deceleratorX()
    } else if (!col5 || !col6) { // if either detector on forward moving side collides reverse the velocity
      yVel = -yVel * bounce
      // xVel = 0
      deceleratorX()
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (yVel < maxVel) {
        yVel = yVel + rateAccel + dashBoost
      }
      // xVel = 0
      deceleratorX()
    }
  } else if (keys.ArrowLeft.pressed) {
    // console.log('left')

    heroSprite = hero_spritesheets.left //sets appropriate sprite for direction of movement
    equipImage = sword_spritesheets.left
    // heroSprite = hero_left[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally
      if (xVel > -maxVel) {
        xVel = xVel - rateAccel - dashBoost
      }
      // yVel = 0
      deceleratorY()
    } else if (!col0 || !col7) { // if either detector on forward moving side collides reverse the velocity
      xVel = -xVel * bounce
      // yVel = 0
      deceleratorY()
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (xVel > -maxVel) {
        xVel = xVel - rateAccel - dashBoost
      }
      deceleratorY()
      // yVel = 0
    }
  } else if (keys.ArrowRight.pressed) {
    // console.log('right')

    heroSprite = hero_spritesheets.right //sets appropriate sprite for direction of movement
    equipImage = sword_spritesheets.right
    // heroSprite = hero_right[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally
      if (xVel < maxVel) {
        xVel = xVel + rateAccel + dashBoost
      }
      deceleratorY()
      // yVel = 0
    } else if (!col3 || !col4) { // if either detector on forward moving side collides reverse the velocity
      xVel = -xVel * bounce
      deceleratorY()
      // yVel = 0
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (xVel < maxVel) {
        xVel = xVel + rateAccel + dashBoost
      }
      deceleratorY()
      // yVel = 0
    }
  } else {
    // reduces velocity back to zero for x and y every frame that input is not given
    deceleratorX()
    deceleratorY()
  }



// sets moveObj x and y coordinates based on current xVel and yVel values
// rounding forces the x and y coordinates to be
// whole integers since sub pixel accuracy is not needed


x = Math.round(x + xVel)
y = Math.round(y + yVel)



  // iterates through the sprite sheet images to animate sprite - spriteAnimSpeed sets how fast this happens
  if (keysPressed){
    if (spriteAnimCounter >= spriteAnimSpeed) {
      heroCropX += heroSpriteSize
      // spriteIndex++
      if (heroCropX > heroSpriteSize * 6) {
        heroCropX = heroSpriteSize
        // spriteIndex = 1
      }
      // if (spriteIndex > 6) {
      //   spriteIndex = 1
      // }
      spriteAnimCounter = 0
    }
    spriteAnimCounter++
  }



  if (!keysPressed) {
    if (xVel < 0 && yVel < 0) {
      heroCropX = 0
      heroSprite = hero_spritesheets.upleft //sets appropriate sprite for direction of movement
      equipImage = sword_spritesheets.upleft
      // heroSprite = hero_upleft[0] //sets appropriate sprite for direction of movement
    } else if (xVel < 0 && yVel > 0) {
      heroCropX = 0
      heroSprite = hero_spritesheets.downleft
      equipImage = sword_spritesheets.downleft
      // heroSprite = hero_downleft[0]
    } else if (xVel > 0 && yVel > 0) {
      heroCropX = 0
      heroSprite = hero_spritesheets.downright
      equipImage = sword_spritesheets.downright
      // heroSprite = hero_downright[0]
    } else if (xVel > 0 && yVel < 0) {
      heroCropX = 0
      heroSprite = hero_spritesheets.upright
      equipImage = sword_spritesheets.upright
      // heroSprite = hero_upright[0]
    } else if (xVel < 0 ) {
      heroCropX = 0
      heroSprite = hero_spritesheets.left
      equipImage = sword_spritesheets.left
      // heroSprite = hero_left[0]
    } else if (xVel > 0 ) {
      heroCropX = 0
      heroSprite = hero_spritesheets.right
      equipImage = sword_spritesheets.right
      // heroSprite = hero_right[0]
    } else if (yVel < 0 ) {
      heroCropX = 0
      heroSprite = hero_spritesheets.up
      equipImage = sword_spritesheets.up
      // heroSprite = hero_up[0]
    } else if (yVel > 0 ) {
      heroCropX = 0
      heroSprite = hero_spritesheets.down
      equipImage = sword_spritesheets.down
      // heroSprite = hero_down[0]
    }
  }


    if (xVel < 0 && yVel < 0) {
      heroDirection = 'upleft'
    } else if (xVel < 0 && yVel > 0) {
      heroDirection = 'downleft'
    } else if (xVel > 0 && yVel > 0) {
      heroDirection = 'downright'
    } else if (xVel > 0 && yVel < 0) {
      heroDirection = 'upright'
    } else if (xVel < 0 ) {
      heroDirection = 'left'
    } else if (xVel > 0 ) {
      heroDirection = 'right'
    } else if (yVel < 0 ) {
      heroDirection = 'up'
    } else if (yVel > 0 ) {
      heroDirection = 'down'
    }




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
      blockSize,
      heroSprite,
      equipImage,
      heroSpriteSize,
      heroCropX,
      heroCropY,
      heroDirection
    }
  )
}

// checkCollision checks if x,y coordinates are inside one of the collision masks in cMask
// returns false if there is a collision and true if there is not
const checkCollision = (x, y, cMasks, blockSize, corner) => {
  const colBuffer = 4 // number of pixels away from hero that detectors sit
  const horzBuffer = 20
  const vertBuffer = 12
  const heroColBox = [
    // array of coordinates for all detectors of hero object
    [horzBuffer, colBuffer + vertBuffer * 2],
    [colBuffer + horzBuffer, vertBuffer * 2],
    [blockSize - colBuffer - horzBuffer, vertBuffer * 2],
    [blockSize - horzBuffer, colBuffer + vertBuffer * 2],
    [blockSize - horzBuffer, blockSize - colBuffer - vertBuffer],
    [blockSize - colBuffer - horzBuffer, blockSize - vertBuffer],
    [colBuffer + horzBuffer, blockSize - vertBuffer],
    [horzBuffer, blockSize - colBuffer - vertBuffer]
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

export default moveEngine
