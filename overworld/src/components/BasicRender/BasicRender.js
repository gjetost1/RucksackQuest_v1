import React, { useContext, useEffect, useRef, useState } from 'react'
import './BasicRender.css'
import moveEngine from './MoveEngine'
import eventEngine from './EventEngine'
import background_1 from '../../assets/backgrounds/test/map_test_2.png'
// import background_1 from '../../assets/backgrounds/test/map_test_3_background.png'
// import background_1 from '../../assets/backgrounds/river_style_test.png'
import foreground_1 from '../../assets/backgrounds/test/map_test_3_foreground.png'
import cursor_1 from '../../assets/hand_cursor.png'
import { grass_1, grass_2 } from './AnimatedObjects'

import cMasks from './CollisionMasks'

import globalVars from './GlobalVars'
import heroRender from './HeroRender'
import cursorRender from './CursorRender'
import hudRender from './HUDRender'
import attackRender from './AttackRender'
import animatedObjectsRender, { generatePatch } from './AnimatedObjectsRender'

import inputEngine from './InputEngine'
import baseHeroGet from './BaseHero'


import { hero_spritesheets, sword_spritesheets, arrow_spritesheets } from './spriteRef'


import sword_fx from '../../assets/sounds/sword/damage_sound.wav'

const upscale = globalVars.upscale // multiplier for resolution - 2 means each visible pixel is 2 x 2 real pixels etc
const height = globalVars.height
const width = globalVars.width
const blockSize = globalVars.blockSize   // size of each grid block in pixels for collison objects
let baseHero = baseHeroGet
let cursorX = -400 // sets cursor starting coordinates outside the canvas so it is invisible
let cursorY = -400


// this gets the coordinates of the cursor so it can be rendered on the canvas
document.addEventListener('mousemove', (action) => {})
onmousemove = (event) => {
  cursorX = event.x - globalVars.windowSpacerWidth
  cursorY = event.y - globalVars.windowSpacerHeight
}

const grassPatch = generatePatch(500, 300, 7, 7, [grass_1, grass_2])
// const grassPatch2 = generatePatch(0, 64, 3, 2, grass_1)


const BasicRender = ({}) => {

  const swordFx = new Audio(sword_fx)
  // let eventObj = {}

  // declare the 3 (current) canvases. background is rendered first, then sprite, then foreground on top
  // foregroundCanvas is for scenery and objects that the hero or other sprites can go behind
  // it is partly transparent so you don't lose sprites behind it
  const backgroundCanvas = useRef(null)
  const spriteCanvas = useRef(null)
  const foregroundCanvas = useRef(null)
  const cursorCanvas = useRef(null)

  // this is the main useEffect for rendering - it runs input checks,
  // updates positions and animations, and then renders the frame using
  // the animate() function
  useEffect(() => {

  // creates context for each canvas. Invoke all drawing/rendering to canvas
  // using the context for the layer you want to render to
  const backgroundCtx = backgroundCanvas.current.getContext('2d')
  const spriteCtx = spriteCanvas.current.getContext('2d')
  const foregroundCtx = foregroundCanvas.current.getContext('2d')
  const cursorCtx = cursorCanvas.current.getContext('2d')

  // makes foreground transparent so you can see sprites under it
  foregroundCtx.globalAlpha = .7

    // this next function sends the keys object of the hero to the inputEngine where all the event listeners live
    // for inputs. returns keys object which is checked for what keys are currently pressed each frame
    baseHero.keys = inputEngine(baseHero.keys)

    // Sprite is the main class for hero and enemy sprites
    // image is the .png for the spritesheet you are rendering
    // position is an object with global x and y coordinates for the
    // upper lefthand corner of the sprite (where it is currently being rendered on the screen)
    // crop is the upper lefthand corner where the spritesheet is being
    // cropped - crop size is based on rectWidth and rectHeight which is
    // currently set globally

    class Sprite {
      constructor({ image, position, crop }) {
        this.position = position
        this.image = image
        this.crop = crop
      }

      cropChange(cropX, cropY) {
        this.crop = {
          x: cropX,
          y: cropY
        }
      }

      draw() {
        spriteCtx.drawImage(this.image, this.crop.x, this.crop.y, baseHero.heroSpriteSize, baseHero.heroSpriteSize, this.position.x, this.position.y, baseHero.blockSize, baseHero.blockSize)
        // ctx.drawImage(this.image, this.position.x, this.position.y, rectWidth, rectHeight)
      }
    }

    class Background {
      constructor({ image, position }) {
        this.position = position
        this.image = image
      }

      draw() {
        backgroundCtx.drawImage(this.image, this.position.x, this.position.y, width, height)
      }
    }

    class Foreground {
      constructor({ image, position }) {
        this.position = position
        this.image = image
      }

      draw() {
        foregroundCtx.drawImage(this.image, this.position.x, this.position.y, width, height)
      }
    }



    // we create the sprite, background, and foreground instances we will be rendering
    const playerImage = new Image()
    playerImage.src = baseHero.heroSprite

    const playerSprite = new Sprite({
      image: playerImage,
      position: {
        x: baseHero.x,
        y: baseHero.y
      },
      crop: {
        x: baseHero.heroCropX,
        y: baseHero.heroCropY
      }
    })

    const equipImage = new Image()
    equipImage.src = baseHero.swordSpriteSheet

    const swordSprite = new Sprite({
      image: equipImage,
      position: {
        x: baseHero.x,
        y: baseHero.y
      },
      crop: {
        x: baseHero.heroCropX,
        y: baseHero.heroCropY
      }
    })



    const cursor = new Image()
    cursor.src = cursor_1

    const swordIcon = new Image()
    swordIcon.src = sword_spritesheets.icon

    const background = new Image()
    background.src = background_1

    const foreground = new Image()
    foreground.src = foreground_1

    const backgroundSprite = new Background({
      image: background,
      position: {
        x: 0,
        y: 0
      }
    })

    const foregroundSprite = new Foreground({
      image: foreground,
      position: {
        x: 0,
        y: 0
      }
    })

    const animate = () => {

      // clears all canvases for a new animation frame
      backgroundCtx.clearRect(0, 0, width, height)
      spriteCtx.clearRect(0, 0, width, height)
      foregroundCtx.clearRect(0, 0, width, height)
      cursorCtx.clearRect(0, 0, width, height)


      // moveEngine runs less than every frame to keep the hero sprite slower
      if (baseHero.frameCountLimiter >= baseHero.maxFrameCountLimiter) {
        baseHero.frameCountLimiter = 0
        baseHero = moveEngine(baseHero, cMasks, blockSize)
      }

      baseHero.frameCountLimiter += baseHero.moveSpeed

      // sets position of heroSprite and equipment, as well as which spritesheet should be used for this frame
      playerSprite.position.x = baseHero.x
      playerSprite.position.y = baseHero.y

      swordSprite.position.x = playerSprite.position.x
      swordSprite.position.y = playerSprite.position.y

      playerImage.src = baseHero.heroSprite

      equipImage.src = baseHero.swordSpriteSheet


    // calculates and draws attack effects on keypress with cooldown
    let eventObj = { // object passed to EventEngine to trigger appropriate event
      x: playerSprite.position.x,
      y: playerSprite.position.y,
      heroDirection: baseHero.heroDirection,
      eventX: 0,
      eventY: 0,
      blockSize: blockSize,
      eventType: 'attack',
      eventDirection: 'heroFront',
      eventAreaShape: 'rectangle',
      eventXDim: 1,
      eventYDim: 3,
      eventEffect: {
        damage: 10
      },
      eventDuration: 1,
      eventTimeout: 1.5,
      eventAnim: null,
    }

    // this handles an attack/ability usage by user - sets vars that will trigger attack/ability animation and
    // puts ability on cooldown. Current cooldown is set manually, but once there are other abilities
    // we will use their specific attributes to set the cooldown and effect duration
    if (baseHero.keys.e.pressed && baseHero.attackCooldownOff || baseHero.keys.mouse1.pressed && baseHero.attackCooldownOff) {
      baseHero.attackCooldownOff = false
      baseHero.attackActive = true
      baseHero.attackAnimation = true
      baseHero.coolDownLevel = 0 // sets the var for animating HUD cooldown level

      baseHero = eventEngine(baseHero)
      // cooldown setTimeout sets the cooldown on an event ability - eventObj.eventTimeout determines the length in seconds
      const cooldown = setTimeout(() => { // enables this attack again after eventTimeout # of seconds, essentially a cooldown
        baseHero.attackCooldownOff = true
        clearTimeout(cooldown)
        // console.log('cooldown over')
      }, eventObj.eventTimeout * 1000)


      // sets duration of event, set by eventObj.eventDuration in seconds
      const eventDuration = setTimeout(() => {
        clearTimeout(eventDuration)
        baseHero.attackActive = false
        baseHero.eventX = -400
        baseHero.eventY = -400
        // console.log('attack over')
      }, eventObj.eventDuration * 1000)

    }
    foregroundCtx.fillStyle = 'rgba(255, 0, 0, 1)'
    foregroundCtx.fillRect(baseHero.eventX, baseHero.eventY, baseHero.attackBlockSize, baseHero.attackBlockSize)

    // this increments coolDownLevel which controls the visual cooldown HUD
    if (!baseHero.attackCooldownOff) {
      baseHero.coolDownLevel += baseHero.coolDownLevelMax / 120
      // coolDownLevel = Math.round(coolDownLevel)
      if (baseHero.coolDownLevel >= baseHero.coolDownLevelMax) {
        baseHero.coolDownLevel = baseHero.coolDownLevelMax
      }
    } else {
      baseHero.coolDownLevel = 0
    }


    // makes the canvases render a frame
    window.requestAnimationFrame(animate)


    // renders current background sprite
    backgroundSprite.draw()


    // const grassPatch = [{img: grass_1, x: 64, y: 64}, {img: grass_1, x: 32, y: 32}, {img: grass_1, x: 32, y: 48},  {img: grass_1, x: 64, y: 48},  {img: grass_1, x: 64, y: 64},]

    // grass_1.currentDelayFrame++
    // // console.log(grass_1.currentDelayFrame)
    // if (grass_1.currentDelayFrame >= grass_1.delay) {
    //   grass_1.currentAnimFrame++
    // }
    // if (grass_1.currentAnimFrame >= grass_1.animFrameLimit) {
    //   grass_1.cropX += grass_1.blockSize
    //   grass_1.currentAnimFrame = 0
    // }
    // if (grass_1.cropX >= grass_1.blockSize * grass_1.maxAnimFrame) {
    //   grass_1.cropX = 0
    //   grass_1.currentDelayFrame = 0
    // }



    // grass_2.currentDelayFrame++
    // // console.log(grass_1.currentDelayFrame)
    // if (grass_2.currentDelayFrame >= grass_2.delay) {
    //   grass_2.currentAnimFrame++
    // }

    // if (grass_2.currentAnimFrame >= grass_2.animFrameLimit) {
    //   grass_2.cropX += grass_2.blockSize
    //   grass_2.currentAnimFrame = 0
    // }
    // if (grass_2.cropX >= grass_2.blockSize * grass_2.maxCropMultiply) {
    //   grass_2.cropX = 0
    //   grass_2.currentDelayFrame = 0
    // }

    foregroundCtx.globalAlpha = 1
    animatedObjectsRender(grassPatch, baseHero, backgroundCtx, foregroundCtx)

    foregroundCtx.globalAlpha = .7



    // renders stamina bar and other HUD elements
    hudRender(spriteCtx, baseHero.currentStam, baseHero.maxStam, baseHero.attackCooldownOff, baseHero.coolDownLevel, baseHero.coolDownLevelMax, playerSprite, baseHero.blockSize, swordIcon )


    // draws hero sprite and equipment in attack animation if there is an ongoing attack
    if (baseHero.attackAnimation) {
      const attackRet = attackRender(baseHero.heroCropX, baseHero.heroSpriteSize, swordFx, baseHero.attackAnimation)
      baseHero.heroCropX = attackRet.heroCropX
      baseHero.attackAnimation = attackRet.attackAnimation
      playerSprite.cropChange(baseHero.heroCropX, baseHero.heroCropY)
      swordSprite.cropChange(baseHero.heroCropX, baseHero.heroCropY)
      heroRender([playerSprite, swordSprite])
    } else {
      // draws hero sprite image to canvas without attack animation
      // feed in sprite class instances in the order you want them rendered
      // eg typically base player sprite first, then clothing, then equipment
      playerSprite.cropChange(baseHero.heroCropX, baseHero.heroCropY)
      swordSprite.cropChange(baseHero.heroCropX, baseHero.heroCropY)
      heroRender([playerSprite, swordSprite])
    }

      // this renders foreground objects with opacity so that you can see the hero behind them
      foregroundSprite.draw()
      cursorRender(cursorCtx, cursor, cursorX, cursorY)
    }

    animate();

  }, [])



  return (
    <div id='main-container'>
        {/* <div id='instructions'>WASD to move - SHIFT to dash - LEFT MOUSE BUTTON to attack</div> */}
      <div id='canvas-container'>
        <div id='sizing' style={{height: height, width: width}}></div>
        <canvas id='backgroundCanvas' ref={backgroundCanvas} height={height} width={width} />
        <canvas id='spriteCanvas' ref={spriteCanvas} height={height} width={width} />
        <canvas id='foregroundCanvas' ref={foregroundCanvas} height={height} width={width} />
        <canvas id='cursorCanvas' ref={cursorCanvas} height={height} width={width} />
        <div className='blur'></div>
        <div className='scanline-tone'></div>
        <div className='pixel-tone'></div>
      </div>
    </div>
  )
}


export default BasicRender
