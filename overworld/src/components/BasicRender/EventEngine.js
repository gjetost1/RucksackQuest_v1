const eventEngine = (baseHero, type) => {
  // let {
  //   x,
  //   y,
  //   heroDirection,
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
      baseHero.currentStam -= baseHero.stamDrain * baseHero.stamAttack
    }
    const middleVal = (baseHero.blockSize - baseHero.attackBlockSize) / 2
    if (baseHero.heroDirection === 'up') {
      baseHero.eventX = baseHero.heroX + middleVal
      baseHero.eventY = baseHero.heroY
    } else if (baseHero.heroDirection === 'down') {
      baseHero.eventX = baseHero.heroX + middleVal
      baseHero.eventY = baseHero.heroY + baseHero.blockSize - baseHero.attackBlockSize
    } else if (baseHero.heroDirection === 'left') {
      baseHero.eventX = baseHero.heroX
      baseHero.eventY = baseHero.heroY + middleVal
    } else if (baseHero.heroDirection === 'right') {
      baseHero.eventX = baseHero.heroX + baseHero.blockSize - baseHero.attackBlockSize
      baseHero.eventY = baseHero.heroY + middleVal
    } else if (baseHero.heroDirection === 'upleft') {
      baseHero.eventX = baseHero.heroX + baseHero.attackBlockSize / 2
      baseHero.eventY = baseHero.heroY + baseHero.attackBlockSize / 2
    } else if (baseHero.heroDirection === 'upright') {
      baseHero.eventX = baseHero.heroX + baseHero.blockSize - baseHero.attackBlockSize
      baseHero.eventY = baseHero.heroY + baseHero.attackBlockSize / 2
    } else if (baseHero.heroDirection === 'downleft') {
      baseHero.eventX = baseHero.heroX + baseHero.attackBlockSize / 2
      baseHero.eventY = baseHero.heroY + baseHero.blockSize - baseHero.attackBlockSize
    } else if (baseHero.heroDirection === 'downright') {
      baseHero.eventX = baseHero.heroX + baseHero.blockSize - baseHero.attackBlockSize * 2
      baseHero.eventY = baseHero.heroY + baseHero.blockSize - baseHero.attackBlockSize
    }
  }



  return baseHero

}

export default eventEngine
