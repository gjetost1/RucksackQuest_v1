import globalVars from "./GlobalVars"

// moveOnSpawn moves item from center of corpse to it's actual position over a few frames
const moveOnSpawn = (el) => {
  // console.log(el.data.animCounter, el.data.animSpeed)
  if (el.data.animCounter >= el.data.animSpeed) {
    el.data.animCounter = 0
    if (el.data.animArc < 15) {
      el.data.startY -= globalVars.upscale * 3
    }
    if (el.data.startX < el.position.x) {
      el.data.startX += globalVars.upscale
    } else if (el.data.startX > el.position.x) {
      el.data.startX -= globalVars.upscale
    }
    if (el.data.startY < el.position.y) {
      el.data.startY += globalVars.upscale
    } else if (el.data.startY > el.position.y) {
      el.data.startY -= globalVars.upscale
    }
    if (el.data.startX === el.position.x && el.data.startY === el.position.y) {
      el.data.animating = false
    }
  }
  el.data.animCounter++
  el.data.animArc++
  return el
}

const dropItemRender = (dropItemArr, spriteCtx) => {

  for (let el of dropItemArr) {

    if (el.data.animating) {
      // console.log('animating')
      el = moveOnSpawn(el)
      spriteCtx.drawImage(
        el.image,
        0,
        0,
        el.data.blockSize,
        el.data.blockSize,
        el.data.startX,
        el.data.startY,
        el.data.blockSize,
        el.data.blockSize
      );
    } else {
      spriteCtx.drawImage(
        el.image,
        0,
        0,
        el.data.blockSize,
        el.data.blockSize,
        el.position.x,
        el.position.y,
        el.data.blockSize,
        el.data.blockSize
      )
    }

    // console.log(el.data.name, el.data.x, el.data.y)

  }
  return dropItemArr
}

export default dropItemRender
