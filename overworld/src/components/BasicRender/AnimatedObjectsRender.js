import globalVars from "./GlobalVars"
import checkCollision from "./CheckCollision"
import { buildCMask } from "./CollisionMasks"

// const widthBlocks = GlobalVars.width / GlobalVars.blockSize
// const widthBlocks = GlobalVars.height / GlobalVars.blockSize

let breakActive = false

export class Patch {
  constructor(startX, startY, width, height, spriteSheets) {
    // console.log(x, y, width, height, spriteSheets)
    this.startX = globalVars.middleX + startX
    this.startY = globalVars.middleY + startY
    this.offsetX = startX
    this.offsetY = startY
    this.width = width
    this.height = height
    this.spriteSheets = spriteSheets
    this.definitionArr = []
    this.generatePatch(this.startX, this.startY, this.width, this.height, this.spriteSheets)
  }

  generatePatch(startX, startY, width, height, spriteSheets) {
    console.log('generate')
    this.definitionArr = []
    const xSpace = spriteSheets[0].blockSize * spriteSheets[0].xScale
    const ySpace = spriteSheets[0].blockSize * spriteSheets[0].yScale
    const returnArr = []
    const cornerMulti = .4
    for(let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        if ((j < height / (height * cornerMulti) && i < width / (width * cornerMulti)) ||
        (j > height - (height / (height * cornerMulti)) && i > width - (width / (height * cornerMulti))) ||
        (j < height / (height * cornerMulti) && i > width - (width / (height * cornerMulti))) ||
        (j > height - (height / (height * cornerMulti)) && i < width / (width * cornerMulti))
        ) {
          const skip = Math.random() * 10
          if (skip > 4) { // gives chance that corner images will not be rendered to create a more organic shape to the patch
            continue
          }
        }
        let offset = 0
        if(j % 2 === 0) {
          offset = xSpace / 2
        }
        const randomizeImg = Math.floor(Math.random() * spriteSheets.length)
        const imgInstance = {...spriteSheets[randomizeImg]}
        imgInstance.delay =  100 + (((j + 1) * 10) / (i + 1))
        const x = (startX + i * xSpace) + offset
        const y = startY + j * ySpace
        this.definitionArr.push({
          img: imgInstance,
          x,
          y,
          cMasks: buildCMask([
            {x, y, xBlocks: 1, yBlocks: 1, gridSize: imgInstance.blockSize}
          ])
        })
      }
    }
    console.log(this.definitionArr)
  }

  getOffset() {
    return {x: this.offsetX, y: this.offsetY}
  }

  move(x, y) {
    this.startX = x + this.offsetX
    this.startY = y + this.offsetY
    this.generatePatch(this.startX, this.startY, this.width, this.height, this.spriteSheets)
  }

  definition() {
    return this.definitionArr
  }
}


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
  const cornerMulti = .4
  for(let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      if ((j < height / (height * cornerMulti) && i < width / (width * cornerMulti)) ||
      (j > height - (height / (height * cornerMulti)) && i > width - (width / (height * cornerMulti))) ||
      (j < height / (height * cornerMulti) && i > width - (width / (height * cornerMulti))) ||
      (j > height - (height / (height * cornerMulti)) && i < width / (width * cornerMulti))
      ) {
        const skip = Math.random() * 10
        if (skip > 4) { // gives chance that corner images will not be rendered to create a more organic shape to the patch
          continue
        }
      }
      let offset = 0
      if(j % 2 === 0) {
        offset = xSpace / 2
      }
      const randomizeImg = Math.floor(Math.random() * img.length)
      const imgInstance = {...img[randomizeImg]}
      imgInstance.delay =  100 + (((j + 1) * 10) / (i + 1))
      const x = (startX + i * xSpace) + offset
      const y = startY + j * ySpace
      returnArr.push({
        img: imgInstance,
        x,
        y,
        cMasks: buildCMask([
          {x, y, xBlocks: 1, yBlocks: 1, gridSize: imgInstance.blockSize}
        ])
      })
    }
  }
  // console.log(returnArr)
  return returnArr
}


let windBlow = true // determines if the grass is animating or not

// renders an animated object to the background layer. should be called after main background render in basicRender or it will be covered up
// objects to be rendered should be passed in format created by generate patch above
const animatedObjectsRender = (objects, baseHero, backgroundCtx, foregroundCtx) => {

if (!windBlow) {
  if(Math.floor(Math.random() * 1000) === 13) {
    windBlow = true
    console.log('start wind')
  }
} else {
  if(Math.floor(Math.random() * 1000) === 29) {
    windBlow = false
    console.log('stop wind')
  }
}


  if (baseHero.attackActive && !breakActive) {
    breakActive = true
  }


  const colBox = [
    [0, 0],
    [baseHero.attackBlockSize, 0],
    [baseHero.attackBlockSize, baseHero.attackBlockSize],
    [0, baseHero.attackBlockSize],
  ]

  for (let el of objects) {

  if(windBlow || el.img.breaking  || (!windBlow && el.img.cropX < el.img.blockSize * el.img.maxAnimFrame - el.img.blockSize)) {
    // animates each object
    el.img.currentDelayFrame++
    if (el.img.currentDelayFrame >= el.img.delay) {
      el.img.currentAnimFrame++
    }
    if (el.img.currentAnimFrame >= el.img.animFrameLimit) {
      el.img.cropX += el.img.blockSize
      el.img.currentAnimFrame = 0
    }
    if (el.img.cropX >= el.img.blockSize * el.img.maxAnimFrame && !el.img.destroyed && !el.img.breaking) {
      el.img.cropX = 0
      el.img.currentDelayFrame = 0
    }
  }

    const collision = checkCollision(baseHero.eventX, baseHero.eventY, colBox, el.cMasks, 0)
    && checkCollision(baseHero.eventX, baseHero.eventY, colBox, el.cMasks, 1)
    && checkCollision(baseHero.eventX, baseHero.eventY, colBox, el.cMasks, 2)
    && checkCollision(baseHero.eventX, baseHero.eventY, colBox, el.cMasks, 3)

    if (!collision && !el.img.breaking && !el.img.destroyed) {
      //plays sound effect on destroy, if any
      if(el.img.sfx) {
        el.img.sfx.volume = 0.2;
        el.img.sfx.play();
      }
      el.img.breaking = true // puts animated element into breaking state, which
      el.img.cropX = (el.img.maxAnimFrame ) * el.img.blockSize
      el.img.animFrameLimit = 14
      el.img.minAnimFrame = el.img.maxAnimFrame
      el.img.maxAnimFrame = el.img.maxAnimFrame + el.img.breakImgFrames
      el.img.delay = 0
    }
    if (el.img.breaking && el.img.cropX >= el.img.blockSize * (el.img.maxAnimFrame) || el.img.destroyed) {
      el.img.cropX = el.img.blockSize * (el.img.maxAnimFrame - 1)
      el.img.destroyed = true
      backgroundCtx.drawImage(el.img.spriteSheet, el.img.cropX, el.img.cropY, el.img.blockSize, el.img.blockSize, el.x, el.y, el.img.blockSize, el.img.blockSize)
    } else if (baseHero.y < el.y
      ) {
      foregroundCtx.drawImage(el.img.spriteSheet, el.img.cropX, el.img.cropY, el.img.blockSize, el.img.blockSize, el.x, el.y, el.img.blockSize, el.img.blockSize)
    } else {
      backgroundCtx.drawImage(el.img.spriteSheet, el.img.cropX, el.img.cropY, el.img.blockSize, el.img.blockSize, el.x, el.y, el.img.blockSize, el.img.blockSize)
    }

  }
}

export default animatedObjectsRender
