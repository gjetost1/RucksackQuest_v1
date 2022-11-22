import globalVars from "./GlobalVars"
import checkCollision from "./CheckCollision"
import { buildCMask } from "./CollisionMasks"

// const widthBlocks = GlobalVars.width / GlobalVars.blockSize
// const widthBlocks = GlobalVars.height / GlobalVars.blockSize

let breakActive = false

// generatePatch creates a patch of whatever animateImage you pass as argument img
// see AnimatedObjects.js for example of format of object to pass here
// startX and startY are the coordinates for the upper left corner of the patch
// xScale and yScale determine how close together the images are. a value of 1
// places each image as its full width and height, less than that crunches them
// together.
export const generatePatch = (startX, startY, height, width, img) => {
  const xSpace = img[0].blockSize * img[0].xScale
  const ySpace = img[0].blockSize * img[0].yScale
  const returnArr = []
  for(let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      if ((j < height / (height * .5) && i < width / (width * .5)) ||
      (j > height - (height / (height * .5)) && i > width - (width / (height * .5))) ||
      (j < height / (height * .5) && i > width - (width / (height * .5))) ||
      (j > height - (height / (height * .5)) && i < width / (width * .5))
      ) {
        // const skip = Math.random() * 10
        // if (skip > 2) { // gives chance that corner images will not be rendered to create a more organic shape to the patch
          continue
        // }
      }
      let offset = 0
      if(j % 2 === 0) {
        offset = xSpace / 2
      }
      // const randomizeImg = Math.floor(Math.random() * 2)
      returnArr.push({
        img: img[0],
        x: (startX + i * xSpace) + offset,
        y: startY + j * ySpace
      })
    }
  }
  return returnArr
}

// renders an animated object to the background layer. should be called after main background render in basicRender or it will be covered up
// objects to be rendered should be passed in format created by generate patch above
const animatedObjectsRender = (objects, baseHero, eventObj, backgroundCtx, foregroundCtx) => {
  if (baseHero.attackActive && !breakActive) {
    breakActive = true
  }

  for (let el of objects) {
    if (eventObj.eventY < el.y
       && eventObj.eventY + (eventObj.blockSize / 2) > el.y
      && eventObj.eventX + eventObj.blockSize > el.x + (el.img.blockSize - el.img.blockSize * (el.img.xScale * .5))
      && eventObj.eventX < el.x + el.img.blockSize - (el.img.blockSize - el.img.blockSize * (el.img.xScale * .5))
      && baseHero.attackActive
      ) {
        console.log('hit!!')
        el.minAnimFrame = el.maxAnimFrame
        el.maxAnimFrame = el.maxAnimFrame + el.breakImgFrames
        el.currentAnimFrame = 0
        el.currentDelayFrame = el.delay
        foregroundCtx.drawImage(el.img.breakImg, el.img.cropX, el.img.cropY, el.img.blockSize, el.img.blockSize, el.x, el.y, el.img.blockSize, el.img.blockSize)
    } else if (baseHero.y < el.y
      //  && baseHero.y + (baseHero.blockSize / 2) > el.y
      // && baseHero.x + baseHero.blockSize > el.x + (el.img.blockSize - el.img.blockSize * el.img.xScale)
      // && baseHero.x < el.x + el.img.blockSize - (el.img.blockSize - el.img.blockSize * el.img.xScale)
      ) {
      foregroundCtx.drawImage(el.img.spriteSheet, el.img.cropX, el.img.cropY, el.img.blockSize, el.img.blockSize, el.x, el.y, el.img.blockSize, el.img.blockSize)
    } else {

      backgroundCtx.drawImage(el.img.spriteSheet, el.img.cropX, el.img.cropY, el.img.blockSize, el.img.blockSize, el.x, el.y, el.img.blockSize, el.img.blockSize)
    }

  }
}

export default animatedObjectsRender
