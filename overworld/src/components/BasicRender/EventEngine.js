const eventEngine = (eventObj) => {
  let {
    x,
    y,
    heroDirection,
    eventX,
    eventY,
    blockSize,
    eventType,
    eventDirection,
    eventAreaShape,
    eventXDim,
    eventYDim,
    eventEffect,
    eventDuration,
    eventTimeout,
    eventAnim,
  } = eventObj

  if (heroDirection === 'up') {
    eventObj.eventX = x
    eventObj.eventY = y - blockSize
  } else if (heroDirection === 'down') {
    eventObj.eventX = x
    eventObj.eventY = y + blockSize
  } else if (heroDirection === 'left') {
    eventObj.eventX = x - blockSize
    eventObj.eventY = y
  } else if (heroDirection === 'right') {
    eventObj.eventX = x + blockSize
    eventObj.eventY = y
  } else if (heroDirection === 'upleft') {
    eventObj.eventX = x - blockSize
    eventObj.eventY = y - blockSize
  } else if (heroDirection === 'upright') {
    eventObj.eventX = x + blockSize
    eventObj.eventY = y - blockSize
  } else if (heroDirection === 'downleft') {
    eventObj.eventX = x - blockSize
    eventObj.eventY = y + blockSize
  } else if (heroDirection === 'downright') {
    eventObj.eventX = x + blockSize
    eventObj.eventY = y + blockSize
  }

  return eventObj

}

export default eventEngine
