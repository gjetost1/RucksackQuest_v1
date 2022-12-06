import globalVars from "./GlobalVars"
import { hudHeart, bloodContainer_1 } from "./HudObjects"
import veins from '../../assets/hud/veins_2.png'
import veins_depleted from '../../assets/hud/veins_2_depleted.png'

const veins_img = new Image()
veins_img.src = veins

const veins_depleted_img = new Image()
veins_depleted_img.src = veins_depleted

const maxHealth = 100
let health = 100


const hudRender = (spriteCtx, cursorCtx, currentStam, maxStam, attackCooldownOff, coolDownLevel, coolDownLevelMax, playerSprite, heroBlockSize, swordIcon, ) => {
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

  cursorCtx.drawImage(veins_depleted_img, 0, 0, 256, 64, 64, 32, 256, 64)
  cursorCtx.drawImage(veins_img, 1 - (health / maxHealth), 0, 256, 64, 64, 32, 256, 64)

  cursorCtx.drawImage(bloodContainer_1.image, bloodContainer_1.crop.x, bloodContainer_1.crop.y, bloodContainer_1.blockSize, bloodContainer_1.blockSize, bloodContainer_1.position.x, bloodContainer_1.position.y, bloodContainer_1.blockSize, bloodContainer_1.blockSize)

  //animate blood container
  if (bloodContainer_1.animCounter >= bloodContainer_1.animFrames) {
    health--
    if (health <= 0) {
      health = maxHealth
    }
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
