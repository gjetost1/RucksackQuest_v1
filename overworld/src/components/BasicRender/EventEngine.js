const eventEngine = (actor, type) => {
  // let {
  //   x,
  //   y,
  //   direction,
  //   eventX,
  //   eventY,
  //   blockSize,
  //   eventType,
  //   eventDirection,
  //   eventAreaShape,
  //   eventXDim,
  //   eventYDim,
  //   eventEffect,
  //   eventDuration,
  //   eventTimeout,
  //   eventAnim,
  // } = eventObj


  // this chain determines where the event hitbox will appear based on the direction
  // the hero is facing
  if (actor.currentFatigue >= actor.fatigueDrain * actor.fatigueAttack) {
    if (actor.attackActive) {
      actor.currentFatigue -= actor.fatigueDrain * actor.fatigueAttack;
    }
    const middleVal = (actor.blockSize - actor.attackBlockSize) / 2;
    console.log(middleVal)
    if (actor.direction === "up") {
      actor.eventX = actor.x + middleVal;
      actor.eventY = actor.y;
    } else if (actor.direction === "down") {
      actor.eventX = actor.x + middleVal;
      actor.eventY =
        actor.y + actor.blockSize - actor.attackBlockSize;
    } else if (actor.direction === "left") {
      actor.eventX = actor.x;
      actor.eventY = actor.y + middleVal;
    } else if (actor.direction === "right") {
      actor.eventX =
        actor.x + actor.blockSize - actor.attackBlockSize;
      actor.eventY = actor.y + middleVal;
    } else if (actor.direction === "upleft") {
      actor.eventX = actor.x + actor.attackBlockSize / 2;
      actor.eventY = actor.y + actor.attackBlockSize / 2;
    } else if (actor.direction === "upright") {
      actor.eventX =
        actor.x + actor.blockSize - actor.attackBlockSize;
      actor.eventY = actor.y + actor.attackBlockSize / 2;
    } else if (actor.direction === "downleft") {
      actor.eventX = actor.x + actor.attackBlockSize / 2;
      actor.eventY =
        actor.y + actor.blockSize - actor.attackBlockSize;
    } else if (actor.direction === "downright") {
      actor.eventX =
        actor.x + actor.blockSize - actor.attackBlockSize * 2;
      actor.eventY =
        actor.y + actor.blockSize - actor.attackBlockSize;
    }
  }

  return actor
};

export default eventEngine
