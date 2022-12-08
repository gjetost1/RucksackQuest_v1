import globalVars from "./GlobalVars"
import checkBoxCollision from "./CheckBoxCollision"
import { buildCMask } from "./CollisionMasks"

// const widthBlocks = GlobalVars.width / GlobalVars.blockSize
// const widthBlocks = GlobalVars.height / GlobalVars.blockSize

let breakActive = false

export class Patch {
  constructor(startX, startY, width, height, spriteSheets, density) {
    // console.log(x, y, width, height, spriteSheets)
    this.startX = startX
    this.startY = startY
    this.offsetX = 0
    this.offsetY = 0
    this.width = width
    this.height = height
    this.spriteSheets = spriteSheets
    this.density = density
    this.definitionArr = []
    this.generatePatch(this.startX, this.startY, this.width, this.height, this.spriteSheets, this.density)
  }

  generatePatch(startX, startY, width, height, spriteSheets, density) {
    this.definitionArr = []
    const xSpace = spriteSheets[0].blockSize * spriteSheets[0].xScale
    const ySpace = spriteSheets[0].blockSize * spriteSheets[0].yScale
    // const returnArr = []
    for(let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        if ((j < height / (height * density) && i < width / (width * density)) ||
        (j > height - (height / (height * density)) && i > width - (width / (height * density))) ||
        (j < height / (height * density) && i > width - (width / (height * density))) ||
        (j > height - (height / (height * density)) && i < width / (width * density))
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
        imgInstance.delay =  100 + (((j + 1) * 10) / (i + 1)) + Math.floor(Math.random() * 50)
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
// export const generatePatch = (startX, startY, height, width, img) => {

//   const xSpace = img[0].blockSize * img[0].xScale
//   const ySpace = img[0].blockSize * img[0].yScale
//   const returnArr = []
//   const cornerMulti = .4
//   for(let j = 0; j < height; j++) {
//     for (let i = 0; i < width; i++) {
//       if ((j < height / (height * cornerMulti) && i < width / (width * cornerMulti)) ||
//       (j > height - (height / (height * cornerMulti)) && i > width - (width / (height * cornerMulti))) ||
//       (j < height / (height * cornerMulti) && i > width - (width / (height * cornerMulti))) ||
//       (j > height - (height / (height * cornerMulti)) && i < width / (width * cornerMulti))
//       ) {
//         const skip = Math.random() * 10
//         if (skip > 4) { // gives chance that corner images will not be rendered to create a more organic shape to the patch
//           continue
//         }
//       }
//       let offset = 0
//       if(j % 2 === 0) {
//         offset = xSpace / 2
//       }
//       const randomizeImg = Math.floor(Math.random() * img.length)
//       const imgInstance = {...img[randomizeImg]}
//       imgInstance.delay =  100 + (((j + 1) * 10) / (i + 1) + Math.floor(Math.random() * 300))
//       const x = (startX + i * xSpace) + offset
//       const y = startY + j * ySpace
//       returnArr.push({
//         img: imgInstance,
//         x,
//         y,
//         cMasks: buildCMask([
//           {x, y, xBlocks: 1, yBlocks: 1, gridSize: imgInstance.blockSize}
//         ])
//       })
//     }
//   }
//   // console.log(returnArr)
//   return returnArr
// }


let windBlow = true // determines if the grass is animating or not

// renders an animated object to the background layer. should be called after main background render in basicRender or it will be covered up
// objects to be rendered should be passed in format created by generate patch above
const animatedObjectsRender = (objects, baseHero, backgroundCtx, foregroundCtx, collisionCtx) => {
if (!windBlow) {
  if(Math.floor(Math.random() * 1000) === 13) {
    windBlow = true
    // console.log('start wind')
  }
} else {
  if(Math.floor(Math.random() * 1000) === 29) {
    windBlow = false
    // console.log('stop wind')
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
    // el.x + globalVars.heroStartXCoord - baseHero.cameraX, el.y + globalVars.heroStartYCoord - baseHero.cameraY
    const globalX = el.x + baseHero.totalXChange
    const globalY = el.y + baseHero.totalYChange
    // this first if statement only allows animated elements to render if they are within one blocksize of the visible
    // canvas. Will need to change this if there are any elements that are larger than one blocksize
    if (
      (globalX > -globalVars.blockSize && globalX < globalVars.width + globalVars.blockSize)
      && (globalY > -globalVars.blockSize && globalY < globalVars.height + globalVars.blockSize)
      ) {
        if (windBlow || el.img.breaking  || (!windBlow && el.img.cropX < el.img.blockSize * el.img.maxAnimFrame - el.img.blockSize)) {
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

        // checks for attack collisions if hero is within 2 blocksizes of the element
        // also renders to collisionCanvas if the object is solid and not destroyed
          let collision = true
          if ((globalX > globalVars.heroCenterX - baseHero.blockSize && globalX < globalVars.heroCenterX + baseHero.blockSize)
          && (globalY > globalVars.heroCenterY - baseHero.blockSize && globalY < globalVars.heroCenterY + baseHero.blockSize)) {
            const xChange = el.x - globalX
            const yChange = el.y - globalY
            // console.log('checking')
            // console.log("before", el.cMasks[0])
            const tempCMasks = [{
              tl: [el.cMasks[0].tl[0] - xChange, el.cMasks[0].tl[1] - yChange],
              tr: [el.cMasks[0].tr[0] - xChange, el.cMasks[0].tr[1] - yChange],
              bl: [el.cMasks[0].bl[0] - xChange, el.cMasks[0].bl[1] - yChange],
              br: [el.cMasks[0].br[0] - xChange, el.cMasks[0].br[1] - yChange],
            }]
            // console.log("after", tempCMasks)
            // backgroundCtx.fillStyle = 'rgba(0, 255, 0, 1)'
            // backgroundCtx.fillRect(el.cMasks[0].tl[0] - xChange,  el.cMasks[0].tl[1] - yChange, 64, 64)
            collision = checkBoxCollision(baseHero.eventX, baseHero.eventY, colBox, tempCMasks, 0)
            && checkBoxCollision(baseHero.eventX, baseHero.eventY, colBox, tempCMasks, 1)
            && checkBoxCollision(baseHero.eventX, baseHero.eventY, colBox, tempCMasks, 2)
            && checkBoxCollision(baseHero.eventX, baseHero.eventY, colBox, tempCMasks, 3)

            // renders to collisionCanvas if the object is solid and not destroyed or breaking
            if (el.img.solid && !el.img.destroyed && !el.img.breaking) {
              // console.log('drawing collision')
              collisionCtx.drawImage(el.img.spriteSheet, el.img.cropX, el.img.cropY, el.img.blockSize, el.img.blockSize, el.x + globalVars.heroStartXCoord - baseHero.cameraX, el.y + globalVars.heroStartYCoord - baseHero.cameraY, el.img.blockSize, el.img.blockSize)
            }
          }


          if (baseHero.attackActive && !collision && !el.img.breaking && !el.img.destroyed) {
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
          const yChange = globalY - el.y
          // console.log(baseHero.heroY, el.y)

           // if there is a speedChange property to the object (eg grass slows you down) it is applied here
           if ((globalX + el.img.blockSize / 2 > globalVars.heroCenterX && globalX + el.img.blockSize / 2 < globalVars.heroCenterX + globalVars.blockSize)
           && (globalY + el.img.blockSize / 2 > globalVars.heroCenterY + globalVars.blockSize / 4  && globalY + el.img.blockSize / 2 < globalVars.heroCenterY + globalVars.blockSize )
           && el.img.speedChange
           && !el.img.destroyed
           && !el.img.breaking
           ) {
            if (baseHero.keys.Shift.pressed && baseHero.currentStam > 0) {
              baseHero.moveSpeed = baseHero.dashSpeed * el.img.speedChange
            } else {
              baseHero.moveSpeed = baseHero.baseMoveSpeed * el.img.speedChange
            }
           }

          if (el.img.breaking && el.img.cropX >= el.img.blockSize * (el.img.maxAnimFrame) || el.img.destroyed) {
            el.img.cropX = el.img.blockSize * (el.img.maxAnimFrame - 1)
            el.img.destroyed = true
            backgroundCtx.drawImage(el.img.spriteSheet, el.img.cropX, el.img.cropY, el.img.blockSize, el.img.blockSize, el.x + globalVars.heroStartXCoord - baseHero.cameraX, el.y + globalVars.heroStartYCoord - baseHero.cameraY, el.img.blockSize, el.img.blockSize)
          } else if (baseHero.heroY < yChange + el.y // renders grass on top of hero if heroY is less than the element's y coord
            ) {
            foregroundCtx.drawImage(el.img.spriteSheet, el.img.cropX, el.img.cropY, el.img.blockSize, el.img.blockSize, el.x + globalVars.heroStartXCoord - baseHero.cameraX, el.y + globalVars.heroStartYCoord - baseHero.cameraY, el.img.blockSize, el.img.blockSize)
          } else {
            backgroundCtx.drawImage(el.img.spriteSheet, el.img.cropX, el.img.cropY, el.img.blockSize, el.img.blockSize, el.x + globalVars.heroStartXCoord - baseHero.cameraX, el.y + globalVars.heroStartYCoord - baseHero.cameraY, el.img.blockSize, el.img.blockSize)
          }

      }
    // console.log(el.x - baseHero.cameraX - 3000, el.y - baseHero.cameraY - 3000)
  }
}

export default animatedObjectsRender
