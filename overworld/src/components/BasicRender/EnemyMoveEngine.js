import pixelPerfect from './PixelPerfect'
import globalVars from "./GlobalVars"
import checkCollision from './CheckCollision'

// const baseAnimSpeed = 2
// let spriteAnimSpeed = baseAnimSpeed // after how many frames the sprite frame will progress for walking animation
// let spriteAnimCounter = 0 // increments to trigger render of next animation frame

let moveDirections = [
  'down',
  'up',
  'left',
  'right',
  'upleft',
  'upright',
  'downleft',
  'downright'
]

const changeDirectionFunc = (target, probability) => {
  const changeDirection = Math.floor(Math.random() * probability)
  if (changeDirection === 25) {
    target.direction = target.moveDirections[Math.floor(Math.random() * target.moveDirections.length)]
  }
  return target
}

const startStopMovementFunc = (target, probability) => {
  const startStopMovement = Math.floor(Math.random() * probability)
  if (startStopMovement === 29) {
    target.moving = !target.moving
  }
  return target
}

const dashFunc = (target, probability) => {
  const dash = Math.floor(Math.random() * probability)
  if (dash === 11) {
    target.dashing = !target.dashing
    // console.log('flip')
  }
  return target
}

const moveTowardsHero = (target) => {
  // declare the center coordinates of the hero
  const x = globalVars.heroCenterX
  const y = globalVars.heroCenterY
  // console.log(target)
  target.moving = true

  // turns enemy towards the attackRadius area around the hero
  // once inside the radius it will try to initiate an attack (not implemented yet)
  if (target.x < x - target.attackRadius && target.y < y - target.attackRadius) {
    target.direction = 'downright'
  } else if (target.x > x + target.attackRadius && target.y < y - target.attackRadius) {
    target.direction = 'downleft'
  } else if (target.x < x - target.attackRadius && target.y > y + target.attackRadius) {
    target.direction = 'upright'
  } else if (target.x > x + target.attackRadius && target.y > y + target.attackRadius) {
    target.direction = 'upleft'
  } else if (target.x < x - target.attackRadius && (target.y > y - target.attackRadius && target.y < y + target.attackRadius)) {
    target.direction = 'right'
  } else if (target.x > x + target.attackRadius && (target.y > y - target.attackRadius && target.y < y + target.attackRadius)) {
    target.direction = 'left'
  } else if ((target.x > x - target.attackRadius && target.x < x + target.attackRadius) && target.y > y + target.attackRadius) {
    target.direction = 'up'
  } else if ((target.x > x - target.attackRadius && target.x < x + target.attackRadius) && target.y < y - target.attackRadius) {
    target.direction = 'down'
  }
  return target
}

const enemyMoveEngine = (enemyObject, collisionCtx, foregroundCtx) => {
  // console.log(enemyObject.x, enemyObject.y)

if (
  (enemyObject.x <= 0 || enemyObject.x >= globalVars.width)
      || (enemyObject.y <= 0 || enemyObject.y >= globalVars.height )
) {
  // console.log('offscreen')
  return enemyObject
}
// if (
//   enemyObject.x <= -globalVars.blockSize
//   || enemyObject.y <= -globalVars.blockSize
// ) {
//   // console.log(enemyObject.x, enemyObject.y)
//   return enemyObject
// }


// if (
//   enemyObject.x < -globalVars.blockSize || enemyObject.x > globalVars.width + globalVars.blockSize
//       || enemyObject.y < -globalVars.blockSize || enemyObject.y > globalVars.height + globalVars.blockSize
// ) {
//   // console.log('offscreen')
//   return enemyObject
// }

// if enemy isn't in attack mode it moves around randomly
if (!enemyObject.attacking || enemyObject.fleeing) {
  if (enemyObject.fleeing) {
    enemyObject.moving = true
  }
  enemyObject = changeDirectionFunc(enemyObject, 100, moveDirections)
  enemyObject = startStopMovementFunc(enemyObject, 100)
} else if (enemyObject.attacking) { // if it is in attack mode it moves towards the hero
  enemyObject = moveTowardsHero(enemyObject)
  enemyObject.moving = true
  // enemyObject = startStopMovementFunc(enemyObject, 100)
  enemyObject = dashFunc(enemyObject, 100)
}
if (enemyObject.currentStam > enemyObject.maxStam / 4) {
  enemyObject = dashFunc(enemyObject, 100)
} else {
  enemyObject.dashing = false
}





// console.log(enemyObject.spriteSheets.downright)

const imgData = collisionCtx.getImageData(enemyObject.x, enemyObject.y, enemyObject.x + enemyObject.blockSize, enemyObject.y + enemyObject.blockSize)
// console.log(enemyObject.x, enemyObject.y, enemyObject.x + enemyObject.blockSize, enemyObject.y + enemyObject.blockSize)
let collisions = checkCollision(imgData, enemyObject.colBox, collisionCtx, foregroundCtx, enemyObject)
const col0 = collisions[0]
const col1 = collisions[1]
const col2 = collisions[2]
const col3 = collisions[3]
const col4 = collisions[4]
const col5 = collisions[5]
const col6 = collisions[6]
const col7 = collisions[7]
const col8 = collisions[8]
const col9 = collisions[9]
const col10 = collisions[10]
const col11 = collisions[11]
let allCol = (col0 || col1 || col2 || col3 || col4 || col5 || col6 || col7 || col8 || col9 || col10 || col11)


  // if dash is active increase the max velocity and add a boost to acceleration
  if (enemyObject.dashing) {
    enemyObject.moveSpeed = enemyObject.dashSpeed
    // drains stamina if dash is active and there is directional input
    if (enemyObject.currentStam > 0 && enemyObject.moving) {
      enemyObject.currentStam -= enemyObject.stamDrain
    }
    // console.log('dashing')
  } else {
    enemyObject.moveSpeed = enemyObject.baseMoveSpeed
    // console.log('not dashing')

    // regenerates stamina
    if (enemyObject.currentStam < enemyObject.maxStam) {
      enemyObject.currentStam += enemyObject.stamRecovery
    } else {
      enemyObject.currentStam = enemyObject.maxStam
    }
  }

  if (enemyObject.moving) {
    // console.log('moving')
    if (enemyObject.direction === 'down') {
      enemyObject.currentSprite = enemyObject.spriteSheets.down
      if ((col7 && col10) || (col8 && col9)) {
        const randomDirection = Math.floor(Math.random() * 3)
        if (randomDirection === 1) {
          enemyObject.direction = 'up'
        } else if (randomDirection === 2) {
          enemyObject.direction = 'upright'
        } else {
          enemyObject.direction = 'upleft'
        }
      } else if (col7 && col8) {
        enemyObject.x -= enemyObject.xVel
      } else if (col9 && col10) {
        enemyObject.x += enemyObject.xVel
      } else if (col8 && col9) {
        const randomDirection = Math.floor(Math.random() * 3)
        if (randomDirection === 1) {
          enemyObject.direction = 'up'
        } else if (randomDirection === 2) {
          enemyObject.direction = 'upright'
        } else {
          enemyObject.direction = 'upleft'
        }
      } else {
        enemyObject.y += enemyObject.yVel
      }
    } else if (enemyObject.direction === 'up') {
      enemyObject.currentSprite = enemyObject.spriteSheets.up
      if ((col1 && col4) || (col2 && col3)) {
        // if all forward corners collide, do nothing to prevent juddering
        const randomDirection = Math.floor(Math.random() * 3)
        if (randomDirection === 1) {
          enemyObject.direction = 'down'
        } else if (randomDirection === 2) {
          enemyObject.direction = 'downleft'
        } else {
          enemyObject.direction = 'downright'
        }
      } else if (col1 && col2) { // if top left corner collides but not top right corner, move hero right
        enemyObject.x += enemyObject.xVel
      } else if (col3 && col4) {
        enemyObject.x -= enemyObject.xVel
      } else if (col2 && col3) {
        const randomDirection = Math.floor(Math.random() * 3)
        if (randomDirection === 1) {
          enemyObject.direction = 'down'
        } else if (randomDirection === 2) {
          enemyObject.direction = 'downleft'
        } else {
          enemyObject.direction = 'downright'
        }
      } else { // if no top corners collide, move up
        enemyObject.y -= enemyObject.yVel
      }
    } else if (enemyObject.direction === 'left') {
      enemyObject.currentSprite = enemyObject.spriteSheets.left
      if ((col1 && col10) || (col0 && col11)) {
        const randomDirection = Math.floor(Math.random() * 3)
        if (randomDirection === 1) {
          enemyObject.direction = 'right'
        } else if (randomDirection === 2) {
          enemyObject.direction = 'upright'
        } else {
          enemyObject.direction = 'downright'
        }
      } else if (col0 && col1) {
        enemyObject.y += enemyObject.yVel
      } else if (col11 && col10) {
        enemyObject.y -= enemyObject.yVel
      } else if (col0 && col11) {
        const randomDirection = Math.floor(Math.random() * 3)
        if (randomDirection === 1) {
          enemyObject.direction = 'right'
        } else if (randomDirection === 2) {
          enemyObject.direction = 'upright'
        } else {
          enemyObject.direction = 'downright'
        }
      } else {
        enemyObject.x -= enemyObject.xVel
      }
    } else if (enemyObject.direction === 'right') {
      enemyObject.currentSprite = enemyObject.spriteSheets.right
      if ((col4 && col7) || (col5 && col6)) {
        const randomDirection = Math.floor(Math.random() * 3)
        if (randomDirection === 1) {
          enemyObject.direction = 'right'
        } else if (randomDirection === 2) {
          enemyObject.direction = 'upleft'
        } else {
          enemyObject.direction = 'downleft'
        }
      } else if (col4 && col5) {
        enemyObject.y += enemyObject.yVel
      } else if (col6 && col7) {
        enemyObject.y -= enemyObject.yVel
      } else if (col5 && col6) {
        const randomDirection = Math.floor(Math.random() * 3)
        if (randomDirection === 1) {
          enemyObject.direction = 'right'
        } else if (randomDirection === 2) {
          enemyObject.direction = 'upleft'
        } else {
          enemyObject.direction = 'downleft'
        }
      } else {
        enemyObject.x += enemyObject.xVel
      }
    } else if (enemyObject.direction === 'upleft') {
      if (col0 && col1 && col2) {
        const randomDirection = Math.floor(Math.random() * 3)
        if (randomDirection === 1) {
          enemyObject.direction = 'downright'
        } else if (randomDirection === 2) {
          enemyObject.direction = 'right'
        } else {
          enemyObject.direction = 'down'
        }
      } {
        enemyObject.currentSprite = enemyObject.spriteSheets.upleft
        enemyObject.x -= enemyObject.xVel
        enemyObject.y -= enemyObject.yVel
      }
    } else if (enemyObject.direction === 'upright') {
      if (col3 && col4 && col5) {
        const randomDirection = Math.floor(Math.random() * 3)
        if (randomDirection === 1) {
          enemyObject.direction = 'downleft'
        } else if (randomDirection === 2) {
          enemyObject.direction = 'left'
        } else {
          enemyObject.direction = 'down'
        }
      } else {
        enemyObject.currentSprite = enemyObject.spriteSheets.upright
        enemyObject.x += enemyObject.xVel
        enemyObject.y -= enemyObject.yVel
      }
    } else if (enemyObject.direction === 'downleft') {
      if (col9 && col10 && col11) {
        const randomDirection = Math.floor(Math.random() * 3)
        if (randomDirection === 1) {
          enemyObject.direction = 'upright'
        } else if (randomDirection === 2) {
          enemyObject.direction = 'up'
        } else {
          enemyObject.direction = 'right'
        }
      } else {
        enemyObject.currentSprite = enemyObject.spriteSheets.downleft
        enemyObject.x -= enemyObject.xVel
        enemyObject.y += enemyObject.yVel
      }
    } else if (enemyObject.direction === 'downright') {
      if (col6 && col7 && col8) {
        const randomDirection = Math.floor(Math.random() * 3)
        if (randomDirection === 1) {
          enemyObject.direction = 'upleft'
        } else if (randomDirection === 2) {
          enemyObject.direction = 'up'
        } else {
          enemyObject.direction = 'left'
        }
      } else {
        enemyObject.currentSprite = enemyObject.spriteSheets.downright
        enemyObject.x += enemyObject.xVel
        enemyObject.y += enemyObject.yVel
      }
    }
  }


  // if (enemyObject.moving) {
  //   if (enemyObject.direction === 'down') {
  //     enemyObject.currentSprite = enemyObject.spriteSheets.down
  //     // console.log(enemyObject.spriteSheets.down)
  //     enemyObject.y += enemyObject.yVel
  //   } else if (enemyObject.direction === 'up') {
  //     enemyObject.currentSprite = enemyObject.spriteSheets.up
  //     // console.log(enemyObject.spriteSheets.up)
  //     enemyObject.y -= enemyObject.yVel
  //   } else if (enemyObject.direction === 'left') {
  //     enemyObject.currentSprite = enemyObject.spriteSheets.left
  //     enemyObject.x -= enemyObject.xVel
  //   } else if (enemyObject.direction === 'right') {
  //     enemyObject.currentSprite = enemyObject.spriteSheets.right
  //     enemyObject.x += enemyObject.xVel
  //   } else if (enemyObject.direction === 'upleft') {
  //     enemyObject.currentSprite = enemyObject.spriteSheets.upleft
  //     enemyObject.x -= enemyObject.xVel
  //     enemyObject.y -= enemyObject.yVel
  //   } else if (enemyObject.direction === 'upright') {
  //     enemyObject.currentSprite = enemyObject.spriteSheets.upright
  //     enemyObject.x += enemyObject.xVel
  //     enemyObject.y -= enemyObject.yVel
  //   } else if (enemyObject.direction === 'downleft') {
  //     enemyObject.currentSprite = enemyObject.spriteSheets.downleft
  //     enemyObject.x -= enemyObject.xVel
  //     enemyObject.y += enemyObject.yVel
  //   } else if (enemyObject.direction === 'downright') {
  //     enemyObject.currentSprite = enemyObject.spriteSheets.downright
  //     enemyObject.x += enemyObject.xVel
  //     enemyObject.y += enemyObject.yVel
  //   }
  // }



  // console.log(enemyObject.direction, enemyObject.currentSprite)
  if (enemyObject.moving){
    if (enemyObject.spriteAnimCounter >= enemyObject.spriteAnimSpeed) {
      enemyObject.cropX += enemyObject.blockSize
      // spriteIndex++
      if (enemyObject.cropX >= enemyObject.blockSize * enemyObject.movementFrames) {
        enemyObject.cropX = enemyObject.blockSize
        // spriteIndex = 1
      }
      // if (spriteIndex > 6) {
      //   spriteIndex = 1
      // }
      enemyObject.spriteAnimCounter = 0
    }
    enemyObject.spriteAnimCounter++
  } else {
    enemyObject.cropX = 0
  }

  return enemyObject

}

export default enemyMoveEngine
