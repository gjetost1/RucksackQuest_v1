import React, { useContext, useEffect, useRef, useState } from 'react'
import './BasicRender.css'
import moveEngine from './MoveEngine'
import eventEngine from './EventEngine'
import background_1 from '../../assets/backgrounds/test/background_1.png'
// import black_square from '../../assets/sprites/black_square.png'
// import CanvasContext from '../CanvasContext'

import { heroRender } from './HeroRender'
import inputEngine from './InputEngine'

import { hero_spritesheets, sword_spritesheets } from './spriteRef'

import sword_fx from '../../assets/sounds/sword/damage_sound.wav'

// import droneSprt from './droneRef'



// consider height of 336 x 192 with block size of 24
// consider height of 256 x 192 with block size of 16
const upscale = 4 // multiplier for resolution
const height = 192 * upscale
const width = 336 * upscale
const blockSize = 24   // size of each grid block in pixels for collison objects
const heroBlockSize = 16 * upscale   // size of each grid block in pixels for hero collison box
const heroSpriteSize = 16 * upscale   // size of sprite we want to grab from the spritesheet
let heroCropX = 0
let heroCropY = 0
const topDashBoost = .2
let dashBoost = 0
const boostMaxVel = 2 // maxVel when boosting
const baseMaxVel = 1 // base maxVel that maxVel will return to when not boosting
let maxVel = baseMaxVel // max acceleration (pixel movement) of velocity per frame
let rateAccel = .2 // rate at which movement object accelerates velocity
let rateDecel = .1 // rate at which velocity decays
let heroSprite = hero_spritesheets.down
let swordSpriteSheet = sword_spritesheets.down
let heroDirection = 'down'
let attackActive = false
let attackAnimation = false // when true this overrides the normal walking animation with the attack anim
let attackAnimationCounter = 0 // incremented to set timing for attack animation frames
let attackAnimationMaxCount = 40 // higher number means slower attack animations
let coolDownLevel = 0
let currentCooldownMax = 120
const coolDownLevelMax = 100

const maxStam = 100
let currentStam = maxStam


let eventX = null
let eventY = null


let xVel = 0 // current velocity for x and y movement
let yVel = 0



// defines the outer bounds of the scene for collision purposes
const outerBoundary = [
  {x: 0, y: 0, xBlocks: width / blockSize + 2, yBlocks: 1, gridSize: blockSize}, // this one covers the hud bar at the top
  {x: -blockSize, y: -blockSize, xBlocks: 1, yBlocks: height / blockSize + 2, gridSize: blockSize},
  {x: width, y: -blockSize, xBlocks: 1, yBlocks: height / blockSize + 2, gridSize: blockSize},
  {x: -blockSize, y: height, xBlocks: width / blockSize + 2, yBlocks: 1, gridSize: blockSize},
]

// defines collision boxes inside scene, also these will be drawn to the canvas
const innerBoundary = [
  {x: width / 2 - blockSize * 10, y: 64, xBlocks: 20, yBlocks: 1, gridSize: blockSize},
  {x: width / 2 - blockSize * 10, y: 64, xBlocks: 1, yBlocks: 16, gridSize: blockSize},
  {x: width / 2 + blockSize * 10, y: 64, xBlocks: 1, yBlocks: 16, gridSize: blockSize},
  {x: width / 2 - blockSize * 9, y: 424, xBlocks: 6, yBlocks: 1, gridSize: blockSize},
  {x: width / 2 + blockSize * 4, y: 424, xBlocks: 6, yBlocks: 1, gridSize: blockSize},
  {x: width / 2 - blockSize * 12, y: 528, xBlocks: 25, yBlocks: 1, gridSize: blockSize},
]

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
let keys = {
  ArrowUp: {
    pressed:false
  },
  ArrowDown: {
    pressed:false
  },
  ArrowLeft: {
    pressed:false
  },
  ArrowRight: {
    pressed:false
  },
  Space: {
    pressed:false
  },
  Shift: {
    pressed:false
  },
  e: {
    pressed:false
  },
  mouse1: {
    pressed:false
  }
}



const BasicRender = ({}) => {

  const swordFx = new Audio(sword_fx)
  let moveObj = {}
  let eventObj = {}
  let attackCooldownOff = true
  const canvasRef = useRef(null)



  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const rectWidth = heroSpriteSize
    const rectHeight = heroSpriteSize
    const coordX = (width / 2) - (rectWidth / 2)
    const coordY = (height / 2) - (rectHeight / 2)



    // this next function sends the keys object to the inputEngine where all the event listeners are for inputs
    // returns keys object which is checked for what keys are currently pressed each frame
    keys = inputEngine(keys)

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
        ctx.drawImage(this.image, this.crop.x, this.crop.y, rectWidth, rectHeight, this.position.x, this.position.y, rectWidth, rectHeight)
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
    playerImage.src = heroSprite

    const playerSprite = new Sprite({
      image: playerImage,
      position: {
        x: coordX,
        y: coordY
      },
      crop: {
        x: heroCropX,
        y: heroCropY
      }
    })

    const equipImage = new Image()
    equipImage.src = swordSpriteSheet

    // console.log(heroSprite)

    const swordSprite = new Sprite({
      image: equipImage,
      position: {
        x: coordX,
        y: coordY
      },
      crop: {
        x: heroCropX,
        y: heroCropY
      }
    })

    const swordIcon = new Image()
    swordIcon.src = sword_spritesheets.icon


    const background = new Image()
    background.src = background_1

    const backgroundSprite = new Background({
      image: background,
      position: {
        x: 0,
        y: 0
      }
    })

    const animate = () => {

      moveObj = { // object passed to MoveEngine to get next frame movement
        x: playerSprite.position.x,
        y: playerSprite.position.y,
        cMasks: cMasks, // collision maps array
        xVel: xVel,
        yVel: yVel,
        keys: keys,
        maxStam: maxStam,
        currentStam: currentStam,
        baseMaxVel: baseMaxVel,
        maxVel: maxVel,
        rateAccel: rateAccel,
        rateDecel: rateDecel,
        topDashBoost: topDashBoost,
        boostMaxVel: boostMaxVel,
        dashBoost: dashBoost,
        blockSize: heroBlockSize,
        heroSprite: heroSprite,
        equipImage: swordSpriteSheet,
        heroSpriteSize,
        heroCropX: heroCropX,
        heroCropY: heroCropY,
        heroDirection: heroDirection
      }

      // is true if any directional input is given, otherwise false
      let keysPressed = (keys.ArrowUp.pressed || keys.ArrowDown.pressed || keys.ArrowLeft.pressed || keys.ArrowRight.pressed)

      // moveEngine runs only if there is a directional input or if there is any x or y velocity
      // if (keysPressed || xVel || yVel) {
        // setMoveObj(moveEngine(moveObj))
        moveObj = moveEngine(moveObj)
      // }

      // if (moveObj) {
        playerSprite.position.x = moveObj.x
        playerSprite.position.y = moveObj.y

        swordSprite.position.x = moveObj.x
        swordSprite.position.y = moveObj.y



        heroSprite = moveObj.heroSprite
        playerImage.src = heroSprite

        swordSpriteSheet = moveObj.equipImage
        equipImage.src = swordSpriteSheet


        xVel = moveObj.xVel
        yVel = moveObj.yVel

        currentStam = moveObj.currentStam

        heroDirection = moveObj.heroDirection

        heroCropX = moveObj.heroCropX

        playerSprite.cropChange(heroCropX, heroCropY)
        swordSprite.cropChange(heroCropX, heroCropY)


        // regenerates stamina - can't do this in moveEngine because that only runs when there is input or velocity
        if (currentStam < maxStam) {
          currentStam = currentStam + .03
        } else {
          currentStam = maxStam
        }


        rateAccel = moveObj.rateAccel
        rateDecel = moveObj.rateDecel
      // }


      // calculates and draws attack effects on keypress with cooldown
      let eventObj = { // object passed to EventEngine to trigger appropriate event
        x: playerSprite.position.x,
        y: playerSprite.position.y,
        heroDirection: heroDirection,
        eventX: eventX,
        eventY: eventY,
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
        eventTimeout: 1,
        eventAnim: null,
      }

      if (keys.e.pressed && attackCooldownOff || keys.mouse1.pressed && attackCooldownOff) {
        attackCooldownOff = false
        attackActive = true
        attackAnimation = true
        coolDownLevel = 0 // sets the var for animating HUD cooldown level

        // console.log('action')

        eventObj = eventEngine(eventObj)

        eventX = eventObj.eventX
        eventY = eventObj.eventY

        // cooldown setTimeout sets the cooldown on an event ability - eventObj.eventTimeout determines the length in seconds
        const cooldown = setTimeout(() => { // enables this attack again after eventTimeout # of seconds, essentially a cooldown
          attackCooldownOff = true
          clearTimeout(cooldown)
          // console.log('cooldown over')
        }, eventObj.eventTimeout * 1000)


        // sets duration of event, set by eventObj.eventDuration in seconds
        const eventDuration = setTimeout(() => {
          clearTimeout(eventDuration)
          attackActive = false
          // console.log('attack over')
        }, eventObj.eventDuration * 1000)


      }

      if (!attackCooldownOff) {
        coolDownLevel += coolDownLevelMax / currentCooldownMax
        coolDownLevel = Math.round(coolDownLevel)
        if (coolDownLevel >= coolDownLevelMax) {
          coolDownLevel = coolDownLevelMax
        }
        console.log(coolDownLevel)
      } else {
        coolDownLevel = 0
      }

      window.requestAnimationFrame(animate);

      // draws background of current scene
      ctx.fillStyle = 'rgb(119, 183, 168)'
      ctx.fillRect(0, blockSize, width, height - blockSize)
      // backgroundSprite.draw()

      // draws HUD bar at top
      ctx.fillStyle = 'gray'
      ctx.fillRect(0, 0, width, blockSize)

      // draws stamina bar
      ctx.fillStyle = 'black'
      ctx.font = "12px Arial"
      ctx.fillText("S", 2, 12)
      ctx.fillStyle = 'rgb(65, 65, 65)'
      ctx.fillRect(13, 3, 102, 9)
      if (currentStam > maxStam - maxStam / 3) {
        ctx.fillStyle = 'rgb(57, 201, 237)'
      } else if (currentStam > maxStam - (maxStam / 3) * 2) {
        ctx.fillStyle = 'rgb(240, 143, 33)'
      } else {
        ctx.fillStyle = 'rgb(240, 57, 33)'
      }
      const stamDisplay = (currentStam / maxStam) * 100
      ctx.fillRect(14, 4, stamDisplay, 7)

      // ability display with cooldown level
      const cooldownDisplay = (coolDownLevel / coolDownLevelMax) * 22
      ctx.fillStyle = 'rgb(65, 65, 65)'
      ctx.fillRect(150, 0, 24, 24)
      if (attackCooldownOff) {
        ctx.fillStyle = 'rgb(57, 201, 237)'
      } else if (coolDownLevel > coolDownLevelMax / 3) {
        ctx.fillStyle = 'rgb(240, 143, 33)'
      } else {
        ctx.fillStyle = 'rgb(240, 57, 33)'
      }
      ctx.fillRect(151, 1 + cooldownDisplay, 22, 22 - cooldownDisplay)
      ctx.drawImage(swordIcon, 150, 0, 24, 24)


      // this draws all interior objects that have collision
      for (let i = 0; i < innerBoundary.length; i++) {
        ctx.fillStyle = 'rgb(0, 116, 81)'
        let {x, y, xBlocks, yBlocks, gridSize} = innerBoundary[i]
        ctx.fillRect(x, y, xBlocks * gridSize, yBlocks * gridSize)
      }

      // renders attack visuals if there is an active attack
      // if (attackActive) {
        // console.log('attack is active')
        // ctx.fillStyle = 'rgb(65, 65, 100)'
        // ctx.fillRect(eventX, eventY, eventObj.blockSize * 1, eventObj.blockSize * 1)
      // }

      // overwrites the walking animation with an attack animation when attack is active
      const attackAnim = () => {
        attackAnimationCounter++
        if (attackAnimationCounter < attackAnimationMaxCount / 4) {
          heroCropX = heroSpriteSize * 7
          swordFx.volume = 0.1;
          swordFx.play();
        } else if (attackAnimationCounter < (attackAnimationMaxCount / 4) * 2) {
          heroCropX = heroSpriteSize * 8
        } else if (attackAnimationCounter < attackAnimationMaxCount) {
          heroCropX = heroSpriteSize * 9
        } else if (attackAnimationCounter > attackAnimationMaxCount) {
          heroCropX = 0
          attackAnimationCounter = 0
          attackAnimation = false
        }
      }

      if (attackAnimation) {
        attackAnim()
      }

      // draws hero sprite image to canvas
      // feed in sprite class instances in the order you want them rendered
      // eg typically base player sprite first, then clothing, then equipment
      heroRender([playerSprite, swordSprite])




      // playerSprite.draw()
      // swordSprite.draw()



    }

    animate();

  }, [])



  return (
    <div id='main-container'>
        <div id='instructions'>WASD to move - SHIFT to dash - LEFT MOUSE BUTTON to attack</div>
      <div id='canvas-container'>
        <canvas ref={canvasRef} height={height} width={width} />
      </div>
        {/* <div id='color-tone'></div> */}
    </div>
  )
}


export default BasicRender
