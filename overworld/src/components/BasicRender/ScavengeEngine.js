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
let randomScavengeTime = 0
// let genRandomFrames = true
let currentTarget = null

const scavengeEngine = (target, baseHero, dropItemArr, enemyCollision) => {
  // console.log('in scavenge engine', target, baseHero, dropItemArr, enemyCollision)
  // if (genRandomFrames) {
  //   randomScavengeTime = Math.floor(Math.random() * 200) // variable scavenging time
  //   genRandomFrames = false
  //   scavengeCounter = 0
  // }

  if (currentTarget !== target) {
    scavengeCounter = 0
    randomScavengeTime = Math.floor(Math.random() * 200) // variable scavenging time
    currentTarget = target
  }
  const scavengeFrames = 200 + randomScavengeTime // determines how many frames the scavenging takes before returning something
  // const scavengeFrames = 200

  let scavengedItem = null // item that will be returned

  if (baseHero.scavengeActive &&
    target.data.dead &&
    target.data.scavengeable) {
      // console.log('scavenging', scavengeCounter)
      // baseHero.scavengeAnimation = true
      scavengeCounter++

      // if (scavengeCounter === scavengeFrames - 20) {
      //   // console.log('sound')
      //   baseHero.scavengeFx.play()

      // }

      console.log(scavengeCounter, scavengeFrames)
      // once scavenging is complete we roll to find out what item is returned
      if (scavengeCounter >= scavengeFrames) {
        baseHero.scavengeFx.play()
        baseHero.scavengeActive = false
        baseHero.scavengeAnimation = false
        baseHero.scavengePause = true
        // genRandomFrames = true
        setTimeout(() => {
          baseHero.scavengePause = false
        }, 1000)
        target.data.scavenged = true
        scavengeCounter = 0
        const scavengeTable = generateDropTable(target.data.scavengeTable) // creates an array from the target's drop table with probability numbers
        const randomRoll = Math.floor(Math.random() * 100) // random percent roll 0-99
        // console.log('roll', randomRoll)
        for (let el of scavengeTable) {
          if (el.min <= randomRoll && el.max >= randomRoll) {
            // console.log(el.min, el.max, el.item.name)
            // create random variability for how far the drop lands from the corpse
            let randomX = Math.ceil((Math.random() - 0.5) * target.data.blockSize)
            let randomY = Math.ceil((Math.random() - 0.5) * target.data.blockSize)
            if (randomX > 0 && randomX < target.data.blockSize / 3) {
              randomX = Math.round(randomX + target.data.blockSize / 3)
            } else if (randomX <= 0 && randomX > -target.data.blockSize / 3) {
              randomX = Math.round(randomX - target.data.blockSize / 3)
            }
            if (randomY > 0 && randomY < target.data.blockSize / 3) {
              randomY = Math.round(randomY + target.data.blockSize / 3)
            } else if (randomY <= 0 && randomY > -target.data.blockSize / 3) {
              randomY = Math.round(randomX - target.data.blockSize / 3)
            }
            // console.log(randomX, randomY)
            let randomPositionX = target.data.x + target.data.blockSize / 2 + randomX
            let randomPositionY = target.data.y + target.data.blockSize / 2 + randomY
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
