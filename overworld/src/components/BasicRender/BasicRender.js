import React, { useContext, useEffect, useRef, useState } from 'react'
import './BasicRender.css'
import moveEngine from './MoveEngine'
import eventEngine from './EventEngine'
import pixelator from './Pixelator'
import background_1 from '../../assets/backgrounds/test/big_map_background_2.png'
import collision_1 from '../../assets/backgrounds/test/big_map_collision_2.png'
import foreground_1 from '../../assets/backgrounds/test/big_map_foreground_2.png'
import cursor_1 from '../../assets/hand_cursor.png'
import { grass_1, grass_low_1, grass_2, grass_3, barrel_1, barrel_2, barrel_low_1 } from './AnimatedObjects'

import cMasks from './CollisionMasks'

import globalVars from './GlobalVars'
import heroRender from './HeroRender'
import cursorRender from './CursorRender'
import hudRender from './HUDRender'
import attackRender from './AttackRender'
import animatedObjectsRender, { generatePatch, Patch } from './AnimatedObjectsRender'

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

// these limit how often a frame is drawn to the screen
const frameRatePeak = 3
let frameRateCounter = 0

// this gets the coordinates of the cursor so it can be rendered on the canvas
document.addEventListener('mousemove', (action) => {})
onmousemove = (event) => {
  cursorX = event.x
  cursorY = event.y
  // cursorX = event.x - globalVars.windowSpacerWidth
  // cursorY = event.y - globalVars.windowSpacerHeight
}

// const grassPatch = generatePatch(-16, 0, 47, 28, [grass_1, grass_2, grass_3])
// const grassPatch = generatePatch(920, 300, 7, 6, [grass_1, grass_2, grass_3])
// const grassPatch2 = generatePatch(980, 628, 5, 4, [grass_1, grass_2, grass_3])
// const grassPatch3 = generatePatch(1000, 140, 5, 4, [grass_1, grass_2, grass_3])
// const grassPatch4 = generatePatch(352, 420, 8, 3, [grass_1, grass_2, grass_3])
// const grassPatch5 = generatePatch(460, 560, 5, 4, [grass_1, grass_2, grass_3])
// const barrelPatch = generatePatch(600, 300, 5, 4, [barrel_1, barrel_2])


// const grassPatch = generatePatch(760, 560, 5, 6, [grass_low_1])
// const barrelPatch = generatePatch(400, 500, 3, 3, [barrel_low_1])

const grassPatch1 = new Patch(0, 0, 20, 20, [grass_1, grass_2, grass_3], .05)
const grassPatch2 = new Patch(-500, -500, 20, 20, [grass_1, grass_2, grass_3], .05)
const grassPatch3 = new Patch(1100, 1000, 20, 20, [grass_1, grass_2, grass_3], .05)
const barrelPatch = new Patch(600, 500, 10, 10, [barrel_1, barrel_2], .2)





const BasicRender = ({}) => {



  const swordFx = new Audio(sword_fx)
  // let eventObj = {}

  // declare the 3 (current) canvases. background is rendered first, then sprite, then foreground on top
  // foregroundCanvas is for scenery and objects that the hero or other sprites can go behind
  // it is partly transparent so you don't lose sprites behind it
  // const backgroundCanvas = useRef(null)
  // const spriteCanvas = useRef(null)
  // const foregroundCanvas = useRef(null)
  // const cursorCanvas = useRef(null)
  // const collisionCanvas = useRef(null)
  const backgroundCanvas = new OffscreenCanvas(globalVars.width, globalVars.height)
  const spriteCanvas = new OffscreenCanvas(globalVars.width, globalVars.height)
  const foregroundCanvas = new OffscreenCanvas(globalVars.width, globalVars.height)
  const cursorCanvas = new OffscreenCanvas(globalVars.width, globalVars.height)
  const collisionCanvas = new OffscreenCanvas(globalVars.width, globalVars.height)
  // const pixelCanvas = useRef(null)
  const comboCanvas = useRef(null)


  // this is the main useEffect for rendering - it runs input checks,
  // updates positions and animations, and then renders the frame using
  // the animate() function
  useEffect(() => {

  // creates context for each canvas. Invoke all drawing/rendering to canvas
  // using the context for the layer you want to render to
  // const backgroundCtx = backgroundCanvas.current.getContext('2d', { alpha: false })
  // const spriteCtx = spriteCanvas.current.getContext('2d')
  // const foregroundCtx = foregroundCanvas.current.getContext('2d')
  // const cursorCtx = cursorCanvas.current.getContext('2d')
  // const collisionCtx = collisionCanvas.current.getContext('2d', { willReadFrequently: true })
  const backgroundCtx = backgroundCanvas.getContext('2d')
  const spriteCtx = spriteCanvas.getContext('2d')
  const foregroundCtx = foregroundCanvas.getContext('2d')
  const cursorCtx = cursorCanvas.getContext('2d')
  const collisionCtx = collisionCanvas.getContext('2d', { willReadFrequently: true })
  const comboCtx = comboCanvas.current.getContext('2d')
  // const pixelCtx = pixelCanvas.current.getContext('2d', { alpha: false })

  // makes foreground transparent so you can see sprites under it
  foregroundCtx.globalAlpha = .85

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
        backgroundCtx.drawImage(this.image, this.crop.x, this.crop.y, globalVars.width, globalVars.height, this.position.x, this.position.y, globalVars.width, globalVars.height,)
      }
    }

    class Foreground {
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
        foregroundCtx.drawImage(this.image, this.crop.x, this.crop.y, globalVars.width, globalVars.height, this.position.x, this.position.y, globalVars.width, globalVars.height,)
      }
    }

    class Collisions {
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
        collisionCtx.drawImage(this.image, this.crop.x, this.crop.y, globalVars.width, globalVars.height, this.position.x, this.position.y, globalVars.width, globalVars.height,)
      }
    }



    // we create the sprite, background, and foreground instances we will be rendering
    const playerImage = new Image()
    playerImage.src = baseHero.heroSprite

    const playerSprite = new Sprite({
      image: playerImage,
      position: {
        x: globalVars.heroCenterX,
        y: globalVars.heroCenterY
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
        x: globalVars.heroCenterX,
        y: globalVars.heroCenterY
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
    const backgroundWidthCenter = background.naturalWidth / 2
    const backgroundHeightCenter = background.naturalHeight / 2

    // const backgroundWidthCenter = 100
    // const backgroundHeightCenter = 100

    const foreground = new Image()
    foreground.src = foreground_1
    // const foregroundWidth = foreground.naturalWidth / 2
    // const foregroundHeight = foreground.naturalHeight / 2

    const collisions = new Image()
    collisions.src = collision_1

    // baseHero.cameraX = backgroundWidthCenter
    // baseHero.cameraY = backgroundHeightCenter

    const backgroundSprite = new Background({
      image: background,
      position: {
        x: 0,
        y: 0
      },
      crop: {
        x: backgroundWidthCenter,
        y: backgroundHeightCenter
      }
    })

    const foregroundSprite = new Foreground({
      image: foreground,
      position: {
        x: 0,
        y: 0
      },
      crop: {
        x: backgroundWidthCenter,
        y: backgroundHeightCenter
      }
    })

    const collisionSprite = new Collisions({
      image: collisions,
      position: {
        x: 0,
        y: 0
      },
      crop: {
        x: backgroundWidthCenter,
        y: backgroundHeightCenter
      }
    })


    const animate = () => {

      // clears all canvases for a new animation frame
      // comboCtx.clearRect(0, 0, globalVars.width, globalVars.height)
      backgroundCtx.clearRect(0, 0, globalVars.width, globalVars.height)
      spriteCtx.clearRect(0, 0, globalVars.width, globalVars.height)
      foregroundCtx.clearRect(0, 0, globalVars.width, globalVars.height)
      cursorCtx.clearRect(0, 0, globalVars.width, globalVars.height)


      // moveEngine runs less than every frame to keep the hero sprite slower
      if (baseHero.frameCountLimiter >= baseHero.maxFrameCountLimiter) {
        baseHero.frameCountLimiter = 0
        baseHero = moveEngine(baseHero, cMasks, blockSize, collisionCtx, cursorCtx)
      }
      collisionCtx.clearRect(0, 0, globalVars.width, globalVars.height)


      baseHero.frameCountLimiter += baseHero.moveSpeed


      // sets position of heroSprite and equipment, as well as which spritesheet should be used for this frame
      // backgroundSprite.position.x = -baseHero.cameraX
      // backgroundSprite.position.y = -baseHero.cameraY
      // console.log(baseHero.cameraX, baseHero.cameraY, baseHero.heroX, baseHero.heroY)
      backgroundSprite.cropChange(baseHero.cameraX, baseHero.cameraY)
      foregroundSprite.cropChange(baseHero.cameraX, baseHero.cameraY)
      collisionSprite.cropChange(baseHero.cameraX, baseHero.cameraY)
      // console.log(baseHero.cameraX, baseHero.cameraY)
      // grassPatch.move(baseHero.cameraX, baseHero.cameraY)
      // barrelPatch.move(baseHero.cameraX, baseHero.cameraY)




      // console.log('hero: ', baseHero.cameraX, baseHero.cameraY, 'camera: ', baseHero.cameraX - globalVars.middleX, baseHero.cameraY - globalVars.middleY)
      // grassPatch.move(baseHero.cameraX, baseHero.cameraY)
      // barrelPatch.move(baseHero.cameraX, baseHero.cameraY)

      playerSprite.position = {x: baseHero.heroX, y: baseHero.heroY}
      swordSprite.position = {x: baseHero.heroX, y: baseHero.heroY}
      // console.log('x:', baseHero.heroX, 'y:', baseHero.heroY)
      // console.log(globalVars.heroCenterX, globalVars.heroCenterY)
      // console.log('camx:', baseHero.cameraX, 'camy:', baseHero.cameraY)

      // foregroundSprite.position.x = -baseHero.cameraX
      // foregroundSprite.position.y = -baseHero.cameraY

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
      eventDuration: .1,
      eventTimeout: .8,
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
    // foregroundCtx.fillStyle = 'rgba(255, 0, 0, 1)'
    // foregroundCtx.fillRect(baseHero.eventX, baseHero.eventY, baseHero.attackBlockSize, baseHero.attackBlockSize)

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

    // renders collision sprite, which is behind the background and not visible on canvas
    // you can change the z-index of the collision div in the css if you want to see it visualized
    collisionSprite.draw()
    // renders current background sprite
    backgroundSprite.draw()


    foregroundCtx.globalAlpha = 1

    animatedObjectsRender(grassPatch1.definition(), baseHero, backgroundCtx, foregroundCtx)
    animatedObjectsRender(grassPatch2.definition(), baseHero, backgroundCtx, foregroundCtx)
    animatedObjectsRender(grassPatch3.definition(), baseHero, backgroundCtx, foregroundCtx)
    animatedObjectsRender(barrelPatch.definition(), baseHero, backgroundCtx, foregroundCtx)
    // animatedObjectsRender(grassPatch2, baseHero, backgroundCtx, foregroundCtx)
    // animatedObjectsRender(grassPatch3, baseHero, backgroundCtx, foregroundCtx)
    // animatedObjectsRender(grassPatch4, baseHero, backgroundCtx, foregroundCtx)
    // animatedObjectsRender(grassPatch5, baseHero, backgroundCtx, foregroundCtx)
    foregroundCtx.globalAlpha = .85




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

      // this was used to visualize the hitbox coordinate checkers for collision detection, might use again to tweak that
      // backgroundCtx.fillStyle = 'rgba(255, 0, 0, 1)'
      // backgroundCtx.fillRect( globalVars.heroStartXCoord - baseHero.cameraX, globalVars.heroStartYCoord - baseHero.cameraY, 8, 8)
      // backgroundCtx.fillStyle = 'rgba(0, 255, 0, 1)'
      // backgroundCtx.fillRect(baseHero.eventX, baseHero.eventY, 4, 4)

      const drawToComboCanvas = (canvases) => {
        for (let el of canvases) {
          // const canvas = document.getElementById(el)
          const renderImg = el.transferToImageBitmap()
          // console.log(renderImg)
          // const canvas = document.getElementById('backgroundCanvas')
          // const dataURL = canvas.toDataURL()
          // console.log(dataURL)
          comboCtx.drawImage(renderImg, 0, 0)
        }
      }
      if (frameRateCounter === frameRatePeak) {
        // pixelator(comboCtx, pixelCtx, backgroundCanvas, spriteCanvas, foregroundCanvas, cursorCanvas) // turn this on to burn it all down
        // drawToComboCanvas(['backgroundCanvas', 'spriteCanvas', 'foregroundCanvas', 'cursorCanvas'])
        drawToComboCanvas([backgroundCanvas, spriteCanvas, foregroundCanvas, cursorCanvas])
        frameRateCounter = 0
      }
      frameRateCounter++


    }


    animate()


  }, [])




  return (
    <div id='main-container'>
        {/* <div id='instructions'>WASD to move - SHIFT to dash - LEFT MOUSE BUTTON to attack</div> */}
      <div id='canvas-container'>
        <div id='sizing' style={{height: window.innerHeight, width: window.innerWidth}}></div>
        {/* <canvas id='collisionCanvas' ref={collisionCanvas} height={window.innerHeight} width={window.innerWidth} />
        <canvas id='backgroundCanvas' ref={backgroundCanvas} height={window.innerHeight} width={window.innerWidth} />
        <canvas id='spriteCanvas' ref={spriteCanvas} height={window.innerHeight} width={window.innerWidth} />
        <canvas id='foregroundCanvas' ref={foregroundCanvas} height={window.innerHeight} width={window.innerWidth} />
        <canvas id='cursorCanvas' ref={cursorCanvas} height={window.innerHeight} width={window.innerWidth} /> */}
        <canvas id='comboCanvas' ref={comboCanvas} height={window.innerHeight} width={window.innerWidth} />
        {/* <canvas id='pixelCanvas' ref={pixelCanvas} height={window.innerHeight} width={window.innerWidth} /> */}
        {/* <div className='blur'></div> */}
        {/* <div className='scanline-tone'></div> */}
        {/* <div className='pixel-tone'></div> */}
        {/* <div className='pixel-mask'></div> */}
      </div>
    </div>
  )
}


export default BasicRender
