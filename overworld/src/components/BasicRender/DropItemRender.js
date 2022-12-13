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
let hoverActive = false // used to allow only one item to be highlighted at a time
const dropItemRender = (dropItemArr, spriteCtx, cursor) => {

  for (let el of dropItemArr) {
    // console.log(cursor.x, el.data.x, cursor.y, el.data.y)
    if (!hoverActive
      && cursor.x >= el.data.x - 48 * globalVars.upscale
      && cursor.x <= el.data.x + el.data.blockSize - 48 * globalVars.upscale
      && cursor.y >= el.data.y - 48 * globalVars.upscale
      && cursor.y <= el.data.y + el.data.blockSize - 48 * globalVars.upscale) {
        el.data.cropX = el.data.blockSize
        hoverActive = true
      } else {
        el.data.cropX = 0
      }

    if (el.data.animating) {
      // console.log('animating')
      el = moveOnSpawn(el)
      spriteCtx.drawImage(
        el.image,
        el.data.cropX,
        el.data.cropY,
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
        el.data.cropX,
        el.data.cropY,
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
  hoverActive = false
  return dropItemArr
}

export default dropItemRender
