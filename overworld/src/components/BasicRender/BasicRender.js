import React, { useContext, useEffect, useRef, useState } from 'react'
import './BasicRender.css'
import moveEngine from './MoveEngine'
import eventEngine from './EventEngine'
// import background_1 from '../../assets/backgrounds/test/map_test_2.png'
import background_1 from '../../assets/backgrounds/test/map_test_3_background.png'
// import background_1 from '../../assets/backgrounds/river_style_test.png'
import foreground_1 from '../../assets/backgrounds/test/map_test_3_foreground.png'


import heroRender from './HeroRender'
import hudRender from './HUDRender'
import attackRender from './AttackRender'
import inputEngine from './InputEngine'
import baseHeroGet from './BaseHero'


import { hero_spritesheets, sword_spritesheets } from './spriteRef'

import sword_fx from '../../assets/sounds/sword/damage_sound.wav'



// consider height of 336 x 192 with block size of 16
// consider height of 256 x 192 with block size of 16
const upscale = 4 // multiplier for resolution - 2 means each visible pixel is 2 x 2 real pixels etc
const height = 192 * upscale
const width = 336 * upscale
const blockSize = 16 * upscale   // size of each grid block in pixels for collison objects
let baseHero = baseHeroGet


// const blockSize = 16 * upscale   // size of each grid block in pixels for hero collison box
// const heroSpriteSize = 16 * upscale   // size of sprite we want to grab from the spritesheet
// const heroSpriteSize = 64   // size of sprite we want to grab from the spritesheet (must be actual resolution)
// let heroCropX = 0
// let heroCropY = 0
// const topDashBoost = 2
// let dashBoost = 0
// const boostMaxVel = 5 // maxVel when boosting
// const baseMaxVel = 4 // base maxVel that maxVel will return to when not boosting
// let maxVel = baseMaxVel // max acceleration (pixel movement) of velocity per frame
// let rateAccel = 1 // rate at which movement object accelerates velocity
// let rateDecel = 1 // rate at which velocity decays
// let heroSprite = hero_spritesheets.down
// let swordSpriteSheet = sword_spritesheets.down
// let heroDirection = 'down'
// let attackActive = false
// let attackAnimation = false // when true this overrides the normal walking animation with the attack anim

// let coolDownLevel = 0
// let currentCooldownMax = 120
// const coolDownLevelMax = 100

// const maxStam = 100
// let currentStam = maxStam


// let eventX = null
// let eventY = null


// let xVel = 0 // current velocity for x and y movement
// let yVel = 0


// let frameCountLimiter = 0
// const baseMaxFrameCountLimiter = 180
// let maxFrameCountLimiter = baseMaxFrameCountLimiter
// const baseMoveSpeed = 60
// let moveSpeed = baseMoveSpeed



// defines the outer bounds of the scene for collision purposes
// const outerBoundary = [
//   {x: 0, y: 0, xBlocks: width / blockSize + 2, yBlocks: 1, gridSize: blockSize}, // this one covers the hud bar at the top
//   {x: -blockSize, y: -blockSize, xBlocks: 1, yBlocks: height / blockSize + 2, gridSize: blockSize},
//   {x: width, y: -blockSize, xBlocks: 1, yBlocks: height / blockSize + 2, gridSize: blockSize},
//   {x: -blockSize, y: height, xBlocks: width / blockSize + 2, yBlocks: 1, gridSize: blockSize},
// ]
const outerBoundary = [
  {x: -blockSize, y: -blockSize / 2, xBlocks: width / blockSize + 2, yBlocks: 1, gridSize: blockSize}, // this one covers the hud bar at the top
  {x: -blockSize, y: -blockSize, xBlocks: 1, yBlocks: height / blockSize + 2, gridSize: blockSize},
  {x: width, y: -blockSize, xBlocks: 1, yBlocks: height / blockSize + 2, gridSize: blockSize},
  {x: -blockSize, y: height, xBlocks: width / blockSize + 2, yBlocks: 1, gridSize: blockSize},
]

// defines collision boxes inside scene, also these will be drawn to the canvas
const innerBoundary = [
  {x: blockSize * 7, y: blockSize * 3, xBlocks: 1, yBlocks: 1, gridSize: blockSize},
  {x: blockSize * 17, y: blockSize * 2, xBlocks: 1, yBlocks: 1, gridSize: blockSize},
  {x: blockSize * 17, y: blockSize * 10, xBlocks: 1, yBlocks: 1, gridSize: blockSize},
  {x: blockSize * 2, y: blockSize * 10, xBlocks: 1, yBlocks: 1, gridSize: blockSize},
  {x: blockSize * 11, y: blockSize * 3, xBlocks: 3, yBlocks: 1, gridSize: blockSize},
]

// const innerBoundary = [
  // {x: width / 2 - blockSize * 10, y: 64, xBlocks: 20, yBlocks: 1, gridSize: blockSize},
  // {x: width / 2 - blockSize * 10, y: 64, xBlocks: 1, yBlocks: 16, gridSize: blockSize},
  // {x: width / 2 + blockSize * 10, y: 64, xBlocks: 1, yBlocks: 16, gridSize: blockSize},
  // {x: width / 2 - blockSize * 9, y: 424, xBlocks: 6, yBlocks: 1, gridSize: blockSize},
  // {x: width / 2 + blockSize * 4, y: 424, xBlocks: 6, yBlocks: 1, gridSize: blockSize},
  // {x: width / 2 - blockSize * 12, y: 528, xBlocks: 25, yBlocks: 1, gridSize: blockSize},
// ]

// concats all collision arrays for use in buildCMask
const collisions = outerBoundary.concat(innerBoundary)

// getDimension returns the dimension of a rectangular object for collision detection
// x and y are the upper left corner pixel coordinates
// xBlocks and yBlocks are the number of 16px (or whatever the grid size is) grid blocks the object spans in each dimension
const getDimension = (boundary) => {
  let {x, y, xBlocks, yBlocks, gridSize} = boundary
  return (
    {
      tl: [x, y],
      tr: [x + (xBlocks * gridSize), y],
      bl: [x, y + (yBlocks * gridSize)],
      br: [x + (xBlocks * gridSize), y + (yBlocks * gridSize)]
    }
  )
}

// buildCMask takes the collisions array and creates coordinates for each collision object
// so we can check for collisions
const buildCMask = (collisions) => {
  const cMaskBuild = []
  for (let el of collisions) {
    cMaskBuild.push(getDimension(el))
  }
  return cMaskBuild
}

// this array contains all collision masks for map boundaries and other collision objects present
const cMasks = buildCMask(collisions)



// keeps track of input state. Fed into inputEngine function in useEffect below every frame
// let keys = {
//   ArrowUp: {
//     pressed:false
//   },
//   ArrowDown: {
//     pressed:false
//   },
//   ArrowLeft: {
//     pressed:false
//   },
//   ArrowRight: {
//     pressed:false
//   },
//   Space: {
//     pressed:false
//   },
//   Shift: {
//     pressed:false
//   },
//   e: {
//     pressed:false
//   },
//   mouse1: {
//     pressed:false
//   }
// }

// let keys = baseHero.keys



const BasicRender = ({}) => {

  const swordFx = new Audio(sword_fx)
  // let moveObj = {}
  // let eventObj = {}
  // let attackCooldownOff = true
  const canvasRef = useRef(null)

  useEffect(() => {


  // const canvas = createCanvas(200, 200)
  const ctx = canvasRef.current.getContext('2d')

  const rectWidth = baseHero.blockSize
  const rectHeight = baseHero.blockSize
  const coordX = (width / 2) - (rectWidth)
  const coordY = (height / 2) - (rectHeight / 2)



    // this next function sends the keys object to the inputEngine where all the event listeners are for inputs
    // returns keys object which is checked for what keys are currently pressed each frame
    baseHero.keys = inputEngine(baseHero.keys)

    // keys = baseHero.keys

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
        ctx.drawImage(this.image, this.crop.x, this.crop.y, baseHero.heroSpriteSize, baseHero.heroSpriteSize, this.position.x, this.position.y, rectWidth, rectHeight)
        // ctx.drawImage(this.image, this.position.x, this.position.y, rectWidth, rectHeight)
      }
    }

    class Background {
      constructor({ image, position }) {
        this.position = position
        this.image = image
      }

      draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, width, height)
      }
    }



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

    const foregroundSprite = new Background({
      image: foreground,
      position: {
        x: 0,
        y: 0
      }
    })

    const animate = () => {





      // moveObj = { // object passed to MoveEngine to get next frame movement
      //   x: playerSprite.position.x,
      //   y: playerSprite.position.y,
      //   cMasks: cMasks, // collision maps array
      //   xVel: xVel,
      //   yVel: yVel,
      //   keys: keys,
      //   maxStam: maxStam,
      //   currentStam: currentStam,
      //   baseMaxVel: baseMaxVel,
      //   maxVel: maxVel,
      //   rateAccel: rateAccel,
      //   rateDecel: rateDecel,
      //   topDashBoost: topDashBoost,
      //   boostMaxVel: boostMaxVel,
      //   dashBoost: dashBoost,
      //   blockSize: blockSize,
      //   heroSprite: heroSprite,
      //   equipImage: swordSpriteSheet,
      //   heroSpriteSize,
      //   heroCropX: heroCropX,
      //   heroCropY: heroCropY,
      //   heroDirection: heroDirection,
      //   baseMoveSpeed: baseMoveSpeed,
      //   moveSpeed: moveSpeed,
      //   upscale,
      // }


      // is true if any directional input is given, otherwise false
      // let keysPressed = (baseHero.keys.ArrowUp.pressed || baseHero.keys.ArrowDown.pressed || baseHero.keys.ArrowLeft.pressed || baseHero.keys.ArrowRight.pressed)

      // baseHero.keys = keys
      // moveEngine runs less than every frame to keep the hero sprite slower
        if (baseHero.frameCountLimiter >= baseHero.maxFrameCountLimiter) {
          // console.log('running', moveSpeed, xVel, yVel)
          baseHero.frameCountLimiter = 0
          baseHero = moveEngine(baseHero, cMasks, blockSize)
        }

        baseHero.frameCountLimiter += baseHero.moveSpeed

        // console.log(moveSpeed)




        playerSprite.position.x = baseHero.x
        playerSprite.position.y = baseHero.y


        // playerSprite.position.x = pixelPerfect(moveObj.x, moveObj.heroDirection, 'x', upscale)
        // playerSprite.position.y = pixelPerfect(moveObj.y, moveObj.heroDirection, 'y', upscale)

        swordSprite.position.x = playerSprite.position.x
        swordSprite.position.y = playerSprite.position.y


        // playerSprite.position.x = moveObj.x
        // playerSprite.position.y = moveObj.y

        // swordSprite.position.x = moveObj.x
        // swordSprite.position.y = moveObj.y


        // heroSprite = moveObj.heroSprite
        playerImage.src = baseHero.heroSprite

        // swordSpriteSheet = moveObj.equipImage
        equipImage.src = baseHero.swordSpriteSheet


        // xVel = moveObj.xVel
        // yVel = moveObj.yVel

        // currentStam = moveObj.currentStam

        // heroDirection = moveObj.heroDirection

        // heroCropX = moveObj.heroCropX

        // moveSpeed = moveObj.moveSpeed



        // regenerates stamina - can't do this in moveEngine because that only runs when there is input or velocity
        // if (baseHero.currentStam < baseHero.maxStam) {
        //   baseHero.currentStam = baseHero.currentStam + .05
        // } else {
        //   baseHero.currentStam = baseHero.maxStam
        // }


        // rateAccel = moveObj.rateAccel
        // rateDecel = moveObj.rateDecel
      // }


      // calculates and draws attack effects on keypress with cooldown
      // let eventObj = { // object passed to EventEngine to trigger appropriate event
      //   x: playerSprite.position.x,
      //   y: playerSprite.position.y,
      //   heroDirection: heroDirection,
      //   eventX: eventX,
      //   eventY: eventY,
      //   blockSize: blockSize,
      //   eventType: 'attack',
      //   eventDirection: 'heroFront',
      //   eventAreaShape: 'rectangle',
      //   eventXDim: 1,
      //   eventYDim: 3,
      //   eventEffect: {
      //     damage: 10
      //   },
      //   eventDuration: 1,
      //   eventTimeout: 1.5,
      //   eventAnim: null,
      // }

      if (baseHero.keys.e.pressed && baseHero.attackCooldownOff || baseHero.keys.mouse1.pressed && baseHero.attackCooldownOff) {
        baseHero.attackCooldownOff = false
        baseHero.attackActive = true
        baseHero.attackAnimation = true
        baseHero.coolDownLevel = 0 // sets the var for animating HUD cooldown level

        // eventObj = eventEngine(eventObj)

        // eventX = eventObj.eventX
        // eventY = eventObj.eventY

        // cooldown setTimeout sets the cooldown on an event ability - eventObj.eventTimeout determines the length in seconds
        const cooldown = setTimeout(() => { // enables this attack again after eventTimeout # of seconds, essentially a cooldown
          baseHero.attackCooldownOff = true
          clearTimeout(cooldown)
          // console.log('cooldown over')
        }, 1500)


        // sets duration of event, set by eventObj.eventDuration in seconds
        const eventDuration = setTimeout(() => {
          clearTimeout(eventDuration)
          baseHero.attackActive = false
          // console.log('attack over')
        }, 1000)


      }

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

      window.requestAnimationFrame(animate);


      backgroundSprite.draw()


    // renders stamina bar and cooldown currently
    hudRender(ctx, baseHero.currentStam, baseHero.maxStam, baseHero.attackCooldownOff, baseHero.coolDownLevel, baseHero.coolDownLevelMax, baseHero.upscale, playerSprite, baseHero.blockSize, swordIcon )



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


      foregroundSprite.draw()


    }


    animate();


  }, [])



  return (
    <div id='main-container'>
        {/* <div id='instructions'>WASD to move - SHIFT to dash - LEFT MOUSE BUTTON to attack</div> */}
      <div id='canvas-container'>
        <canvas id='canvas' ref={canvasRef} height={height} width={width} />
        <div className='blur' ></div>
        <div className='scanline-tone'></div>
        <div className='pixel-tone'></div>
      </div>
    </div>
  )
}


export default BasicRender
