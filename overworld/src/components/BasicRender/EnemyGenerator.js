class Sprite {
  constructor({ data, image, position, crop}) {
    this.data = data
    this.image = image
    this.position = position
    this.crop = crop
  }

  cropChange(cropX, cropY) {
    this.crop = {
      x: cropX,
      y: cropY
    }
  }

}

const enemyGenerator = (enemyArr) => {
  if (!enemyArr) return

  const enemyGroupArr = [] // array with all enemies in this group

  for (let enemy of enemyArr) {
    // create image of current sprite
    const enemyImg = new Image()
    enemyImg.src = enemy.base.currentSprite

    enemy.base.x = enemy.x
    enemy.base.y = enemy.y

    const enemySprite = new Sprite({
      data: enemy.base,
      image: enemyImg,
      position: {
        x: enemy.x,
        y: enemy.y
      },
      crop: {
        x: enemy.base.cropX,
        y: enemy.base.cropY
      }
    })

    enemyGroupArr.push(enemySprite)

  }

  return enemyGroupArr
}

export default enemyGenerator
