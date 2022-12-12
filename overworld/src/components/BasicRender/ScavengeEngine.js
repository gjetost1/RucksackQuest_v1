import pixelPerfect from "./PixelPerfect"
import globalVars from "./GlobalVars"

class dropItem {
  constructor({ image, position, data}) {
    this.image = image
    this.position = position
    this.data = {...data}
    this.data.x = position.x
    this.data.y = position.y
    this.data.startX = 0
    this.data.startY = 0
    this.data.animating = true
    this.data.animCounter = 0
    this.data.animSpeed = 3
    this.data.animArc = 0
  }
}

const generateDropTable = (dropTable) => {
  const newDropTable = []
  let probabilityCounter = -1
  for (let el of dropTable) {
    let min = probabilityCounter + 1
    probabilityCounter += el.dropPercent
    let max = probabilityCounter
    newDropTable.push(
      {
        min,
        max,
        item: el
      }
    )
  }
  return newDropTable
}

// handles scavenging of corpses and creating drops
let scavengeCounter = 0
const scavengeEngine = (target, baseHero, dropItemArr, enemyCollision) => {
  const randomScavengeTime = Math.floor(Math.random() * 400) // variable scavenging time
  const scavengeFrames = 100 + randomScavengeTime // determines how many frames the scavenging takes before returning something
  // const scavengeFrames = 100
  let scavengedItem = null // item that will be returned
  if (baseHero.scavengeActive &&
    !enemyCollision &&
    target.data.dead &&
    target.data.scavengeable) {
      // console.log('scavenging', scavengeCounter)
      baseHero.scavengeAnimActive = true
      scavengeCounter++
      // once scavenging is complete we roll to find out what item is returned
      if (scavengeCounter >= scavengeFrames) {
        baseHero.scavengeActive = false
        target.data.scavenged = true
        scavengeCounter = 0
        const scavengeTable = generateDropTable(target.data.scavengeTable) // creates an array from the target's drop table with probability numbers
        const randomRoll = Math.floor(Math.random() * 100) // random percent roll 0-99
        // console.log('roll', randomRoll)
        for (let el of scavengeTable) {
          if (el.min <= randomRoll && el.max >= randomRoll) {
            // console.log(el.min, el.max, el.item.name)
            let randomPositionX = target.data.x + target.data.blockSize / 2 + Math.ceil((Math.random() - 0.5) * target.data.blockSize * 2)
            let randomPositionY = target.data.y + target.data.blockSize / 2 + Math.ceil((Math.random() - 0.5) * target.data.blockSize * 2)
            randomPositionX =  pixelPerfect(
              randomPositionX,
              "down",
              "x",
              globalVars.upscale
            );
            randomPositionY =  pixelPerfect(
              randomPositionY,
              "down",
              "y",
              globalVars.upscale
            );

            //
            if (el.item.name === 'Nothing') {
              return [target, baseHero, dropItemArr]
            }
              const newItemImage = new Image()
              newItemImage.src = el.item.image
              scavengedItem = new dropItem({
                image: newItemImage,
                position: {
                  x: randomPositionX,
                  y: randomPositionY
                },
                data: el.item
              })
              scavengedItem.data.x = randomPositionX
              scavengedItem.data.y = randomPositionY
              scavengedItem.data.startX = target.data.x + target.data.blockSize / 2
              scavengedItem.data.startY = target.data.y + target.data.blockSize / 2

              dropItemArr.push(scavengedItem)
              // console.log(dropItemArr)
              return [target, baseHero, dropItemArr]
          }
        }
      }
    } else {
      return [target, baseHero, dropItemArr]
    }

  return [target, baseHero, dropItemArr]
}

export default scavengeEngine
