import globalVars from "./GlobalVars"
import { hudHeart, bloodContainer_1, bloodContainer_2 } from "./HudObjects"
import veins from '../../assets/hud/veins_2.png'
import ui_background from '../../assets/hud/UI_background.png'

const veins_img = new Image()
veins_img.src = veins

const ui_background_img = new Image()
ui_background_img.src = ui_background


const hudRender = (spriteCtx, cursorCtx, foregroundCtx, currentStam, maxStam, attackCooldownOff, coolDownLevel, coolDownLevelMax, playerSprite, heroBlockSize, swordIcon, ) => {
  const upscale = globalVars.upscale

    // sets color of stamina bar based on remaining stamina percentage
  // if (currentStam > maxStam - maxStam / 3) {
  //   hudHeart.animFrames = hudHeart.animFramesBase
  // } else if (currentStam > maxStam - (maxStam / 3) * 2) {
  //   hudHeart.animFrames = 16
  // } else {
  //   hudHeart.animFrames = 10
  // }
  // console.log(hudHeart.animFramesBase * (currentStam / maxStam))

  // cursorCtx.drawImage(veins_img, 0, 0, 256, 64, 104, 32, 256, 64)
  // foregroundCtx.globalAlpha = 1
  // foregroundCtx.drawImage(ui_background_img, 0, 0, 384, 192, 0, 0, 384, 192)
  // foregroundCtx.globalAlpha = .85

  cursorCtx.drawImage(veins_img, 0, 0, 256, 64, 104, globalVars.perfectHeight - 100, 256, 64)
  foregroundCtx.globalAlpha = 1
  foregroundCtx.drawImage(ui_background_img, 0, 0, 384, 192, 0, globalVars.perfectHeight - 136, 384, 192)
  foregroundCtx.globalAlpha = .85
  const bloodStaminaLevel = 72 + Math.round((256 * (currentStam / maxStam)) / globalVars.upscale) * globalVars.upscale
  // cursorCtx.clearRect(Math.round((320 * (health / maxHealth)) / globalVars.upscale) * globalVars.upscale , 32, 256, 64)
  cursorCtx.clearRect(bloodStaminaLevel, globalVars.perfectHeight - 100, 256, 64)


  cursorCtx.drawImage(bloodContainer_1.image, bloodContainer_1.crop.x, bloodContainer_1.crop.y, bloodContainer_1.blockSize, bloodContainer_1.blockSize, bloodContainer_1.position.x, bloodContainer_1.position.y, bloodContainer_1.blockSize, bloodContainer_1.blockSize)
  cursorCtx.drawImage(bloodContainer_2.image, bloodContainer_1.crop.x, bloodContainer_1.crop.y, bloodContainer_2.blockSize, bloodContainer_2.blockSize, bloodContainer_2.position.x, bloodContainer_2.position.y, bloodContainer_2.blockSize, bloodContainer_2.blockSize)

  //animate blood container
  if (bloodContainer_1.animCounter >= bloodContainer_1.animFrames) {
    bloodContainer_1.crop.x += bloodContainer_1.blockSize
    bloodContainer_1.animCounter = 0
    if (bloodContainer_1.crop.x >= bloodContainer_1.blockSize * bloodContainer_1.totalAnimFrames) {
      bloodContainer_1.crop.x = 0
    }
  }
  bloodContainer_1.animCounter++


  // maps speed of heart beat to remaining stamina
  hudHeart.animFrames = Math.floor(hudHeart.animFramesBase * (currentStam / maxStam))



  if (hudHeart.animFrames <= hudHeart.animFramesMin) { // sets a minimum speed for heart beat
    hudHeart.animFrames = hudHeart.animFramesMin
  }

  // draws hudHeart to cursor canvas
  cursorCtx.drawImage(hudHeart.image, hudHeart.crop.x, hudHeart.crop.y, hudHeart.blockSize, hudHeart.blockSize, hudHeart.position.x, hudHeart.position.y, hudHeart.blockSize, hudHeart.blockSize)

  if (hudHeart.animCounter >= hudHeart.animFrames) {
    hudHeart.crop.x += hudHeart.blockSize
    hudHeart.animCounter = 0
    if (hudHeart.crop.x >= hudHeart.blockSize * hudHeart.totalAnimFrames) {
      hudHeart.crop.x = 0
    }
  }

  hudHeart.animCounter++



  if (currentStam > maxStam - maxStam / 3) {
    spriteCtx.fillStyle = 'rgb(57, 201, 237)'
  } else if (currentStam > maxStam - (maxStam / 3) * 2) {
    spriteCtx.fillStyle = 'rgb(240, 143, 33)'
  } else {
    spriteCtx.fillStyle = 'rgb(240, 57, 33)'
  }


  // // stamDisplay turns stamina bar into the proper length based on percentage of stamina remaining
  // const stamDisplay = (currentStam / maxStam) * (heroBlockSize - (heroBlockSize / 2))
  // // renders stamina bar if stamina is less than maximum
  // if (currentStam < maxStam) {
  //   spriteCtx.fillStyle = 'rgba(65, 65, 65, .5)'
  //   spriteCtx.fillRect(playerSprite.position.x + (heroBlockSize / upscale), playerSprite.position.y, (heroBlockSize - (heroBlockSize / 2)), upscale)
  //   if (currentStam > maxStam - maxStam / 3) {
  //     spriteCtx.fillStyle = 'rgba(57, 201, 237, .7)'
  //   } else if (currentStam > maxStam - (maxStam / 3) * 2) {
  //     spriteCtx.fillStyle = 'rgb(240, 143, 33, .7)'
  //   } else {
  //     spriteCtx.fillStyle = 'rgb(240, 57, 33, .7)'
  //   }
  //   spriteCtx.fillRect(playerSprite.position.x + (heroBlockSize / upscale), playerSprite.position.y, stamDisplay, upscale)
  // }



  // ability display with cooldown level
  // if (!attackCooldownOff) {
  //   const cooldownDisplay = (coolDownLevel / coolDownLevelMax) * (upscale * 2)
  //   ctx.fillStyle = 'rgb(65, 65, 65)'
  //   ctx.fillRect(playerSprite.position.x  + upscale * 2, playerSprite.position.y + heroBlockSize, upscale * 2, upscale * 2)
  //   if (attackCooldownOff || coolDownLevel === coolDownLevelMax) {
  //     ctx.fillStyle = 'rgb(57, 201, 237)'
  //     ctx.fillRect(playerSprite.position.x  + upscale * 2, playerSprite.position.y + heroBlockSize, upscale * 2, upscale * 2)
  //   } else {
  //     ctx.fillStyle = 'rgb(240, 57, 33)'
  //     ctx.fillRect(playerSprite.position.x  + upscale * 2, playerSprite.position.y + heroBlockSize + (upscale * 2) - cooldownDisplay, upscale * 2, cooldownDisplay)
  //   }

  //   // ctx.drawImage(swordIcon, playerSprite.position.x, playerSprite.position.y + heroBlockSize, upscale * 7, upscale * 7)
  // }

}

export default hudRender
