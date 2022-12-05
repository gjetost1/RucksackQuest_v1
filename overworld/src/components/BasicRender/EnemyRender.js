import enemyMoveEngine from "./EnemyMoveEngine"

const enemyRender = (enemyArr, spriteCtx) => {
  if (!enemyArr) return

  for (let el of enemyArr) {
    // console.log(el.position.x, el.position.y, el.data.x, el.data.y)
    spriteCtx.drawImage(el.image, el.crop.x, el.crop.y, el.data.blockSize, el.data.blockSize, el.position.x, el.position.y, el.data.blockSize, el.data.blockSize)
    // spriteCtx.fillStyle = 'rgba(255, 0, 0, 1)'
    // spriteCtx.fillRect(el.position.x, el.position.y, el.data.blockSize, el.data.blockSize)
  }
  return enemyArr
}

export default enemyRender
