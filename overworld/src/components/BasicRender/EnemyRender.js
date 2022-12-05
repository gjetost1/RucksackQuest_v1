
const enemyRender = (enemyArr) => {
  if (!enemyArr) return

  for (let el of enemyArr) {
    // set the sprite position to the current enemyObject coordinates
    el.enemySprite.position = {
      x: el.enemyObject.x,
      y: el.enemyObject.y,
    }
    // set the animation crop of the sprite
    el.enemySprite.cropChange(el.enemyObject.cropX, el.enemyObject.cropY)

    // sets the right direction spriteSheet for the sprite
    el.enemyImg.src = el.enemyObject.currentSprite

    el.enemySprite.draw()
  }
  return enemyArr
}

export default enemyRender
