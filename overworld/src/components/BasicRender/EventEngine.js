const eventEngine = (baseHero) => {
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
  const middleVal = (baseHero.blockSize - baseHero.attackBlockSize) / 2
  if (baseHero.heroDirection === 'up') {
    baseHero.eventX = baseHero.x + middleVal
    baseHero.eventY = baseHero.y
  } else if (baseHero.heroDirection === 'down') {
    baseHero.eventX = baseHero.x + middleVal
    baseHero.eventY = baseHero.y + baseHero.attackBlockSize * 3
  } else if (baseHero.heroDirection === 'left') {
    baseHero.eventX = baseHero.x
    baseHero.eventY = baseHero.y + middleVal
  } else if (baseHero.heroDirection === 'right') {
    baseHero.eventX = baseHero.x + baseHero.blockSize - baseHero.attackBlockSize
    baseHero.eventY = baseHero.y + middleVal
  } else if (baseHero.heroDirection === 'upleft') {
    baseHero.eventX = baseHero.x + baseHero.attackBlockSize / 2
    baseHero.eventY = baseHero.y + baseHero.attackBlockSize / 2
  } else if (baseHero.heroDirection === 'upright') {
    baseHero.eventX = baseHero.x + baseHero.blockSize - baseHero.attackBlockSize
    baseHero.eventY = baseHero.y + baseHero.attackBlockSize / 2
  } else if (baseHero.heroDirection === 'downleft') {
    baseHero.eventX = baseHero.x + baseHero.attackBlockSize / 2
    baseHero.eventY = baseHero.y + baseHero.blockSize - baseHero.attackBlockSize
  } else if (baseHero.heroDirection === 'downright') {
    baseHero.eventX = baseHero.x + baseHero.blockSize - baseHero.attackBlockSize * 2
    baseHero.eventY = baseHero.y + baseHero.blockSize - baseHero.attackBlockSize
  }

  return baseHero

}

export default eventEngine
