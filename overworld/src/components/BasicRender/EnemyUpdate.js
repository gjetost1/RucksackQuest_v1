import enemyMoveEngine from "./EnemyMoveEngine";
import globalVars from "./GlobalVars";
import checkBoxCollision from "./CheckBoxCollision";
import eventEngine from "./EventEngine";
import attackEngine from "./AttackEngine";
import checkRadius, { getDistance } from "./CheckRadius";
import pixelPerfect from "./PixelPerfect";

import bloodDrain from "./BloodDrain";
import { animateDyingAndBloodDrain } from "./Animate";
import scavengeEngine from "./ScavengeEngine";

let enemyCollision = false;
let currentlyScavenging = false;
let currentlyBloodDraining = false;

// animates dying and blood drain
// const animate = (element) => {
//   element.data.animCounter++;

//   if (element.data.animCounter >= element.data.spriteAnimSpeed) {
//     element.crop.x += element.data.blockSize;
//     element.data.animCounter = 0;
//     if (element.crop.x >= element.data.blockSize * element.data.animFrames) {
//       element.crop.x = element.data.blockSize * element.data.animFrames;
//       return [false, element];
//     }
//   }
//   return [true, element];
// };





const enemyUpdate = (enemyArr, baseHero, dropItemArr, collisionCtx, dataVisCtx) => {
  if (!enemyArr) return;

  for (let el of enemyArr) {

    const enemyCenterX = el.data.x + (el.data.blockSize / 2) // true center x of enemy sprite instead of data.x, which is the upper left corner
    const enemyCenterY = el.data.y + (el.data.blockSize / 2) // true center y of enemy sprite instead of data.y, which is the upper left corner

    // console.log(el.data.direction, el.data.moving)
    // renders to collisionCanvas if the enemy is solid and not destroyed or breaking
    if (el.data.solid) {
      collisionCtx.drawImage(
        el.image,
        el.crop.x,
        el.crop.y,
        el.data.blockSize,
        el.data.blockSize,
        el.data.x,
        el.data.y,
        el.data.blockSize,
        el.data.blockSize
      );
    }

    // if the enemy goes off the canvas the collision layer doesn't exist so they can clip
    // through anything. This creates a frozen coordinate point that is guaranteed
    // not to be clipping, but they can still move freely off the screen. Once they come
    // back into view on the canvas they will appear at this point

    if (
      (el.data.x < 0 ||
      el.data.x > globalVars.width - el.data.blockSize ||
      el.data.y < 0 ||
      el.data.y > globalVars.height - el.data.blockSize)
      && !(el.data.offScreenX || el.data.offScreenY)
      && !el.data.dead
    ) {
      // console.log('set offscreen')
      el.data.offScreenX = el.data.x
      el.data.offScreenY = el.data.y
      // if (el.data.x <= 0) {
      //   el.data.direction = 'left'
      // } else if (el.data.x >= globalVars.width - el.data.blockSize) {
      //   el.data.direction = 'right'
      // } else if (el.data.y <= 0) {
      //   el.data.direction = 'up'
      // } else if (el.data.y >= globalVars.height - el.data.blockSize) {
      //   el.data.direction = 'down'
      // }
    }

    if ((el.data.offScreenX || el.data.offScreenY)
      && (el.data.offScreenX < -el.data.blockSize
      || el.data.offScreenX > globalVars.width + el.data.blockSize
      || el.data.offScreenY < -el.data.blockSize
      || el.data.offScreenY > globalVars.height + el.data.blockSize)) {
        // console.log('trigger')
        el.data.offScreenTrigger = true
      }

    if (el.data.offScreenTrigger && (el.data.offScreenX || el.data.offScreenY) &&
      ((el.data.x >= -el.data.blockSize && el.data.x <= 0) ||
      (el.data.x <= globalVars.width && el.data.x >= globalVars.width - el.data.blockSize) ||
      (el.data.y >= -el.data.blockSize && el.data.y <= 0) ||
      (el.data.y <= globalVars.height && el.data.y >= globalVars.height - el.data.blockSize))
    ) {
      // console.log('end offscreen')
      el.data.offScreenTrigger = false
      el.data.x = el.data.offScreenX
      el.data.y = el.data.offScreenY
      el.data.offScreenY = false
      el.data.offScreenX = false
      el.data.moving = true

      // console.log(el.data.x, el.data.y)

      if (el.data.x <= el.data.blockSize) {
        el.data.direction = 'right'
        // console.log("right")
      } else if (el.data.x >= globalVars.width - el.data.blockSize) {
        el.data.direction = 'left'
        // console.log("left")
      } else if (el.data.y <= el.data.blockSize) {
        el.data.direction = 'down'
        // console.log("down")
      } else if (el.data.y >= globalVars.height - el.data.blockSize) {
        el.data.direction = 'up'
        // console.log("up")
      }
    }


    // doesn't update if the enemy is dead
    if (
      (el.data.x >= -el.data.blockSize &&
        el.data.x <= globalVars.width &&
        el.data.y >= -el.data.blockSize &&
        el.data.y <= globalVars.height) &&
      !el.data.dead
    ) {

      // runs dying animation on death
      if (el.data.dying && !el.data.dead) {
        // console.log(el.data.animCounter)
        const dyingAnimation = animateDyingAndBloodDrain(el);
        el.data.dead = !dyingAnimation[0];
        if (el.data.dead) {
          // el.data.dying = false
        }
        el = dyingAnimation[1];
        continue;
      }



      // console.log(globalVars.heroCenterX, globalVars.heroCenterY, el.data.x, el.data.y, el.data.attackRadius, el.data.aggroRadius, el.data.fleeingRadius)

      // sets enemy to attacking status if the hero is within their aggroRadius
      if (
        checkRadius(globalVars.middleX, globalVars.middleY, enemyCenterX, enemyCenterY, el.data.attackRadius)
        && el.data.attackCooldownOff
        && !el.data.fleeing
        && !el.data.collisionOverride
      ) {
        // console.log('trigger attacking')
        el.data.attacking = true;
        el.data.chasing = false;
        el.data.dashSpeed = el.data.attackDashSpeed;

        // const attackAnimTimeout = setTimeout(() => {
          // }, 1000)

          // enemy will perform an attack if they are within this radius of the hero
          if (
            checkRadius(globalVars.middleX, globalVars.middleY, enemyCenterX, enemyCenterY, baseHero.blockSize - baseHero.blockSize / 8)
            ) {
              el.data.spriteAnimCounter = 0;
              el.cropX = el.data.blockSize * el.data.movementFrames;
              el.data.animFrames = el.data.movementFrames + el.data.attackFrames - 1;
              el.data.spriteAnimSpeed = 2;
              el.data.attackAnimCooldown = true
              el.data.attackActive = true;
              el.data.attackCooldownOff = false;
              el.data = eventEngine(el.data, "attack");
              const attackEngineReturn = attackEngine(el.data, baseHero, dataVisCtx);
              baseHero = attackEngineReturn[0];
              // const heroCollision = attackEngineReturn[1];
              el.data.attacking = false;
              el.data.fleeing = true
              const cooldown = setTimeout(() => {
                // enables this attack again after eventTimeout # of seconds, essentially a cooldown
                el.data.attackCooldownOff = true;
                // el.data.attacking = true;
                // console.log('cooldown over')
                clearTimeout(cooldown)
              }, 3000);

              // sets duration of event, set by eventObj.eventDuration in seconds
              const eventDuration = setTimeout(() => {
                clearTimeout(eventDuration);
                el.data.attackActive = false;
                el.data.eventX = -400;
                el.data.eventY = -400;
                // console.log('attack over')
                clearTimeout(eventDuration)
              }, 100);
          }


      } else if ( // this is the chasing state for the enemy
        checkRadius(globalVars.middleX, globalVars.middleY, enemyCenterX, enemyCenterY, el.data.aggroRadius)
        && !el.data.collisionOverride
        ) {
        // console.log('chasing')
        el.data.dashSpeed = el.data.baseDashSpeed
        el.data.chasing = true;
        el.data.attacking = false;
      } else {
        el.data.dashSpeed = el.data.baseDashSpeed
        el.data.chasing = false;
        el.data.attacking = false;
      }

      if (!el.data.attackActive) {
        baseHero.takeDamage = false;
      }

      if (
        el.data.fleeing &&
        !checkRadius(globalVars.middleX, globalVars.middleY, enemyCenterX, enemyCenterY, el.data.fleeingRadius)
      ) {
        el.data.fleeing = false;
        // console.log('fleeing end')
      }

      // makes sure the enemy moves when in collisionOverride state
      // so that they might get unstuck...
      if (el.data.collisionOverride) {
        el.data.moving = true
      }

      // if the frameCountLimiter has been reached run the moveEngine to move
      // the enemy
      if (el.data.frameCountLimiter >= el.data.maxFrameCountLimiter) {
        el.data = enemyMoveEngine(el.data, collisionCtx, dataVisCtx);
        // console.log(el.data)
        el.data.frameCountLimiter = 0;
      }
      el.data.frameCountLimiter += el.data.moveSpeed;

      // set the sprite position to the current enemyObject coordinates
      el.position = {
        x: el.data.x,
        y: el.data.y,
      };
      // set the animation crop of the sprite
      el.cropChange(el.data.cropX, el.data.cropY);

      // sets the right direction spriteSheet for the sprite
      el.image.src = el.data.currentSprite;
    }

    // if the enemy is close to the hero this checks for hero attacks
    // and hits on the enemy
    if (
      checkRadius(globalVars.middleX, globalVars.middleY, enemyCenterX, enemyCenterY, baseHero.blockSize)
    ) {


      if (baseHero.attackActive || baseHero.bloodDrainActive) {
        const attackEngineReturn = attackEngine(baseHero, el.data, dataVisCtx);
        el.data = attackEngineReturn[0];
        enemyCollision = attackEngineReturn[1];
      }

      // handles blood draining of corpses
  //  console.log(baseHero.bloodDrainActive)
      if (baseHero.bloodDrainActive && !el.data.scavenged && el.data.currentBloodLevel > 0 && (!currentlyBloodDraining || currentlyBloodDraining === el) && !baseHero.bloodDrainPause && el.data.dead) {
        // console.log('activate blood drain')
        currentlyBloodDraining = el;
        if (!baseHero.bloodDrainAnimation) {
          // console.log('running this')
          // const xDistance = pixelPerfect(el.data.x - globalVars.heroCenterX, 'down', 'x', globalVars.upscale)
          // const yDistance = pixelPerfect(el.data.y - globalVars.heroCenterY - el.data.blockSize / 4, 'down', 'y', globalVars.upscale)
          const xDistance = el.data.x - globalVars.heroCenterX
          const yDistance = el.data.y - globalVars.heroCenterY - el.data.blockSize / 4
          baseHero.targetCameraX += xDistance
          baseHero.targetCameraY += yDistance
          baseHero.bonusFrameXChange -= xDistance
          baseHero.bonusFrameYChange -= yDistance
          baseHero.heroCropX = 0
          baseHero.animCounter = 0
          baseHero.bloodDrainAnimation = true
          baseHero.currentHeroSprite = baseHero.spriteSheets.blood_drain
        }
        // console.log('enemy col', enemyCollision)
        const bloodDrainRet = bloodDrain(el, baseHero, enemyCollision)
        el = bloodDrainRet[0]
        baseHero = bloodDrainRet[1]

        if (!baseHero.bloodDrainActive) {
          baseHero.currentHeroSprite = baseHero.spriteSheets.down
          baseHero.cropX = 0
          baseHero.cropY = 0

        }

      } else if (currentlyBloodDraining && currentlyBloodDraining !== el) {
        // console.log('continue')

        continue
      } else if (currentlyBloodDraining) {
        console.log('else if')

        baseHero.bloodDrainActive = false
        currentlyBloodDraining = false
        baseHero.bloodDrainAnimation = false

      }


      // console.log(baseHero.scavengeActive)
      // handles scavenging of corpses
      if (baseHero.scavengeActive && el.data.scavengeable && !el.data.scavenged && el.data.currentBloodLevel === el.data.maxBloodLevel && (!currentlyScavenging || currentlyScavenging === el) && !baseHero.scavengePause  && el.data.dead) {

        currentlyScavenging = el
        // if it is the first frame of a scavenge this sets up the hero sprite
        // position and animation for scavenging
        if (!baseHero.scavengeAnimation) {
          // const xDistance = pixelPerfect(el.data.x - globalVars.heroCenterX, 'down', 'x', globalVars.upscale)
          // const yDistance = pixelPerfect(el.data.y - globalVars.heroCenterY - el.data.blockSize / 4, 'down', 'y', globalVars.upscale)
          const xDistance = el.data.x - globalVars.heroCenterX
          const yDistance = el.data.y - globalVars.heroCenterY - el.data.blockSize / 4
          baseHero.targetCameraX += xDistance
          baseHero.targetCameraY += yDistance
          baseHero.bonusFrameXChange -= xDistance
          baseHero.bonusFrameYChange -= yDistance
          baseHero.heroCropX = 0
          baseHero.animCounter = 0
          baseHero.scavengeAnimation = true
          baseHero.currentHeroSprite = baseHero.spriteSheets.scavenge
        }
        const scavengeRet = scavengeEngine(el, baseHero, dropItemArr, enemyCollision)
        el = scavengeRet[0]
        baseHero = scavengeRet[1]
        dropItemArr = scavengeRet[2]

        if (!baseHero.scavengeActive) {
          baseHero.currentHeroSprite = baseHero.spriteSheets.down
          baseHero.cropX = 0
          baseHero.cropY = 0

        }
      } else if (currentlyScavenging && currentlyScavenging !== el) {
        continue
      } else if (currentlyScavenging) {
        baseHero.scavengeActive = false
        baseHero.scavengeAnimation = false
        currentlyScavenging = false
        if (el.data.scavenged) {
          el.crop.x = el.data.scavengedFrame * el.data.blockSize;
        }
      }

    }
    if (!baseHero.attackActive) {
      el.data.takeDamage = false;
    }
    // if vitality drops below zero this sets up and starts the dying animation
    // also plays the dying sound
    if (el.data.currentVitality <= 0 && !el.data.dead) {
      el.data.dying = true;
      el.data.dyingSound.play();
      el.data.animCounter = 0;
      el.crop.x = el.data.blockSize * (el.data.attackFrames + el.data.movementFrames) - el.data.blockSize;
      el.data.animFrames = el.data.movementFrames + el.data.attackFrames + el.data.dyingFrames;
      el.data.spriteAnimSpeed = 22;
    }

    // uncomment to show enemy attack hitbox
    // dataVisCtx.fillStyle = 'rgba(0, 255, 0, 1)'
    // dataVisCtx.fillRect(el.data.eventX, el.data.eventY, 4, 4)
  }
  return [enemyArr, baseHero, dropItemArr];
};

export default enemyUpdate;
