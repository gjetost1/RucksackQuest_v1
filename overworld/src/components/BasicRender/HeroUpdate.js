import moveEngine from "./MoveEngine";
import coordinateChange from "./CoordinateChange";
import eventEngine from "./EventEngine";
import dropItemRender from "./DropItemRender";

const heroUpdate = (baseHero, enemyArr, dropItemArr, collisionCtx, dataVisCtx) => {
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
      baseHero.currentFatigue >= baseHero.fatigueDrain * baseHero.fatigueAttack &&
      baseHero.keys.mouse1.pressed &&
      baseHero.attackCooldownOff
    ) {

      baseHero.attackCooldownOff = false;
      baseHero.attackActive = true;
      baseHero.attackAnimation = true;


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

    if (baseHero.keys.q.pressed) {
      // console.log('pushed')

      baseHero.scavengeActive = true
      baseHero = eventEngine(baseHero, "drain");
    } else {
      // if (baseHero.scavengeActive) {
      //   baseHero.eventX = -400;
      //   baseHero.eventY = -400;
      // }
      baseHero.scavengeActive = false;
    }
    // console.log('scavengeActive', baseHero.scavengeActive)

    // coordinateChange moves elements in relation to the hero to keep them at the right coordinates
    for (let el of enemyArr) {
      el = coordinateChange(baseHero, el);
    }
    if (dropItemArr.length) {
        dropItemArr = coordinateChange(baseHero, dropItemArr);
    }

  }
  baseHero.frameCountLimiter += baseHero.moveSpeed;

  return [baseHero, enemyArr, dropItemArr]
}

export default heroUpdate
