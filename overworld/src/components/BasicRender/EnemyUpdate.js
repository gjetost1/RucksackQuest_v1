import enemyMoveEngine from "./EnemyMoveEngine";
import globalVars from "./GlobalVars";
import checkBoxCollision from "./CheckBoxCollision";
import eventEngine from "./EventEngine";
import attackEngine from "./AttackEngine";
import checkRadius from "./CheckRadius";

let enemyCollision = false;

// animates dying and blood drain
const animate = (element) => {
  element.data.animCounter++;

  if (element.data.animCounter >= element.data.spriteAnimSpeed) {
    element.crop.x += element.data.blockSize;
    element.data.animCounter = 0;
    if (element.crop.x >= element.data.blockSize * element.data.animFrames) {
      element.crop.x = element.data.blockSize * element.data.animFrames;
      return [false, element];
    }
  }
  return [true, element];
};



const enemyUpdate = (enemyArr, baseHero, collisionCtx, dataVisCtx) => {
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
    // doesn't update if the enemy is outside of the rendered canvas
    if (
      (!el.data.x <= 0 ||
        !el.data.x >= globalVars.width ||
        !el.data.y <= 0 ||
        !el.data.y >= globalVars.height) &&
      !el.data.dead
    ) {
      // runs dying animation on death
      if (el.data.dying && !el.data.dead) {
        // console.log(el.data.animCounter)
        const dyingAnimation = animate(el);
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
      ) {
        // console.log('trigger attacking')
        el.data.attacking = true;
        el.data.chasing = false;

        // const attackAnimTimeout = setTimeout(() => {
          // }, 1000)

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


      } else if (
        checkRadius(globalVars.middleX, globalVars.middleY, enemyCenterX, enemyCenterY, el.data.aggroRadius)
      ) {
        // console.log('chasing')

        el.data.chasing = true;
        el.data.attacking = false;
      } else {
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
      checkRadius(globalVars.middleX, globalVars.middleY, enemyCenterX, enemyCenterY, baseHero.blockSize * 1.5)
    ) {


      if (baseHero.attackActive || baseHero.bloodDrainActive) {
        const attackEngineReturn = attackEngine(baseHero, el.data, dataVisCtx);
        el.data = attackEngineReturn[0];
        enemyCollision = attackEngineReturn[1];
      }

      // handles blood draining of enemies
      if (
        baseHero.bloodDrainActive &&
        !enemyCollision &&
        el.data.dead &&
        el.data.currentBloodLevel > 0 &&
        baseHero.equipment.bloodTanks.currentFillTank
      ) {
        // console.log(baseHero.currentVitality)
        // console.log('current tank', baseHero.equipment.bloodTanks.currentFillTank)
        // console.log('all tanks', baseHero.equipment.bloodTanks[0])
        if (
          baseHero.equipment.bloodTanks.currentFillTank.data.currentVolume <
          baseHero.equipment.bloodTanks.currentFillTank.data.maxVolume
        ) {
          // console.log('draining')
          // animates blood effect on enemy corpse when draining
          el.data.damageAnim.data.spriteAnimSpeed = 20;
          const animated = animate(el.data.damageAnim);
          el.data.damageActive = animated[0];
          el.data.damageAnim = animated[1];
          el.data.currentBloodLevel -= baseHero.bloodDrainRate;
          baseHero.equipment.bloodTanks.currentFillTank.data.currentVolume +=
            baseHero.bloodDrainRate;
          baseHero.equipment.bloodTanks.bloodSound.play();
          if (el.data.currentBloodLevel <= 0) {
            el.crop.x = el.data.bloodlessFrame * el.data.blockSize;
          }
          if (
            baseHero.equipment.bloodTanks.currentFillTank.data.currentVolume >
            baseHero.equipment.bloodTanks.currentFillTank.data.maxVolume
          ) {
            baseHero.equipment.bloodTanks.currentFillTank.data.currentVolume =
            baseHero.equipment.bloodTanks.currentFillTank.data.maxVolume;
            baseHero.equipment.bloodTanks.changeCurrentTank = false
            baseHero.equipment.bloodTanks.bloodSound.pause();
          }
        } else if (!baseHero.equipment.bloodTanks.changeCurrentFillTank) {
          baseHero.equipment.bloodTanks.changeCurrentFillTank = true;
          // console.log('tank change')
          baseHero.equipment.bloodTanks.bloodSound.pause();
        }
      } else if (baseHero.bloodDrainActive && enemyCollision) {
        baseHero.bloodDrainActive = false;
        baseHero.equipment.bloodTanks.bloodSound.pause();
      } else {
        baseHero.equipment.bloodTanks.bloodSound.pause();
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
  return [enemyArr, baseHero];
};

export default enemyUpdate;
