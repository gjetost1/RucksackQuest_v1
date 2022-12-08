import globalVars from "./GlobalVars"
import { hudHeart, bloodTank_1, bloodTank_2 } from "./HudObjects"
import veins from '../../assets/hud/veins_2.png'
import ui_background from '../../assets/hud/UI_background.png'
import baseHero from "./BaseHero"

let lastStam = baseHero.currentStam
let bloodAnimation = false

const veins_img = new Image()
veins_img.src = veins

const ui_background_img = new Image()
ui_background_img.src = ui_background

// checks current bloodTanks and moves empties to the back of the queue
// also sets the first tank with blood in it as the active tank
const bloodTankSort = (baseHero) => {
  // console.log('sorting')
  baseHero.equipment.bloodTanks.sort((a, b) => {
    const tankA = a.data.currentVolume
    const tankB = b.data.currentVolume
    if (tankA > tankB) {
      return 1
    } else if (tankB > tankA) {
      return -1
    }
    return 0
  })
  // console.log( baseHero.equipment.bloodTanks)
  return baseHero
}

const bloodTankSet = (baseHero, userActivated) => {
  let allEmpty = true
  let firstFill = true
  let firstActive = true
  for (let i = 0; i < baseHero.equipment.bloodTanks.length; i++) {
    const tank = baseHero.equipment.bloodTanks[i]
    tank.data.active = false
    if (tank.data.currentVolume >= tank.data.maxVolume && firstFill) {
      // console.log('first fill')
      baseHero.equipment.currentFillTank = baseHero.equipment.bloodTanks[i - 1]
      firstFill = false
    }
    if (tank.data.currentVolume <= 0) {
      tank.data.currentVolume = 0
      tank.data.depleted = true
    } else {
      tank.data.depleted = false
      allEmpty = false
    }
    if (userActivated) {
      if (tank.data.currentVolume > 0 && firstActive) {
        tank.data.active = true
        firstActive = false
        // tank.data.fill = true
        baseHero.equipment.currentTank = tank
        // return baseHero
      }
      // else if (baseHero.equipment.allTanksEmpty) {
        //   baseHero.equipment.bloodTanks[baseHero.equipment.bloodTanks.length - 1].data.active = true
        // }
        if (firstActive) {
          baseHero.equipment.bloodTanks[baseHero.equipment.bloodTanks.length - 1].data.active = true
          baseHero.equipment.currentTank = baseHero.equipment.bloodTanks[baseHero.equipment.bloodTanks.length - 1]
        }
      }
      else if (tank.data.currentVolume > 0) {
        tank.data.active = false
        // baseHero.equipment.currentTank = baseHero.equipment.bloodTanks[baseHero.equipment.bloodTanks.length - 1]
      }
    }
    if (firstFill) {
      baseHero.equipment.currentFillTank = baseHero.equipment.bloodTanks[baseHero.equipment.bloodTanks.length - 1]

      // console.log('all full', baseHero.equipment.currentFillTank)
    }
  baseHero.equipment.allTanksEmpty = allEmpty


  // console.log('all empty', allEmpty)

  // for (let i = baseHero.equipment.bloodTanks.length - 1; i >= 0; i--) {
  //   const tank = baseHero.equipment.bloodTanks[i]
  //     if (userActivated) {
  //       if (tank.data.currentVolume > 0 && firstActive) {
  //         tank.data.active = true
  //         firstActive = false
  //         // tank.data.fill = true
  //         baseHero.equipment.currentTank = tank
  //         // return baseHero
  //       }
  //       if (firstActive) {
  //         baseHero.equipment.bloodTanks[baseHero.equipment.bloodTanks.length - 1].data.active = true
  //       }
  //       // else if (baseHero.equipment.allTanksEmpty) {
  //       //   baseHero.equipment.bloodTanks[baseHero.equipment.bloodTanks.length - 1].data.active = true
  //       // }
  //     } else {
  //       baseHero.equipment.currentTank = false
  //     }
  //   }
    return baseHero
}



const bloodAnimate = (element) => {
  element.animCounter++
  if (element.animCounter >= element.animFrames) {
    element.crop.x += element.blockSize
    element.animCounter = 0
    if (element.crop.x >= element.blockSize * element.totalAnimFrames) {
      element.crop.x = 0
    }
  }
}

const bloodTankRender = (baseHero, cursorCtx, foregroundCtx, stamDrain) => {
  let tankCount = baseHero.equipment.bloodTanks.length - 1
  // console.log(baseHero.equipment.bloodTanks)
  // for (let el of baseHero.equipment.bloodTanks) {
  for (let i = 0; i < baseHero.equipment.bloodTanks.length; i++) {
    const el = baseHero.equipment.bloodTanks[i]
    // console.log(el)
    // if (!el.data.depleted) {
    foregroundCtx.drawImage(el.contentsImage, el.crop.x, el.crop.y, el.blockSize, el.blockSize, el.position.x, perfectYPos(el) - el.blockSize * tankCount, el.blockSize, el.blockSize)
    foregroundCtx.clearRect(el.position.x, el.position.y + el.blockSize - el.blockSize * tankCount, el.blockSize, el.blockSize)
    // }
    if (el.data.active) {
      if (stamDrain > 0 && baseHero.currentStam < baseHero.maxStam) {
        el.data.currentVolume -= stamDrain
        bloodAnimation = true
      } else if (baseHero.currentStam >= baseHero.maxStam && el.crop.x === 0) {
        bloodAnimation = false
        el.crop.x = 0
        el.animCounter = 0
      }
      if (el.data.currentVolume <= 0) {
        baseHero = bloodTankSet(baseHero, true)
      } else if (el.data.currentVolume <= 0 && baseHero.equipment.allTanksEmpty) {
        baseHero = bloodTankSet(baseHero, false)
      } else {
        el.data.depleted = false
      }
      if (bloodAnimation) {
        bloodAnimate(el)
      }
    }
    if (baseHero.equipment.changeCurrentFillTank) {
      baseHero.equipment.changeCurrentFillTank = false
      baseHero = bloodTankSet(baseHero, baseHero.equipment.currentTank.data.active)
      // console.log('change tank')
    }

    if (el.data.active) {
      cursorCtx.drawImage(el.onImage, 0, 0, el.blockSize, el.blockSize, el.position.x, el.position.y - el.blockSize * tankCount, el.blockSize, el.blockSize)
    } else {
      cursorCtx.drawImage(el.offImage, 0, 0, el.blockSize, el.blockSize, el.position.x, el.position.y - el.blockSize * tankCount, el.blockSize, el.blockSize)
    }

    tankCount--
      // reduces volume of blood container when vitality regenerates
    // foregroundCtx.drawImage(bloodTank_1.contentsImage, bloodTank_1.crop.x, bloodTank_1.crop.y, bloodTank_1.blockSize, bloodTank_1.blockSize, bloodTank_1.position.x, perfectYPos(bloodTank_1), bloodTank_1.blockSize, bloodTank_1.blockSize)
    // cursorCtx.drawImage(bloodTank_1.image, 0, 0, bloodTank_1.blockSize, bloodTank_1.blockSize, bloodTank_1.position.x, bloodTank_1.position.y, bloodTank_1.blockSize, bloodTank_1.blockSize)
  }
}


const perfectYPos = (element) => {
  if (element.data.currentVolume === element.data.maxVolume) {
    return element.position.y
  }
  if (element.data.currentVolume <= 0) {

    return element.position.y + element.blockSize - element.blockSize / 4
  }
  // console.log(element.blockSize - (Math.round(element.blockSize * (element.data.currentVolume / element.data.maxVolume) / globalVars.upscale)* globalVars.upscale))
  // console.log(element.data.currentVolume)
  // console.log(element.blockSize - (Math.round(element.blockSize * (element.data.currentVolume / element.data.maxVolume) / globalVars.upscale) * globalVars.upscale))
  return element.position.y + (element.blockSize / 2) - Math.round((element.blockSize * (element.data.currentVolume / element.data.maxVolume) / globalVars.upscale) / 2) * globalVars.upscale + (globalVars.upscale * 2)
}



let firstTankSort = true
let tankActivateCooldown = false

const hudRender = (spriteCtx, cursorCtx, foregroundCtx, baseHero) => {

  // runs every time game is booted up to make sure tanks are sorted
  if (firstTankSort) {
    baseHero = bloodTankSort(baseHero)
    baseHero = bloodTankSet(baseHero, false)
    firstTankSort = false
  }

  const stamDrain = baseHero.currentStam - lastStam

  lastStam = baseHero.currentStam



  // activates bloodTank on key press
  if (baseHero.keys.x.pressed && !tankActivateCooldown) {
    if (baseHero.equipment.currentTank) {
      baseHero.equipment.currentTank.crop.x = 0
    }
    tankActivateCooldown = true
    // baseHero = bloodTankSort(baseHero, !baseHero.equipment.currentTank)
    baseHero = bloodTankSet(baseHero, !baseHero.equipment.currentTank.data?.active)
    setTimeout(() => {
      tankActivateCooldown = false
    }, 300)
  } else if (!baseHero.equipment.currentTank || (baseHero.equipment.currentTank && baseHero.equipment.currentTank.data.currentVolume <= 0)) {
    // baseHero = bloodTankSet(baseHero, false)
    // baseHero = bloodTankSet(baseHero, false)
  }




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

  foregroundCtx.globalAlpha = 1

  // foregroundCtx.drawImage(bloodTank_2.contentsImage, bloodTank_2.crop.x, bloodTank_2.crop.y, bloodTank_2.blockSize, bloodTank_2.blockSize, bloodTank_2.position.x, perfectYPos(bloodTank_2), bloodTank_2.blockSize, bloodTank_2.blockSize)
  // foregroundCtx.clearRect(bloodTank_2.position.x, bloodTank_2.position.y + bloodTank_2.blockSize, bloodTank_2.blockSize, bloodTank_2.blockSize)

  // // foregroundCtx.drawImage(bloodTank_2.contentsImage, bloodTank_2.crop.x, bloodTank_2.crop.y, bloodTank_2.blockSize, bloodTank_2.blockSize, bloodTank_2.position.x, perfectYPos(bloodTank_2), bloodTank_2.blockSize, bloodTank_2.blockSize)
  // cursorCtx.drawImage(bloodTank_2.image, 0, 0, bloodTank_2.blockSize, bloodTank_2.blockSize, bloodTank_2.position.x, bloodTank_2.position.y, bloodTank_2.blockSize, bloodTank_2.blockSize)
  // foregroundCtx.drawImage(bloodTank_1.contentsImage, bloodTank_1.crop.x, bloodTank_1.crop.y, bloodTank_1.blockSize, bloodTank_1.blockSize, bloodTank_1.position.x, perfectYPos(bloodTank_1), bloodTank_1.blockSize, bloodTank_1.blockSize)
  // cursorCtx.drawImage(bloodTank_1.image, 0, 0, bloodTank_1.blockSize, bloodTank_1.blockSize, bloodTank_1.position.x, bloodTank_1.position.y, bloodTank_1.blockSize, bloodTank_1.blockSize)

  // console.log(baseHero.equipment.bloodTanks)
  bloodTankRender(baseHero, cursorCtx, foregroundCtx, stamDrain)

  cursorCtx.drawImage(veins_img, 0, 0, 256, 64, 104, globalVars.perfectHeight - 100, 256, 64)
  foregroundCtx.drawImage(ui_background_img, 0, 0, 384, 192, 0, globalVars.perfectHeight - 136, 384, 192)
  const bloodStaminaLevel = 72 + Math.round((256 * (baseHero.currentStam / baseHero.maxStam)) / globalVars.upscale) * globalVars.upscale
  // cursorCtx.clearRect(Math.round((320 * (health / maxHealth)) / globalVars.upscale) * globalVars.upscale , 32, 256, 64)
  cursorCtx.clearRect(bloodStaminaLevel, globalVars.perfectHeight - 100, 256, 64)




  foregroundCtx.globalAlpha = .85
  //animate blood container

  // if (bloodTank_1.animCounter >= bloodTank_1.animFrames) {
  //   bloodTank_1.crop.x += bloodTank_1.blockSize
  //   bloodTank_1.animCounter = 0
  //   if (bloodTank_1.crop.x >= bloodTank_1.blockSize * bloodTank_1.totalAnimFrames) {
  //     bloodTank_1.crop.x = 0
  //   }
  // }
  // bloodTank_1.animCounter++


  // maps speed of heart beat to remaining stamina
  hudHeart.animFrames = Math.floor(hudHeart.animFramesBase * (baseHero.currentStam / baseHero.maxStam))



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

  return baseHero


  // if (baseHero.currentStam > baseHero.maxStam - baseHero.maxStam / 3) {
  //   spriteCtx.fillStyle = 'rgb(57, 201, 237)'
  // } else if (baseHero.currentStam > baseHero.maxStam - (baseHero.maxStam / 3) * 2) {
  //   spriteCtx.fillStyle = 'rgb(240, 143, 33)'
  // } else {
  //   spriteCtx.fillStyle = 'rgb(240, 57, 33)'
  // }


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
