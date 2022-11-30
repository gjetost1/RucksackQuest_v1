import { hero_spritesheets, sword_spritesheets } from './spriteRef'
import pixelPerfect from './PixelPerfect'
import baseHero from './BaseHero'
import globalVars from "./GlobalVars"
import checkCollision from './CheckCollision'

const baseAnimSpeed = 2
let spriteAnimSpeed = baseAnimSpeed // after how many frames the sprite frame will progress for walking animation
let spriteAnimCounter = 0 // increments to trigger render of next animation frame

const colBuffer = 5 // number of pixels away from hero that detectors sit
const horzBuffer = 16
const vertBuffer = 12
const blockSize = globalVars.blockSize

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
//   [horzBuffer, colBuffer + vertBuffer * 2],
//   [colBuffer + horzBuffer, vertBuffer * 2],
//   [blockSize - colBuffer - horzBuffer, vertBuffer * 2],
//   [blockSize - horzBuffer, colBuffer + vertBuffer * 2],
//   [blockSize - horzBuffer, blockSize - colBuffer - vertBuffer + (globalVars.upscale * 2)],
//   [blockSize - colBuffer - horzBuffer, blockSize - vertBuffer  + (globalVars.upscale * 2)],
//   [colBuffer + horzBuffer, blockSize - vertBuffer  + (globalVars.upscale * 2)],
//   [horzBuffer, blockSize - colBuffer - vertBuffer  + (globalVars.upscale * 2)]
// ]

const moveEngine = (baseHero, cMasks, blockSize, collisionCtx) => {
  if (!baseHero) return


  // keysPressed is true if any directional input was given this frame, otherwise false.
  const keysPressed = (baseHero.keys.ArrowUp.pressed || baseHero.keys.ArrowDown.pressed || baseHero.keys.ArrowLeft.pressed || baseHero.keys.ArrowRight.pressed)
  const bounce = 1 // this var multiplies force of rebound on collision, should probably put this in moveObj eventually
  const diagScale = .5 // this var multiplies/reduces the speed of diagonal movement since it is different than horz and vert movement



  // imgData checks the collision canvas around the hero in a 64 x 64 pixel grid. getImageData.data contains an array with all color and alpha values
  // we can use this to see if the collision canvas is transparent or not, and also check for specific colors
  // this is fed to the collision detector function with an array of the pixel coordinates we want to check.
  // heroColBox above is an example of the format for this, but pretty much it is sub-arrays with [x, y] coordinates
  const imgData = collisionCtx.getImageData(baseHero.bounceX, baseHero.bounceY, baseHero.bounceX + globalVars.blockSize, baseHero.bounceY + globalVars.blockSize)

  console.log(baseHero.bounceX, baseHero.bounceY)

  // get boolean values for each detector of hero hitbox (heroColBox)
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

  let col0 = checkCollision(imgData, heroColBox, 0)
  let col1 = checkCollision(imgData, heroColBox, 1)
  let col2 = checkCollision(imgData, heroColBox, 2)
  let col3 = checkCollision(imgData, heroColBox, 3)
  let col4 = checkCollision(imgData, heroColBox, 4)
  let col5 = checkCollision(imgData, heroColBox, 5)
  let col6 = checkCollision(imgData, heroColBox, 6)
  let col7 = checkCollision(imgData, heroColBox, 7)
  let allCol = (col0 && col1 && col2 && col3 && col4 && col5 && col6 && col7)

  // console.log(col1, col2)

  // if (imgData.data[0] === 128 && imgData.data[1] === 32 && imgData.data[2] === 32 && imgData.data[3] === 255) {
  //   col1 = false
  //   col2 = false
  //   console.log('collision', col1, col2)
  // }

  // moves hero out of collision
  const moveAmount = 8

  if (baseHero.bounceX !== globalVars.heroCenterX || baseHero.bounceY !== globalVars.heroCenterY) {
    if (baseHero.bounceX < globalVars.heroCenterX) {
      baseHero.bounceX = baseHero.bounceX + moveAmount / 3
      // console.log(baseHero.bounceX, globalVars.heroCenterX)
    }
    if (baseHero.bounceX > globalVars.heroCenterX) {
      baseHero.bounceX = baseHero.bounceX - moveAmount  / 3
      console.log('off')

    }
    if (baseHero.bounceY < globalVars.heroCenterY) {
      baseHero.bounceY = baseHero.bounceY + moveAmount / 3
      console.log('off')

    }
    if (baseHero.bounceY > globalVars.heroCenterY) {
      baseHero.bounceY = baseHero.bounceY - moveAmount / 3

      console.log('off')
    }
  }

  // if (baseHero.bounceX !== globalVars.heroCenterX) {
  //   baseHero.bounceX = globalVars.heroCenterX
  // }
  // if (baseHero.bounceY !== globalVars.heroCenterY) {
  //   baseHero.bounceY = globalVars.heroCenterY
  // }





  // if (!col0 || !col7) {
  //   baseHero.x += moveAmount
  //   // baseHero.xVel = 0
  // }
  // if (!col1 || !col2) {
  //   baseHero.y += moveAmount
  //   // baseHero.yVel = 0
  // }
  // if (!col3 || !col4) {
  //   baseHero.x -= moveAmount
  //   // baseHero.xVel = 0
  // }
  // if (!col5 || !col6) {
  //   baseHero.y -= moveAmount
  //   // baseHero.yVel = 0
  // }
  if (baseHero.keys.ArrowLeft.pressed && !col0 && col7) {
    baseHero.bounceY += moveAmount
    // baseHero.y += moveAmount
    // baseHero.yVel = 0
  }
  if (baseHero.keys.ArrowLeft.pressed && col0 && !col7) {
    baseHero.bounceY -= moveAmount
    // baseHero.y -= moveAmount
    // baseHero.yVel = 0
  }
  if (baseHero.keys.ArrowUp.pressed && !col1 && col2) {
    baseHero.bounceX += moveAmount
    // baseHero.x += moveAmount
    // baseHero.xVel = 0
  }
  if (baseHero.keys.ArrowUp.pressed && col1 && !col2) {
    baseHero.bounceX -= moveAmount
    // baseHero.x -= moveAmount
    // baseHero.xVel = 0
  }
  if (baseHero.keys.ArrowRight.pressed && !col3 && col4) {
    baseHero.bounceY += moveAmount
    // baseHero.y += moveAmount
    // baseHero.yVel = 0
  }
  if (baseHero.keys.ArrowRight.pressed && col3 && !col4) {
    baseHero.bounceY -= moveAmount
    // baseHero.y -= moveAmount
    // baseHero.yVel = 0
  }
  if (baseHero.keys.ArrowDown.pressed && !col5 && col6) {
    baseHero.bounceX -= moveAmount
    // baseHero.x -= moveAmount
    // baseHero.xVel = 0
  }
  if (baseHero.keys.ArrowDown.pressed && col5 && !col6) {
    baseHero.bounceX += moveAmount
    // baseHero.x += moveAmount

    // baseHero.xVel = 0
  }

  baseHero.bounceX = pixelPerfect(Math.round(baseHero.bounceX), baseHero.heroDirection, 'x', globalVars.upscale)
  baseHero.bounceY = pixelPerfect(Math.round(baseHero.bounceY), baseHero.heroDirection, 'y', globalVars.upscale)


  // if shift/dash is active increase the max velocity and add a boost to acceleration
  if (baseHero.keys.Shift.pressed && baseHero.currentStam > 0) {
    spriteAnimSpeed = 1.9
    baseHero.maxVel = baseHero.maxVel
    baseHero.dashBoost = baseHero.topDashBoost
    baseHero.moveSpeed = 80
    // drains stamina if dash is active and there is directional input
    if (baseHero.currentStam > 0 && keysPressed) {
      baseHero.currentStam = baseHero.currentStam - .01
    }
  } else {
    baseHero.maxVel = baseHero.baseMaxVel
    baseHero.dashBoost = 0
    spriteAnimSpeed = baseAnimSpeed
    baseHero.moveSpeed = baseHero.baseMoveSpeed
    // regenerates stamina
    if (baseHero.currentStam < baseHero.maxStam) {
      baseHero.currentStam = baseHero.currentStam + 1
    } else {
      baseHero.currentStam = baseHero.maxStam
    }
  }

  // if baseHero.x or baseHero.y velocity is higher than the current baseHero.maxVel this brings it back down
  // this handles deceleration when dash is deactivated
  if (baseHero.xVel > baseHero.maxVel) {
    baseHero.xVel = baseHero.xVel - baseHero.rateDecel
  }
  if (baseHero.xVel < -baseHero.maxVel) {
    baseHero.xVel = baseHero.xVel + baseHero.rateDecel
  }
  if (baseHero.yVel > baseHero.maxVel) {
    baseHero.yVel = baseHero.yVel - baseHero.rateDecel
  }
  if (baseHero.yVel < -baseHero.maxVel) {
    baseHero.yVel = baseHero.yVel + baseHero.rateDecel
  }

  // deceleratorX increments baseHero.xVel towards 0.
  // activated if there is no directional input
  const deceleratorX = () => {
    if (baseHero.xVel < 0) {
      if (baseHero.xVel >= -baseHero.rateDecel) {
        baseHero.xVel = 0
      } else {
        baseHero.xVel = baseHero.xVel + baseHero.rateDecel
      }
    }
    if (baseHero.xVel > 0) {
      if (baseHero.xVel <= baseHero.rateDecel) {
        baseHero.xVel = 0
      } else {
        baseHero.xVel = baseHero.xVel - baseHero.rateDecel
      }
    }
  }

  const deceleratorY = () => {
    if (baseHero.yVel < 0) {
      if (baseHero.yVel >= -baseHero.rateDecel) {
        baseHero.yVel = 0
      } else {
        baseHero.yVel = baseHero.yVel + baseHero.rateDecel
      }
    }
    if (baseHero.yVel > 0) {
      if (baseHero.yVel <= baseHero.rateDecel) {
        baseHero.yVel = 0
      } else {
        baseHero.yVel = baseHero.yVel - baseHero.rateDecel
      }
    }
  }


  // if chain to handle all directional inputs and collision
  if (baseHero.keys.ArrowUp.pressed && baseHero.keys.ArrowLeft.pressed) {
    // console.log('upleft')
    baseHero.heroSprite = hero_spritesheets.upleft //sets appropriate sprite for direction of movement
    baseHero.swordSpriteSheet = sword_spritesheets.upleft //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally  - diagScale used to reduce diagonal movement speed
      if (baseHero.yVel > -baseHero.maxVel * diagScale) {
        baseHero.yVel = (baseHero.yVel - baseHero.rateAccel - baseHero.dashBoost) * diagScale
      } else { baseHero.yVel = -baseHero.maxVel * diagScale}
      if (baseHero.xVel > -baseHero.maxVel * diagScale) {
        baseHero.xVel = (baseHero.xVel - baseHero.rateAccel - baseHero.dashBoost) * diagScale
      } else { baseHero.xVel = -baseHero.maxVel * diagScale}
    } else if (!col0 && !col1) { // if both the forward moving corner detectors collide reverse both baseHero.x and baseHero.y velocity
      baseHero.xVel = -baseHero.xVel * bounce
      baseHero.yVel = -baseHero.yVel * bounce
    } else if (!col1 || !col2) { // if either top corners collide reverse baseHero.y velocity but allow baseHero.x movement
      baseHero.yVel = -baseHero.yVel * bounce
      if (baseHero.xVel > -baseHero.maxVel * diagScale) {
        baseHero.xVel = (baseHero.xVel - baseHero.rateAccel - baseHero.dashBoost) * diagScale
      } else { baseHero.xVel = -baseHero.maxVel * diagScale}
    } else if (!col0 || !col7) { // if either side corners collide reverse baseHero.x velocity but allow baseHero.y movement
      baseHero.xVel = -baseHero.xVel * bounce
      if (baseHero.yVel > -baseHero.maxVel * diagScale) {
        baseHero.yVel = (baseHero.yVel - baseHero.rateAccel - baseHero.dashBoost) * diagScale
      } else { baseHero.yVel = -baseHero.maxVel * diagScale}
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (baseHero.yVel > -baseHero.maxVel * diagScale) {
        baseHero.yVel = (baseHero.yVel - baseHero.rateAccel - baseHero.dashBoost) * diagScale
      } else { baseHero.yVel = -baseHero.maxVel * diagScale}
      if (baseHero.xVel > -baseHero.maxVel * diagScale) {
        baseHero.xVel = (baseHero.xVel - baseHero.rateAccel - baseHero.dashBoost) * diagScale
      } else { baseHero.xVel = -baseHero.maxVel * diagScale}
    }
  } else if (baseHero.keys.ArrowUp.pressed && baseHero.keys.ArrowRight.pressed) {
    // console.log('upright')

    baseHero.heroSprite = hero_spritesheets.upright //sets appropriate sprite for direction of movement
    baseHero.swordSpriteSheet = sword_spritesheets.upright
    // baseHero.heroSprite = hero_upright[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally - diagScale used to reduce diagonal movement speed
      if (baseHero.yVel > -baseHero.maxVel * diagScale) {
        baseHero.yVel = (baseHero.yVel - baseHero.rateAccel - baseHero.dashBoost) * diagScale
      } else { baseHero.yVel = -baseHero.maxVel * diagScale}
      if (baseHero.xVel < baseHero.maxVel * diagScale) {
        baseHero.xVel = (baseHero.xVel + baseHero.rateAccel + baseHero.dashBoost) * diagScale
      } else { baseHero.xVel = baseHero.maxVel * diagScale}
    } else if (!col2 && !col3) { // if both the forward moving corner detectors collide reverse both baseHero.x and baseHero.y velocity
      baseHero.xVel = -baseHero.xVel * bounce
      baseHero.yVel = -baseHero.yVel * bounce
    } else if (!col1 || !col2) { // if either top corners collide reverse baseHero.y velocity but allow baseHero.x movement
      baseHero.yVel = -baseHero.yVel * bounce
      if (baseHero.xVel < baseHero.maxVel * diagScale) {
        baseHero.xVel = (baseHero.xVel + baseHero.rateAccel + baseHero.dashBoost) * diagScale
      } else { baseHero.xVel = baseHero.maxVel * diagScale}
    } else if (!col3 || !col4) { // if either side corners collide reverse baseHero.x velocity but allow baseHero.y movement
      baseHero.xVel = -baseHero.xVel * bounce
      if (baseHero.yVel > -baseHero.maxVel * diagScale) {
        baseHero.yVel = (baseHero.yVel - baseHero.rateAccel - baseHero.dashBoost) * diagScale
      } else { baseHero.yVel = -baseHero.maxVel * diagScale}
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (baseHero.yVel > -baseHero.maxVel * diagScale) {
        baseHero.yVel = (baseHero.yVel - baseHero.rateAccel - baseHero.dashBoost) * diagScale
      } else { baseHero.yVel = -baseHero.maxVel * diagScale}
      if (baseHero.xVel < baseHero.maxVel * diagScale) {
        baseHero.xVel = (baseHero.xVel + baseHero.rateAccel + baseHero.dashBoost) * diagScale
      } else { baseHero.xVel = baseHero.maxVel * diagScale}
    }
  } else if (baseHero.keys.ArrowDown.pressed && baseHero.keys.ArrowLeft.pressed) {
    // console.log('downleft')

    baseHero.heroSprite = hero_spritesheets.downleft //sets appropriate sprite for direction of movement
    baseHero.swordSpriteSheet = sword_spritesheets.downleft
    // baseHero.heroSprite = hero_downleft[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally  - diagScale used to reduce diagonal movement speed
      if (baseHero.yVel < baseHero.maxVel * diagScale) {
        baseHero.yVel = (baseHero.yVel + baseHero.rateAccel + baseHero.dashBoost) * diagScale
      } else { baseHero.yVel = baseHero.maxVel * diagScale}
      if (baseHero.xVel > -baseHero.maxVel * diagScale) {
        baseHero.xVel = (baseHero.xVel - baseHero.rateAccel - baseHero.dashBoost) * diagScale
      } else { baseHero.xVel = -baseHero.maxVel * diagScale}
    } else if (!col6 && !col7) { // if both the forward moving corner detectors collide reverse both baseHero.x and baseHero.y velocity
      baseHero.xVel = -baseHero.xVel * bounce
      baseHero.yVel = -baseHero.yVel * bounce
    } else if (!col5 || !col6) { // if either bottom corners collide reverse baseHero.y velocity but allow baseHero.x movement
      baseHero.yVel = -baseHero.yVel * bounce
      if (baseHero.xVel > -baseHero.maxVel * diagScale) {
        baseHero.xVel = (baseHero.xVel - baseHero.rateAccel - baseHero.dashBoost) * diagScale
      } else { baseHero.xVel = -baseHero.maxVel * diagScale}
    } else if (!col0 || !col7) { // if either side corners collide reverse baseHero.x velocity but allow baseHero.x movement
      baseHero.xVel = -baseHero.xVel * bounce
      if (baseHero.yVel < baseHero.maxVel * diagScale) {
        baseHero.yVel = (baseHero.yVel + baseHero.rateAccel + baseHero.dashBoost) * diagScale
      } else { baseHero.yVel = baseHero.maxVel * diagScale}
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (baseHero.yVel < baseHero.maxVel * diagScale) {
        baseHero.yVel = (baseHero.yVel + baseHero.rateAccel + baseHero.dashBoost) * diagScale
      } else { baseHero.yVel = baseHero.maxVel * diagScale}
      if (baseHero.xVel > -baseHero.maxVel * diagScale) {
        baseHero.xVel = (baseHero.xVel - baseHero.rateAccel - baseHero.dashBoost) * diagScale
      } else { baseHero.xVel = -baseHero.maxVel * diagScale}
    }
  } else if (baseHero.keys.ArrowDown.pressed && baseHero.keys.ArrowRight.pressed) {
    // console.log('downright')

    baseHero.heroSprite = hero_spritesheets.downright //sets appropriate sprite for direction of movement
    baseHero.swordSpriteSheet = sword_spritesheets.downright
    // baseHero.heroSprite = hero_downright[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally  - diagScale used to reduce diagonal movement speed
      if (baseHero.yVel < baseHero.maxVel * diagScale) {
        baseHero.yVel = (baseHero.yVel + baseHero.rateAccel + baseHero.dashBoost) * diagScale
      } else { baseHero.yVel = baseHero.maxVel * diagScale}
      if (baseHero.xVel < baseHero.maxVel * diagScale) {
        baseHero.xVel = (baseHero.xVel + baseHero.rateAccel + baseHero.dashBoost) * diagScale
      } else { baseHero.xVel = baseHero.maxVel * diagScale}
    } else if (!col4 && !col5) { // if both the forward moving corner detectors collide reverse both baseHero.x and baseHero.y velocity
      baseHero.xVel = -baseHero.xVel * bounce
      baseHero.yVel = -baseHero.yVel * bounce
    } else if (!col5 || !col6) { // if either bottom corners collide reverse baseHero.y velocity but allow baseHero.x movement
      baseHero.yVel = -baseHero.yVel * bounce
      if (baseHero.xVel < baseHero.maxVel * diagScale) {
        baseHero.xVel = (baseHero.xVel + baseHero.rateAccel + baseHero.dashBoost) * diagScale
      } else { baseHero.xVel = baseHero.maxVel * diagScale}
    } else if (!col3 || !col4) { // if either side corners collide reverse baseHero.x velocity but allow baseHero.y movement
      baseHero.xVel = -baseHero.xVel * bounce
      if (baseHero.yVel < baseHero.maxVel * diagScale) {
        baseHero.yVel = (baseHero.yVel + baseHero.rateAccel + baseHero.dashBoost) * diagScale
      } else { baseHero.yVel = baseHero.maxVel * diagScale}
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (baseHero.yVel < baseHero.maxVel * diagScale) {
        baseHero.yVel = (baseHero.yVel + baseHero.rateAccel + baseHero.dashBoost) * diagScale
      } else { baseHero.yVel = baseHero.maxVel * diagScale}
      if (baseHero.xVel < baseHero.maxVel * diagScale) {
        baseHero.xVel = (baseHero.xVel + baseHero.rateAccel + baseHero.dashBoost) * diagScale
      } else { baseHero.xVel = baseHero.maxVel * diagScale}
    }
  } else if (baseHero.keys.ArrowUp.pressed) {
    // console.log('up')

    baseHero.heroSprite = hero_spritesheets.up //sets appropriate sprite for direction of movement
    baseHero.swordSpriteSheet = sword_spritesheets.up
    // baseHero.heroSprite = hero_up[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally
      if (baseHero.yVel > -baseHero.maxVel) {
        baseHero.yVel = baseHero.yVel - baseHero.rateAccel - baseHero.dashBoost
      }
      // baseHero.xVel = 0
      deceleratorX()
    } else if (!col1 || !col2) { // if either detector on forward moving side collides reverse the velocity
      baseHero.yVel = -baseHero.yVel * bounce
      // baseHero.xVel = 0
      deceleratorX()
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (baseHero.yVel > -baseHero.maxVel) {
        baseHero.yVel = baseHero.yVel - baseHero.rateAccel - baseHero.dashBoost
      }
      // baseHero.xVel = 0
      deceleratorX()
    }
  } else if (baseHero.keys.ArrowDown.pressed) {
    // console.log('down')

    baseHero.heroSprite = hero_spritesheets.down //sets appropriate sprite for direction of movement
    baseHero.swordSpriteSheet = sword_spritesheets.down
    // baseHero.heroSprite = hero_down[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally
      if (baseHero.yVel < baseHero.maxVel) {
        baseHero.yVel = baseHero.yVel + baseHero.rateAccel + baseHero.dashBoost
      }
      // baseHero.xVel = 0
      deceleratorX()
    } else if (!col5 || !col6) { // if either detector on forward moving side collides reverse the velocity
      baseHero.yVel = -baseHero.yVel * bounce
      // baseHero.xVel = 0
      deceleratorX()
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (baseHero.yVel < baseHero.maxVel) {
        baseHero.yVel = baseHero.yVel + baseHero.rateAccel + baseHero.dashBoost
      }
      // baseHero.xVel = 0
      deceleratorX()
    }
  } else if (baseHero.keys.ArrowLeft.pressed) {
    // console.log('left')

    baseHero.heroSprite = hero_spritesheets.left //sets appropriate sprite for direction of movement
    baseHero.swordSpriteSheet = sword_spritesheets.left
    // baseHero.heroSprite = hero_left[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally
      if (baseHero.xVel > -baseHero.maxVel) {
        baseHero.xVel = baseHero.xVel - baseHero.rateAccel - baseHero.dashBoost
      }
      // baseHero.yVel = 0
      deceleratorY()
    } else if (!col0 || !col7) { // if either detector on forward moving side collides reverse the velocity
      baseHero.xVel = -baseHero.xVel * bounce
      // baseHero.yVel = 0
      deceleratorY()
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (baseHero.xVel > -baseHero.maxVel) {
        baseHero.xVel = baseHero.xVel - baseHero.rateAccel - baseHero.dashBoost
      }
      deceleratorY()
      // baseHero.yVel = 0
    }
  } else if (baseHero.keys.ArrowRight.pressed) {
    // console.log('right')

    baseHero.heroSprite = hero_spritesheets.right //sets appropriate sprite for direction of movement
    baseHero.swordSpriteSheet = sword_spritesheets.right
    // baseHero.heroSprite = hero_right[spriteIndex] //sets appropriate sprite for direction of movement

    if (allCol) { // if no collisions move normally
      if (baseHero.xVel < baseHero.maxVel) {
        baseHero.xVel = baseHero.xVel + baseHero.rateAccel + baseHero.dashBoost
      }
      deceleratorY()
      // baseHero.yVel = 0
    } else if (!col3 || !col4) { // if either detector on forward moving side collides reverse the velocity
      baseHero.xVel = -baseHero.xVel * bounce
      deceleratorY()
      // baseHero.yVel = 0
    } else { // catchall to make sure you can still move in unforseen collision instances
      if (baseHero.xVel < baseHero.maxVel) {
        baseHero.xVel = baseHero.xVel + baseHero.rateAccel + baseHero.dashBoost
      }
      deceleratorY()
      // baseHero.yVel = 0
    }
  } else {
    // reduces velocity back to zero for baseHero.x and baseHero.y every frame that input is not given
    deceleratorX()
    deceleratorY()
  }



// sets moveObj baseHero.x and baseHero.y coordinates based on current baseHero.xVel and baseHero.yVel values
// rounding forces the baseHero.x and baseHero.y coordinates to be
// whole integers since sub pixel accuracy is not needed


baseHero.x = pixelPerfect(Math.round(baseHero.x + baseHero.xVel), baseHero.heroDirection, 'x', globalVars.upscale)
baseHero.y = pixelPerfect(Math.round(baseHero.y + baseHero.yVel), baseHero.heroDirection, 'y', globalVars.upscale)



// baseHero.x = Math.round(baseHero.x + baseHero.xVel)
// baseHero.y = Math.round(baseHero.y + baseHero.yVel)



  // iterates through the sprite sheet images to animate sprite - spriteAnimSpeed sets how fast this happens
  if (keysPressed){
    if (spriteAnimCounter >= spriteAnimSpeed) {
      baseHero.heroCropX += baseHero.heroSpriteSize
      // spriteIndex++
      if (baseHero.heroCropX > baseHero.heroSpriteSize * 6) {
        baseHero.heroCropX = baseHero.heroSpriteSize
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
    if (baseHero.xVel < 0 && baseHero.yVel < 0) {
      baseHero.heroCropX = 0
      baseHero.heroSprite = hero_spritesheets.upleft //sets appropriate sprite for direction of movement
      baseHero.swordSpriteSheet = sword_spritesheets.upleft
      // baseHero.heroSprite = hero_upleft[0] //sets appropriate sprite for direction of movement
    } else if (baseHero.xVel < 0 && baseHero.yVel > 0) {
      baseHero.heroCropX = 0
      baseHero.heroSprite = hero_spritesheets.downleft
      baseHero.swordSpriteSheet = sword_spritesheets.downleft
      // baseHero.heroSprite = hero_downleft[0]
    } else if (baseHero.xVel > 0 && baseHero.yVel > 0) {
      baseHero.heroCropX = 0
      baseHero.heroSprite = hero_spritesheets.downright
      baseHero.swordSpriteSheet = sword_spritesheets.downright
      // baseHero.heroSprite = hero_downright[0]
    } else if (baseHero.xVel > 0 && baseHero.yVel < 0) {
      baseHero.heroCropX = 0
      baseHero.heroSprite = hero_spritesheets.upright
      baseHero.swordSpriteSheet = sword_spritesheets.upright
      // baseHero.heroSprite = hero_upright[0]
    } else if (baseHero.xVel < 0 ) {
      baseHero.heroCropX = 0
      baseHero.heroSprite = hero_spritesheets.left
      baseHero.swordSpriteSheet = sword_spritesheets.left
      // baseHero.heroSprite = hero_left[0]
    } else if (baseHero.xVel > 0 ) {
      baseHero.heroCropX = 0
      baseHero.heroSprite = hero_spritesheets.right
      baseHero.swordSpriteSheet = sword_spritesheets.right
      // baseHero.heroSprite = hero_right[0]
    } else if (baseHero.yVel < 0 ) {
      baseHero.heroCropX = 0
      baseHero.heroSprite = hero_spritesheets.up
      baseHero.swordSpriteSheet = sword_spritesheets.up
      // baseHero.heroSprite = hero_up[0]
    } else if (baseHero.yVel > 0 ) {
      baseHero.heroCropX = 0
      baseHero.heroSprite = hero_spritesheets.down
      baseHero.swordSpriteSheet = sword_spritesheets.down
      // baseHero.heroSprite = hero_down[0]
    }
  }


    if (baseHero.xVel < 0 && baseHero.yVel < 0) {
      baseHero.heroDirection = 'upleft'
    } else if (baseHero.xVel < 0 && baseHero.yVel > 0) {
      baseHero.heroDirection = 'downleft'
    } else if (baseHero.xVel > 0 && baseHero.yVel > 0) {
      baseHero.heroDirection = 'downright'
    } else if (baseHero.xVel > 0 && baseHero.yVel < 0) {
      baseHero.heroDirection = 'upright'
    } else if (baseHero.xVel < 0 ) {
      baseHero.heroDirection = 'left'
    } else if (baseHero.xVel > 0 ) {
      baseHero.heroDirection = 'right'
    } else if (baseHero.yVel < 0 ) {
      baseHero.heroDirection = 'up'
    } else if (baseHero.yVel > 0 ) {
      baseHero.heroDirection = 'down'
    }




  return baseHero
}


export default moveEngine
