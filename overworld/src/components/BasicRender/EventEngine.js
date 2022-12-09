const eventEngine = (baseHero, type) => {
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
  if (baseHero.currentStam >= baseHero.stamDrain * baseHero.stamAttack) {
    if (baseHero.attackActive) {
      baseHero.currentStam -= baseHero.stamDrain * baseHero.stamAttack;
    }
    const middleVal = (baseHero.blockSize - baseHero.attackBlockSize) / 2;
    if (baseHero.direction === "up") {
      baseHero.eventX = baseHero.x + middleVal;
      baseHero.eventY = baseHero.y;
    } else if (baseHero.direction === "down") {
      baseHero.eventX = baseHero.x + middleVal;
      baseHero.eventY =
        baseHero.y + baseHero.blockSize - baseHero.attackBlockSize;
    } else if (baseHero.direction === "left") {
      baseHero.eventX = baseHero.x;
      baseHero.eventY = baseHero.y + middleVal;
    } else if (baseHero.direction === "right") {
      baseHero.eventX =
        baseHero.x + baseHero.blockSize - baseHero.attackBlockSize;
      baseHero.eventY = baseHero.y + middleVal;
    } else if (baseHero.direction === "upleft") {
      baseHero.eventX = baseHero.x + baseHero.attackBlockSize / 2;
      baseHero.eventY = baseHero.y + baseHero.attackBlockSize / 2;
    } else if (baseHero.direction === "upright") {
      baseHero.eventX =
        baseHero.x + baseHero.blockSize - baseHero.attackBlockSize;
      baseHero.eventY = baseHero.y + baseHero.attackBlockSize / 2;
    } else if (baseHero.direction === "downleft") {
      baseHero.eventX = baseHero.x + baseHero.attackBlockSize / 2;
      baseHero.eventY =
        baseHero.y + baseHero.blockSize - baseHero.attackBlockSize;
    } else if (baseHero.direction === "downright") {
      baseHero.eventX =
        baseHero.x + baseHero.blockSize - baseHero.attackBlockSize * 2;
      baseHero.eventY =
        baseHero.y + baseHero.blockSize - baseHero.attackBlockSize;
    }
  }

  return baseHero
};

export default eventEngine
