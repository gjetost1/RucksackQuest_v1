import enemyMoveEngine from "./EnemyMoveEngine"
import GlobalVars from "./GlobalVars"

const enemyUpdate = (enemyArr, baseHero, collisionCtx, spriteCtx) => {
  if (!enemyArr) return


  for (let el of enemyArr) {
    if (el.data.x <= 0
      || el.data.x >= GlobalVars.width
      || el.data.y <= 0
      || el.data.y >= GlobalVars.height) {
        continue
      }
    // if the frameCountLimiter has been reached run the moveEngine to move
    // the enemy
    if (el.data.frameCountLimiter >= el.data.maxFrameCountLimiter) {
      el.data = enemyMoveEngine(el.data, collisionCtx, spriteCtx)
      // console.log(el.data)
      el.data.frameCountLimiter = 0
    }
    el.data.frameCountLimiter += el.data.moveSpeed

    // set the sprite position to the current enemyObject coordinates
    el.position = {
      x: el.data.x,
      y: el.data.y,
    }
    // set the animation crop of the sprite
    el.cropChange(el.data.cropX, el.data.cropY)

    // sets the right direction spriteSheet for the sprite
    el.image.src = el.data.currentSprite


    // spriteCtx.drawImage(el.image, el.crop.x, el.crop.y, el.data.blockSize, el.data.blockSize, el.position.x, el.position.y, el.data.blockSize, el.data.blockSize)
    // spriteCtx.fillStyle = 'rgba(255, 0, 0, 1)'
    // spriteCtx.fillRect(el.position.x, el.position.y, el.data.blockSize, el.data.blockSize)
  }
  return enemyArr
}

export default enemyUpdate
