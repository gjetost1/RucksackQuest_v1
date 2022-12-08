import enemyMoveEngine from "./EnemyMoveEngine"
import globalVars from "./GlobalVars"
import checkBoxCollision from "./CheckBoxCollision"
import { buildCMask } from "./CollisionMasks"


// animates dying and blood drain
const animate = (element) => {
  element.data.animCounter++
  if (element.data.animCounter >= element.data.spriteAnimSpeed) {
    element.crop.x += element.data.blockSize
    element.data.animCounter = 0
    if (element.crop.x >= element.data.blockSize * element.data.animFrames) {
      element.crop.x = element.data.blockSize * element.data.animFrames
      return [false, element]
    }
  }
  return [true, element]
}

const collisionCheck = (baseHero, el, tempCMasks) => {
  return checkBoxCollision(baseHero.eventX, baseHero.eventY, el.data.hitColBox, tempCMasks, 0)
  && checkBoxCollision(baseHero.eventX, baseHero.eventY, el.data.hitColBox, tempCMasks, 1)
  && checkBoxCollision(baseHero.eventX, baseHero.eventY, el.data.hitColBox, tempCMasks, 2)
  && checkBoxCollision(baseHero.eventX, baseHero.eventY, el.data.hitColBox, tempCMasks, 3)
}


const enemyUpdate = (enemyArr, baseHero, collisionCtx, spriteCtx) => {
  if (!enemyArr) return


  for (let el of enemyArr) {
    // renders to collisionCanvas if the enemy is solid and not destroyed or breaking
    if (el.data.solid) {
      collisionCtx.drawImage(el.image, el.crop.x, el.crop.y, el.data.blockSize, el.data.blockSize, el.data.x, el.data.y, el.data.blockSize, el.data.blockSize)
    }
    // doesn't update if the enemy is outside of the rendered canvas
    if ((!el.data.x <= 0
      || !el.data.x >= globalVars.width
      || !el.data.y <= 0
      || !el.data.y >= globalVars.height)
      && !el.data.dead
      ) {

        // runs dying animation on death
        if (el.data.dying && !el.data.dead) {
          // console.log(el.data.animCounter)
          const dyingAnimation = animate(el)
          el.data.dead = !dyingAnimation[0]
          if (el.data.dead) {
            // el.data.dying = false
          }
          el = dyingAnimation[1]
          continue
        }
        // if the frameCountLimiter has been reached run the moveEngine to move
        // the enemy
        if (el.data.frameCountLimiter >= el.data.maxFrameCountLimiter) {
          el.data = enemyMoveEngine(el.data, collisionCtx, spriteCtx)
          // console.log(el.data)
          el.data.frameCountLimiter = 0
        }
        el.data.frameCountLimiter += el.data.moveSpeed

    // set the sprite position to the current enemyObject coordinates
    el.position = {
      x: el.data.x,
      y: el.data.y,
    }
    // set the animation crop of the sprite
    el.cropChange(el.data.cropX, el.data.cropY)

    // sets the right direction spriteSheet for the sprite
    el.image.src = el.data.currentSprite

  }

    // handles hits on enemy
    let collision = true
    if ((el.data.x > globalVars.heroCenterX - baseHero.blockSize && el.data.x < globalVars.heroCenterX + baseHero.blockSize)
    && (el.data.y > globalVars.heroCenterY - baseHero.blockSize && el.data.y < globalVars.heroCenterY + baseHero.blockSize)) {
      // const tempCMasks = [{
        //   tl: [el.cMasks[0].tl[0] + baseHero.totalXChange, el.cMasks[0].tl[1] + baseHero.totalYChange],
        //   tr: [el.cMasks[0].tr[0] + baseHero.totalXChange, el.cMasks[0].tr[1] + baseHero.totalYChange],
        //   bl: [el.cMasks[0].bl[0] + baseHero.totalXChange, el.cMasks[0].bl[1] + baseHero.totalYChange],
        //   br: [el.cMasks[0].br[0] + baseHero.totalXChange, el.cMasks[0].br[1] + baseHero.totalYChange],
        // }]

        const tempCMasks = [{
        tl: [el.data.x, el.data.y],
        tr: [el.data.x + el.data.blockSize, el.data.y],
        bl: [el.data.x, el.data.y + el.data.blockSize],
        br: [el.data.x + el.data.blockSize, el.data.y + el.data.blockSize],
      }]

      collision = collisionCheck(baseHero, el, tempCMasks)

      // uncomment to show corners of collisionMask where a hit will register on enemy
      // spriteCtx.fillRect(tempCMasks[0].tl[0], tempCMasks[0].tl[1], 4, 4)
      // spriteCtx.fillRect(tempCMasks[0].tr[0], tempCMasks[0].tr[1], 4, 4)
      // spriteCtx.fillRect(tempCMasks[0].bl[0], tempCMasks[0].bl[1], 4, 4)
      // spriteCtx.fillRect(tempCMasks[0].br[0], tempCMasks[0].br[1], 4, 4)
      if (baseHero.attackActive && !collision && !el.data.takeDamage) {
        el.data.currentVitality -= 34
        el.data.takeDamage = true
        el.data.damageActive = true
        el.data.damageAnim.data.active = true
        // console.log(el.data.currentVitality)
        collision = false
        // plays enemy damage sound if hit doesn't kill
        if (el.data.currentVitality > 0) {
          el.data.damageSound.play()
        }
        const damageMoveScale = el.data.blockSize / globalVars.upscale
        if (baseHero.heroDirection === 'down') {
          el.data.y += damageMoveScale
        } else if (baseHero.heroDirection === 'up') {
          el.data.y -= damageMoveScale
        } else if (baseHero.heroDirection === 'left') {
          el.data.x -= damageMoveScale
        } else if (baseHero.heroDirection === 'right') {
          el.data.y += damageMoveScale
        } else if (baseHero.heroDirection === 'upleft') {
          el.data.x -= damageMoveScale
          el.data.y -= damageMoveScale
        } else if (baseHero.heroDirection === 'upright') {
          el.data.x += damageMoveScale
          el.data.y -= damageMoveScale
        } else if (baseHero.heroDirection === 'downleft') {
          el.data.x -= damageMoveScale
          el.data.y += damageMoveScale
        } else if (baseHero.heroDirection === 'downright') {
          el.data.x += damageMoveScale
          el.data.y += damageMoveScale
        }
      }



      // handles blood draining of enemies
      if (baseHero.bloodDrainActive && !collision && el.data.dead && el.data.currentBloodLevel > 0 && baseHero.equipment.currentFillTank) {
        // console.log(baseHero.currentStam)
        if (baseHero.equipment.currentFillTank.data.currentVolume < baseHero.equipment.currentFillTank.data.maxVolume) {
          // console.log('draining')
          // animates blood effect on enemy corpse when draining
          const animated = animate(el.data.damageAnim)
          el.data.damageActive = animated[0]
          el.data.damageAnim = animated[1]
          el.data.currentBloodLevel -= baseHero.bloodDrainRate
          baseHero.equipment.currentFillTank.data.currentVolume += baseHero.bloodDrainRate
          if (baseHero.equipment.currentFillTank.data.currentVolume > baseHero.equipment.currentFillTank.data.maxVolume) {
            baseHero.equipment.currentFillTank.data.currentVolume = baseHero.equipment.currentFillTank.data.maxVolume
          }
        } else if (!baseHero.equipment.changeCurrentFillTank) {
          baseHero.equipment.changeCurrentFillTank = true
          // console.log('tank change')
        }

      } else if (baseHero.bloodDrainActive && collision) {
        baseHero.bloodDrainActive = false
      }

    }
    if (!baseHero.attackActive) {
      el.data.takeDamage = false
    }
    // if vitality drops below zero this sets up and starts the dying animation
    // also plays the dying sound
    if (el.data.currentVitality <= 0 && !el.data.dead) {
      el.data.dying = true
      el.data.dyingSound.play()
      el.data.animCounter = 0
      el.crop.x = el.data.blockSize * el.data.movementFrames
      el.data.animFrames = el.data.movementFrames + el.data.dyingFrames
      el.data.spriteAnimSpeed = 22
    }
          // if (el.data.takeDamage) {
          //   el.data.damageAnim.data.active = true
          // }

    // spriteCtx.drawImage(el.image, el.crop.x, el.crop.y, el.data.blockSize, el.data.blockSize, el.position.x, el.position.y, el.data.blockSize, el.data.blockSize)
    // spriteCtx.fillStyle = 'rgba(255, 0, 0, 1)'
    // spriteCtx.fillRect(el.position.x, el.position.y, el.data.blockSize, el.data.blockSize)

    //   spriteCtx.drawImage(el.image, el.crop.x, el.crop.y, el.data.blockSize, el.data.blockSize, el.position.x, el.position.y, el.data.blockSize, el.data.blockSize)


    // if (el.data.damageActive) {
    //   spriteCtx.drawImage(el.data.damageAnim.image, el.data.damageAnim.crop.x, el.data.damageAnim.crop.y, el.data.damageAnim.data.blockSize, el.data.damageAnim.data.blockSize, el.position.x, el.position.y, el.data.damageAnim.data.blockSize, el.data.damageAnim.data.blockSize)
    //   const animated = animate(el.data.damageAnim)
    //   el.data.damageActive = animated[0]
    //   el.data.damageAnim = animated[1]
    // }
  }
  return [enemyArr, baseHero]
}

export default enemyUpdate
