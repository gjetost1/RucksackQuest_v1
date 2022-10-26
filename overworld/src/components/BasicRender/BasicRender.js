import React, { useContext, useEffect, useRef, useState } from 'react'
import './BasicRender.css'
import moveEngine from './MoveEngine'
import eventEngine from './EventEngine'
import black_square from '../../assets/sprites/black_square.png'
import CanvasContext from '../CanvasContext'

import droneSprt from './droneRef'


const height = 192 * 2
const width = 256 * 2
const blockSize = 16  // size of each grid block in pixels
const topDashBoost = .4
let dashBoost = 0
const boostMaxVel = 4 // maxVel when boosting
const baseMaxVel = 1.5 // base maxVel that maxVel will return to when not boosting
let maxVel = baseMaxVel // max acceleration (pixel movement) of velocity per frame
let rateAccel = .2 // rate at which movement object accelerates velocity
let rateDecel = .1 // rate at which velocity decays
let heroSprite = droneSprt.down
let heroDirection = 'down'
let attackActive = false

const maxStam = 100
let currentStam = maxStam


// // move rate for character sprite
// let moveX = 1.2
// let moveY = 1.2

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
  {x: width / 2 - blockSize * 5, y: 64, xBlocks: 10, yBlocks: 1, gridSize: blockSize},
  {x: width / 2 - blockSize * 5, y: 64, xBlocks: 1, yBlocks: 8, gridSize: blockSize},
  {x: width / 2 + blockSize * 4, y: 64, xBlocks: 1, yBlocks: 8, gridSize: blockSize},
  {x: width / 2 - blockSize * 5, y: 176, xBlocks: 3, yBlocks: 1, gridSize: blockSize},
  {x: width / 2 + blockSize * 2, y: 176, xBlocks: 3, yBlocks: 1, gridSize: blockSize},
  {x: width / 2 - blockSize * 8, y: 228, xBlocks: 16, yBlocks: 1, gridSize: blockSize},
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



// keeps track of input state
const keys = {
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
  }
}


let lastKeyDown = ''; // use to determine which sprite to display once movement animation is over (once sprite anims are implemented)

// event listener for directional movement input
document.addEventListener('keydown', function(playerWalk) {
  switch (playerWalk.key) {
    case 'w':
    case 'W':
    case 'ArrowUp':
      keys.ArrowUp.pressed = true
      lastKeyDown = 'ArrowUp'
      // console.log('Walk Up')
    break;
    case 's':
    case 'S':
    case 'ArrowDown':
      keys.ArrowDown.pressed = true
      lastKeyDown = 'ArrowDown'
      // console.log('Walk Down')
    break;
    case 'a':
    case 'A':
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      lastKeyDown = 'ArrowLeft'
      // console.log('Walk Left')
    break;
    case 'd':
    case 'D':
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      lastKeyDown = 'ArrowRight'
      // console.log('Walk Right')
    break;
      default:
      break;
  }
})

// event listener for directional movement end of input
document.addEventListener('keyup', function(playerWalk) {
  switch (playerWalk.key) {
    case 'w':
    case 'W':
    case 'ArrowUp':
      keys.ArrowUp.pressed = false
      // console.log('Walk Up')
    break;
    case 's':
    case 'S':
    case 'ArrowDown':
      keys.ArrowDown.pressed = false
      // console.log('Walk Down')
    break;
      case 'a':
      case 'A':
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        // console.log('Walk Left')
      break;
      case 'd':
      case 'D':
      case 'ArrowRight':
        keys.ArrowRight.pressed = false
        // console.log('Walk Right')
      break;
      default:
      break;
  }
});

// event listener for inputs other than directional movement
document.addEventListener('keydown', (action) => {
  // console.log(jump)
  switch(action.key) {
    case ' ':
      keys.Space.pressed = true
      setTimeout(() => keys.Space.pressed = false, 30)
      // console.log('jump')
    break
    case 'Shift':
      keys.Shift.pressed = true
      // console.log('dash')
    break
    case 'e':
    case 'E':
      keys.e.pressed = true
      // console.log('action')
    break
    default:
    break
  }
})

document.addEventListener('keyup', (action) => {
  // console.log(jump)
  switch(action.key) {
    case ' ':
      keys.Space.pressed = false
    break
    case 'Shift':
      keys.Shift.pressed = false
    break
    case 'e':
    case 'E':
      keys.e.pressed = false
      // console.log('end action')
    break
    default:
    break
  }
})

const BasicRender = ({}) => {

  // const [currentStam, setCurrentStam] = useState(maxStam)
  // const [moveObj, setMoveObj] = useState({})
  // const [eventObj, setEventObj] = useState({})
  let moveObj = {}
  let eventObj = {}
  // const [attackTimeoutOff, setAttackTimeoutOff] = useState(true)
  let attackCooldownOff = true
  // const [attackActive, setAttackActive] = useState(false)

  const canvasRef = useRef(null)
  // const ctx = useContext(CanvasContext)

  // const ctx = canvasRef.current.getContext('2d');

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const rectWidth = 16
    const rectHeight = 16
    const coordX = (width / 2) - (rectWidth / 2)
    const coordY = (height / 2) - (rectHeight / 2)

    class Sprite {
      constructor({ image, position }) {
        this.position = position
        this.image = image
      }

      draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, rectWidth, rectHeight)
      }
    }



    const playerImage = new Image()
    playerImage.src = heroSprite

    const playerSprite = new Sprite({
      image: playerImage,
      position: {
        x: coordX,
        y: coordY
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
        blockSize: blockSize,
        heroSprite: heroSprite,
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

        heroSprite = moveObj.heroSprite
        playerImage.src = heroSprite

        xVel = moveObj.xVel
        yVel = moveObj.yVel

        currentStam = moveObj.currentStam

        heroDirection = moveObj.heroDirection

        // regenerates stamina - can't do this in moveEngine because that only runs when there is input or velocity
        if (currentStam < maxStam) {
          currentStam = currentStam + .01
        } else {
          currentStam = maxStam
        }


        rateAccel = moveObj.rateAccel
        rateDecel = moveObj.rateDecel
      // }


      // calculates and draws attack effects on keypress with cooldown
      if (keys.e.pressed && attackCooldownOff) {
        attackCooldownOff = false
        attackActive = true

        console.log('action')
        let eventObj = { // object passed to EventEngine to trigger appropriate event
          x: playerSprite.position.x,
          y: playerSprite.position.y,
          heroDirection: heroDirection,
          eventX: null,
          eventY: null,
          blockSize: blockSize,
          eventType: 'attack',
          eventDirection: 'heroFront',
          eventAreaShape: 'rectangle',
          eventXDim: 1,
          eventYDim: 1,
          eventEffect: {
            damage: 10
          },
          eventDuration: 1,
          eventTimeout: 3,
          eventAnim: null,
        }

        eventObj = eventEngine(eventObj)

        // cooldown setTimeout sets the cooldown on an event ability - eventObj.eventTimeout determines the length in seconds
        const cooldown = setTimeout(() => { // enables this attack again after eventTimeout # of seconds, essentially a cooldown
          attackCooldownOff = true
          clearTimeout(cooldown)
          console.log('cooldown over')
        }, eventObj.eventTimeout * 1000)



        // sets duration of event, set by eventObj.eventDuration in seconds
        const eventDuration = setTimeout(() => {
          clearTimeout(eventDuration)
          attackActive = false
          console.log('attack over')
        }, eventObj.eventDuration * 1000)


      }

      window.requestAnimationFrame(animate);

      // draws background of current scene
      ctx.fillStyle = 'rgb(119, 183, 168)'
      ctx.fillRect(0, blockSize, width, height - blockSize)

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


      // this draws all interior objects that have collision
      for (let i = 0; i < innerBoundary.length; i++) {
        ctx.fillStyle = 'rgb(177, 15, 15)'
        let {x, y, xBlocks, yBlocks, gridSize} = innerBoundary[i]
        ctx.fillRect(x, y, xBlocks * gridSize, yBlocks * gridSize)
      }

      // draws hero sprite image to canvas
      playerSprite.draw()

        // renders attack visuals if there is an active attack
        if (attackActive) {
          console.log('attack is active')
          ctx.fillStyle = 'rgb(65, 65, 100)'
          ctx.fillRect(eventObj.eventX, eventObj.eventY, eventObj.blockSize * eventObj.eventXDim, eventObj.blockSize * eventObj.eventYDim)
          ctx.fillRect(eventObj.eventX, eventObj.eventY, eventObj.blockSize * eventObj.eventXDim, eventObj.blockSize * eventObj.eventYDim)
        }


    }

    animate();

  }, [])



  return (
    <div id='main-container'>
        <div id='instructions'>WASD to move - SHIFT to dash</div>
      <div id='canvas-container'>
        <canvas ref={canvasRef} height={height} width={width} />
      </div>
    </div>
  )
}

export default BasicRender
