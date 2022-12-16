import moveEngine from "./MoveEngine";
import coordinateChange from "./CoordinateChange";
import eventEngine from "./EventEngine";
import globalVars from "./GlobalVars";
import pixelPerfect from "./PixelPerfect";

const heroUpdate = (
  baseHeroObj,
  enemyArr,
  dropItemArr,
  collisionCtx,
  dataVisCtx,
  spriteCtx
) => {
  let baseHero = baseHeroObj;
  // moveEngine runs less than every frame to keep the hero sprite slower
  if (baseHero.frameCountLimiter >= baseHero.maxFrameCountLimiter) {
    baseHero.frameCountLimiter = 0;
    // moveEngine handles inputs and collisions for hero sprite
    baseHero = moveEngine(baseHero, collisionCtx, dataVisCtx);

    // this handles an attack/ability usage by user - sets vars that will trigger attack/ability animation and
    // puts ability on cooldown. Current cooldown is set manually, but once there are other abilities
    // we will use their specific attributes to set the cooldown and effect duration
    // activates if there is enough stamina for attack
    if (
      baseHero.currentFatigue >=
        baseHero.fatigueDrain * baseHero.fatigueAttack &&
      baseHero.keys.mouse1.pressed &&
      baseHero.attackCooldownOff
    ) {
      baseHero.attackCooldownOff = false;
      baseHero.attackActive = true;
      baseHero.attackAnimation = true;
      baseHero.cropX = baseHero.moveFrames * baseHero.blockSize;
      baseHero.animCounter = 0;

      baseHero.equipment.weapon.attackSound.play();

      baseHero = eventEngine(baseHero, "attack");
      // cooldown setTimeout sets the cooldown on an event ability - eventObj.eventTimeout determines the length in seconds
      const cooldown = setTimeout(() => {
        // enables this attack again after eventTimeout # of seconds, essentially a cooldown
        baseHero.attackCooldownOff = true;
        clearTimeout(cooldown);
        // console.log('cooldown over')
      }, 800);

      // sets duration of event, set by eventObj.eventDuration in seconds
      const eventDuration = setTimeout(() => {
        clearTimeout(eventDuration);
        baseHero.attackActive = false;
        baseHero.eventX = -400;
        baseHero.eventY = -400;
        // console.log('attack over')
      }, 100);
    }

    if (baseHero.keys.Space.pressed) {
      console.log("jump!");
      baseHero.jumpActive = true;
    }

    if (baseHero.keys.mouse2.pressed) {
      console.log("right mouse button!");
    }
    // starts blood draining
    if (baseHero.keys.e.pressed) {
      baseHero.bloodDrainActive = true;
      // spriteCtx.fillRect(baseHero.eventX, baseHero.eventY, baseHero.attackBlockSize, baseHero.attackBlockSize)
      baseHero = eventEngine(baseHero, "drain");
    } else {
      if (baseHero.bloodDrainActive) {
        baseHero.eventX = -400;
        baseHero.eventY = -400;
      }
      baseHero.bloodDrainActive = false;
      // baseHero.attackActive = false
    }

    // console.log(baseHero.keys.q.pressed, baseHero.scavengeActive, baseHero.scavengeAnimation)
    if (baseHero.keys.q.pressed) {
      // console.log('pushed')
      baseHero.scavengeActive = true;
      baseHero = eventEngine(baseHero, "drain");
    } else {
      // if (baseHero.scavengeActive) {
      //   baseHero.eventX = -400;
      //   baseHero.eventY = -400;
      // }

      baseHero.scavengeAnimation = false;
      // console.log(baseHero.scavengeAnimate)
      baseHero.scavengeActive = false;
    }
    // console.log('scavengeActive', baseHero.scavengeActive)

    // coordinateChange moves elements in relation to the hero to keep them at the right coordinates
    for (let element of enemyArr) {
      element = coordinateChange(baseHero, element); // this is all of the enemy groups

      // this part is for the offScreen coordinates which handle clipping for off screen enemies
      for (let el of element) {
        if (el.data.offScreenX || el.data.offScreenY) {
          el.data.offScreenX = pixelPerfect(
            el.data.offScreenX + baseHero.frameXChange,
            "down",
            "x",
            globalVars.upscale
          );
          el.data.offScreenY = pixelPerfect(
            el.data.offScreenY + baseHero.frameYChange,
            "down",
            "y",
            globalVars.upscale
          );
          // dataVisCtx.fillStyle = 'rgba(255, 0, 0, 1)'
          // dataVisCtx.fillRect(el.data.offScreenX, el.data.offScreenY, el.data.blockSize, el.data.blockSize)
        }
      }
    }
    if (dropItemArr.length) {
      dropItemArr = coordinateChange(baseHero, dropItemArr);
    }
  }
  baseHero.frameCountLimiter += baseHero.moveSpeed;

  return [baseHero, enemyArr, dropItemArr];
};

export default heroUpdate;
