// import pixelPerfect from './PixelPerfect'
import globalVars from "./GlobalVars";
import checkCollision from "./CheckCollision";
import baseHero from "./BaseHero";
// import attackEngine from "./AttackEngine";


// used to randomly pick a direction on direction change
let moveDirections = [
  "down",
  "up",
  "left",
  "right",
  "upleft",
  "upright",
  "downleft",
  "downright",
];

// animates attack
const attackAnimate = (element) => {
  if (element.spriteAnimCounter >= element.spriteAnimSpeed) {
    element.cropX += element.blockSize;
    element.spriteAnimCounter = 0;
    if (element.cropX >= element.blockSize * element.animFrames) {
      console.log('animation over')
      element.cropX = 0;
      // element.attackAnimCooldown = false
      // console.log('maximum reached')
      return [false, element];
    }
  }
  // console.log(element.spriteAnimCounter)
  element.spriteAnimCounter++;
  return [true, element];
};

// toggles direction of movement when not in chasing, fleeing, or attack modes
const changeDirectionFunc = (target, probability) => {
  const changeDirection = Math.floor(Math.random() * probability);
  if (changeDirection === 25) {
    target.direction =
      target.moveDirections[
        Math.floor(Math.random() * target.moveDirections.length)
      ];
  }
  return target;
};

// toggles moving when not in chasing, fleeing, or attack modes
const startStopMovementFunc = (target, probability) => {
  const startStopMovement = Math.floor(Math.random() * probability);
  if (startStopMovement === 29) {
    target.moving = !target.moving;
  }
  return target;
};

// toggles dashing when not in attack mode
const dashFunc = (target, probability) => {
  const dash = Math.floor(Math.random() * probability);
  if (dash === 11) {
    target.dashing = !target.dashing;
    // console.log('flip')
  }
  return target;
};

// turns enemy towards hero based when in chase or attack modes
const moveTowardsHero = (target, dataVisCtx) => {
  // declare the center coordinates of the hero
  const heroCenterX = globalVars.middleX;
  const heroCenterY = globalVars.middleY;
  // declare the center coordinates of the enemy
  const enemyCenterX = target.x + (target.blockSize / 2)
  const enemyCenterY = target.y + (target.blockSize / 2)
  // console.log(target)
  target.moving = true;

  // displays current enemy's attackRadius
  // dataVisCtx.fillRect(x - target.attackRadius, y - target.attackRadius, 4, 4)
  // dataVisCtx.fillRect(x - target.attackRadius, y + target.attackRadius, 4, 4)
  // dataVisCtx.fillRect(x + target.attackRadius, y - target.attackRadius, 4, 4)
  // dataVisCtx.fillRect(x + target.attackRadius, y + target.attackRadius, 4, 4)

  // turns enemy towards the attackRadius area around the hero
  // once inside the radius it will initiate an attack

  // enemy movement zones - handled by big if/else chain below
  // active when enemy is chasing or attacking, which means they are
  // within their aggroRadius of the hero, which is a circle emanating
  // from the center point of the hero or enemy with a radius of aggroRadius
  //
  //   a     |b|b|     c
  //         | | |
  //   ______|_|_|______
  //  h______|_x_|______d
  //  h______|_|_|______d
  //         | | |
  //         | | |
  //   g     |f|f|     e
  //
  // hero is at center of zone x, which is baseHero.blockSize height and width
  // if enemy is in zones b, d, f, or h they will turn diagonally towards hero
  // if they hit one of the outside edges, and will switch to moving horizontally or
  // vertically towards the hero if they cross the middle line of that zone.
  // These four zones actually extend to the center of zone x which handles movement
  // when attacking as well.
  // if they are in zones a, c, e, or g, they will move diagonally towards
  // the hero.


  if (enemyCenterX <= baseHero.x + baseHero.blockSize
    && enemyCenterY <= heroCenterY
    && enemyCenterX >= baseHero.x
    ) {
      if (enemyCenterX === heroCenterX) {
        target.direction = "down";
      } else if (enemyCenterX === baseHero.x) {
        target.direction = "downright";
      } else if(enemyCenterX === baseHero.x + baseHero.blockSize) {
        target.direction = "downleft";
      }
    } else if (enemyCenterX <= heroCenterX
      && enemyCenterY <= baseHero.y + baseHero.blockSize
      && enemyCenterY >= baseHero.y) {
        if (enemyCenterY === heroCenterY) {
        target.direction = "right";
        } else if (enemyCenterY === baseHero.y) {
        target.direction = "downright";
        } else if (enemyCenterY === baseHero.y + baseHero.blockSize) {
        target.direction = "upright";
        }
      } else if (enemyCenterX >= heroCenterX
        && enemyCenterY <= baseHero.y + baseHero.blockSize
        && enemyCenterY >= baseHero.y) {
          if (enemyCenterY === heroCenterY) {
            target.direction = "left";
          } else if (enemyCenterY === baseHero.y) {
            target.direction = "downleft";
          } else if (enemyCenterY === baseHero.y + baseHero.blockSize) {
            target.direction = "upleft";
          }
        } else if (enemyCenterX <= baseHero.x + baseHero.blockSize
          && enemyCenterY >= heroCenterY
          && enemyCenterX >= baseHero.x) {
            if (enemyCenterX === heroCenterX) {
              target.direction = "up";
            } else if (enemyCenterX === baseHero.x) {
              target.direction = "upright";
            } else if (enemyCenterX === baseHero.x + baseHero.blockSize) {
              target.direction = "upleft";
            }
          } else if (enemyCenterX < baseHero.x
            && enemyCenterY < baseHero.y) {
              target.direction = "downright";
            } else if (enemyCenterX > baseHero.x
              && enemyCenterY < baseHero.y + baseHero.blockSize) {
                target.direction = "downleft";
            } else if (enemyCenterX > baseHero.x + baseHero.blockSize
              && enemyCenterY > baseHero.y + baseHero.blockSize) {
                target.direction = "upleft"
              } else if (enemyCenterX < baseHero.x
                && enemyCenterY > baseHero.y + baseHero.blockSize) {
                  target.direction = "upright"
                }

  return target;
};

const enemyMoveEngine = (enemyObject, collisionCtx, foregroundCtx) => {
  // console.log(enemyObject.currentFatigue)


  if (
    enemyObject.x <= 0 ||
    enemyObject.x >= globalVars.width ||
    enemyObject.y <= 0 ||
    enemyObject.y >= globalVars.height
  ) {
    // console.log('offscreen')
    return enemyObject;
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
  if (enemyObject.attacking) {
    // console.log("attacking");
    enemyObject = moveTowardsHero(enemyObject, foregroundCtx);
    enemyObject.moving = true;
    enemyObject.dashing = true;
  } else if (!enemyObject.chasing || enemyObject.fleeing) {
    if (enemyObject.fleeing) {
      enemyObject.moving = true;
    }
    enemyObject = changeDirectionFunc(enemyObject, 100, moveDirections);
    enemyObject = startStopMovementFunc(enemyObject, 100);
  } else if (enemyObject.chasing && !enemyObject.attacking) {
    // if it is in chase mode it moves towards the hero
    enemyObject = moveTowardsHero(enemyObject, foregroundCtx);
    enemyObject.moving = true;
    // enemyObject = startStopMovementFunc(enemyObject, 100)
    enemyObject = dashFunc(enemyObject, 100);
  }

  // toggles dashing on and off randomly if they have at least
  // a quarter of their full stamina
  if (enemyObject.currentFatigue > enemyObject.maxFatigue / 4) {
    enemyObject = dashFunc(enemyObject, 100);
  } else {
    // enemyObject.dashing = false
  }

  // console.log(enemyObject.spriteSheets.downright)

  const imgData = collisionCtx.getImageData(
    enemyObject.x,
    enemyObject.y,
    enemyObject.x + enemyObject.blockSize,
    enemyObject.y + enemyObject.blockSize
  );
  // console.log(enemyObject.x, enemyObject.y, enemyObject.x + enemyObject.blockSize, enemyObject.y + enemyObject.blockSize)
  const onlyGreenCol = true; // if true it only checks environment collision, otherwise it also checks enemy collisions
  let collisions = checkCollision(
    imgData,
    enemyObject.colBox,
    collisionCtx,
    foregroundCtx,
    enemyObject,
    onlyGreenCol
  );
  const col0 = collisions[0];
  const col1 = collisions[1];
  const col2 = collisions[2];
  const col3 = collisions[3];
  const col4 = collisions[4];
  const col5 = collisions[5];
  const col6 = collisions[6];
  const col7 = collisions[7];
  const col8 = collisions[8];
  const col9 = collisions[9];
  const col10 = collisions[10];
  const col11 = collisions[11];
  let allCol =
    col0 ||
    col1 ||
    col2 ||
    col3 ||
    col4 ||
    col5 ||
    col6 ||
    col7 ||
    col8 ||
    col9 ||
    col10 ||
    col11;

  // if dash is active increase the max velocity and add a boost to acceleration
  if (enemyObject.dashing) {
    enemyObject.moveSpeed = enemyObject.dashSpeed;
    // drains stamina if dash is active and there is directional input
    if (enemyObject.currentFatigue > 0 && enemyObject.moving) {
      enemyObject.currentFatigue -= enemyObject.fatigueDrain;
    }
    // console.log('dashing')
  } else {
    enemyObject.moveSpeed = enemyObject.baseMoveSpeed;
    // console.log('not dashing')

    // regenerates stamina
    if (enemyObject.currentFatigue < enemyObject.maxFatigue) {
      enemyObject.currentFatigue += enemyObject.fatigueRecovery;
    } else {
      enemyObject.currentFatigue = enemyObject.maxFatigue;
    }
  }

  if (enemyObject.moving) {
    // console.log('moving')
    if (enemyObject.direction === "down") {
      enemyObject.currentSprite = enemyObject.spriteSheets.down;
      if ((col7 && col10) || (col8 && col9)) {
        const randomDirection = Math.floor(Math.random() * 3);
        if (randomDirection === 1) {
          enemyObject.direction = "up";
        } else if (randomDirection === 2) {
          enemyObject.direction = "upright";
        } else {
          enemyObject.direction = "upleft";
        }
      } else if (col7 && col8) {
        enemyObject.x -= enemyObject.xVel;
      } else if (col9 && col10) {
        enemyObject.x += enemyObject.xVel;
      } else if (col8 && col9) {
        const randomDirection = Math.floor(Math.random() * 3);
        if (randomDirection === 1) {
          enemyObject.direction = "up";
        } else if (randomDirection === 2) {
          enemyObject.direction = "upright";
        } else {
          enemyObject.direction = "upleft";
        }
      } else {
        enemyObject.y += enemyObject.yVel;
      }
    } else if (enemyObject.direction === "up") {
      enemyObject.currentSprite = enemyObject.spriteSheets.up;
      if ((col1 && col4) || (col2 && col3)) {
        // if all forward corners collide, do nothing to prevent juddering
        const randomDirection = Math.floor(Math.random() * 3);
        if (randomDirection === 1) {
          enemyObject.direction = "down";
        } else if (randomDirection === 2) {
          enemyObject.direction = "downleft";
        } else {
          enemyObject.direction = "downright";
        }
      } else if (col1 && col2) {
        // if top left corner collides but not top right corner, move hero right
        enemyObject.x += enemyObject.xVel;
      } else if (col3 && col4) {
        enemyObject.x -= enemyObject.xVel;
      } else if (col2 && col3) {
        const randomDirection = Math.floor(Math.random() * 3);
        if (randomDirection === 1) {
          enemyObject.direction = "down";
        } else if (randomDirection === 2) {
          enemyObject.direction = "downleft";
        } else {
          enemyObject.direction = "downright";
        }
      } else {
        // if no top corners collide, move up
        enemyObject.y -= enemyObject.yVel;
      }
    } else if (enemyObject.direction === "left") {
      enemyObject.currentSprite = enemyObject.spriteSheets.left;
      if ((col1 && col10) || (col0 && col11)) {
        const randomDirection = Math.floor(Math.random() * 3);
        if (randomDirection === 1) {
          enemyObject.direction = "right";
        } else if (randomDirection === 2) {
          enemyObject.direction = "upright";
        } else {
          enemyObject.direction = "downright";
        }
      } else if (col0 && col1) {
        enemyObject.y += enemyObject.yVel;
      } else if (col11 && col10) {
        enemyObject.y -= enemyObject.yVel;
      } else if (col0 && col11) {
        const randomDirection = Math.floor(Math.random() * 3);
        if (randomDirection === 1) {
          enemyObject.direction = "right";
        } else if (randomDirection === 2) {
          enemyObject.direction = "upright";
        } else {
          enemyObject.direction = "downright";
        }
      } else {
        enemyObject.x -= enemyObject.xVel;
      }
    } else if (enemyObject.direction === "right") {
      enemyObject.currentSprite = enemyObject.spriteSheets.right;
      if ((col4 && col7) || (col5 && col6)) {
        const randomDirection = Math.floor(Math.random() * 3);
        if (randomDirection === 1) {
          enemyObject.direction = "right";
        } else if (randomDirection === 2) {
          enemyObject.direction = "upleft";
        } else {
          enemyObject.direction = "downleft";
        }
      } else if (col4 && col5) {
        enemyObject.y += enemyObject.yVel;
      } else if (col6 && col7) {
        enemyObject.y -= enemyObject.yVel;
      } else if (col5 && col6) {
        const randomDirection = Math.floor(Math.random() * 3);
        if (randomDirection === 1) {
          enemyObject.direction = "right";
        } else if (randomDirection === 2) {
          enemyObject.direction = "upleft";
        } else {
          enemyObject.direction = "downleft";
        }
      } else {
        enemyObject.x += enemyObject.xVel;
      }
    } else if (enemyObject.direction === "upleft") {
      if (col0 && col1 && col2) {
        const randomDirection = Math.floor(Math.random() * 3);
        if (randomDirection === 1) {
          enemyObject.direction = "downright";
        } else if (randomDirection === 2) {
          enemyObject.direction = "right";
        } else {
          enemyObject.direction = "down";
        }
      }
      {
        enemyObject.currentSprite = enemyObject.spriteSheets.upleft;
        enemyObject.x -= enemyObject.xVel;
        enemyObject.y -= enemyObject.yVel;
      }
    } else if (enemyObject.direction === "upright") {
      if (col3 && col4 && col5) {
        const randomDirection = Math.floor(Math.random() * 3);
        if (randomDirection === 1) {
          enemyObject.direction = "downleft";
        } else if (randomDirection === 2) {
          enemyObject.direction = "left";
        } else {
          enemyObject.direction = "down";
        }
      } else {
        enemyObject.currentSprite = enemyObject.spriteSheets.upright;
        enemyObject.x += enemyObject.xVel;
        enemyObject.y -= enemyObject.yVel;
      }
    } else if (enemyObject.direction === "downleft") {
      if (col9 && col10 && col11) {
        const randomDirection = Math.floor(Math.random() * 3);
        if (randomDirection === 1) {
          enemyObject.direction = "upright";
        } else if (randomDirection === 2) {
          enemyObject.direction = "up";
        } else {
          enemyObject.direction = "right";
        }
      } else {
        enemyObject.currentSprite = enemyObject.spriteSheets.downleft;
        enemyObject.x -= enemyObject.xVel;
        enemyObject.y += enemyObject.yVel;
      }
    } else if (enemyObject.direction === "downright") {
      if (col6 && col7 && col8) {
        const randomDirection = Math.floor(Math.random() * 3);
        if (randomDirection === 1) {
          enemyObject.direction = "upleft";
        } else if (randomDirection === 2) {
          enemyObject.direction = "up";
        } else {
          enemyObject.direction = "left";
        }
      } else {
        enemyObject.currentSprite = enemyObject.spriteSheets.downright;
        enemyObject.x += enemyObject.xVel;
        enemyObject.y += enemyObject.yVel;
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
    // runs attack animation
    if (enemyObject.attackAnimCooldown) {
      console.log('running')
      const attackAnimation = attackAnimate(enemyObject);
      // console.log(attackAnimation)
      enemyObject.attackAnimCooldown = attackAnimation[0];
      enemyObject = attackAnimation[1];
      if (!enemyObject.attackAnimCooldown) { // resets animation after attack
        // console.log('reset')
        enemyObject.spriteAnimCounter = 0;
        enemyObject.cropX = 0;
        enemyObject.animFrames = enemyObject.movementFrames;
        enemyObject.baseAnimSpeed = 2;
      }
      // continue;
    } else if (enemyObject.moving) {
    if (enemyObject.spriteAnimCounter >= enemyObject.spriteAnimSpeed) {
      enemyObject.cropX += enemyObject.blockSize;
      // spriteIndex++
      if (
        enemyObject.cropX >=
        enemyObject.blockSize * enemyObject.movementFrames
      ) {
        enemyObject.cropX = enemyObject.blockSize;
        // spriteIndex = 1
      }
      // if (spriteIndex > 6) {
      //   spriteIndex = 1
      // }
      enemyObject.spriteAnimCounter = 0;
    }
    enemyObject.spriteAnimCounter++;
  } else {
    // enemyObject.cropX = 0;
  }

  return enemyObject;
};

export default enemyMoveEngine;
