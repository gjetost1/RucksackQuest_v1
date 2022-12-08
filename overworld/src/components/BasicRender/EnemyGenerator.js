import { buildCMask } from "./CollisionMasks"

class EnemySprite {
  constructor({ data, image, position, crop}) {
    this.data = data
    this.image = image
    this.position = position
    this.crop = crop
    this.cMasks = buildCMask([
      {x: position.x, y: position.y, xBlocks: 1, yBlocks: 1, gridSize: data.blockSize}
    ])
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
    const enemyData = {...enemy.base} // makes a copy of the base enemy
    // create image of current sprite
    const enemyImg = new Image()
    enemyImg.src = enemyData.currentSprite


    enemyData.x = enemy.x
    enemyData.y = enemy.y

    const enemySprite = new EnemySprite({
      data: enemyData,
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

    // randomizes where the enemy is facing
    enemySprite.data.direction = enemySprite.data.moveDirections[Math.floor(Math.random() * enemySprite.data.moveDirections.length)]
    enemySprite.data.currentSprite = enemySprite.data.spriteSheets[enemySprite.data.direction]

    enemyGroupArr.push(enemySprite)

  }

  return enemyGroupArr
}

export default enemyGenerator
