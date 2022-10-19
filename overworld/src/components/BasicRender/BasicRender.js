import React, { useContext, useEffect, useRef, useState } from 'react'
import './BasicRender.css'
import moveEngine from './MoveEngine'
import black_square from '../../assets/sprites/black_square.png'
import CanvasContext from '../CanvasContext'

import droneSprt from './droneRef'


const height = 192 * 2
const width = 256 * 2
const blockSize = 16  // size of each grid block in pixels
const topDashBoost = .2
let dashBoost = 0
const boostMaxVel = 2 // maxVel when boosting
const baseMaxVel = 1 // base maxVel that maxVel will return to when not boosting
let maxVel = baseMaxVel // max acceleration (pixel movement) of velocity per frame
let rateAccel = .2 // rate at which movement object accelerates velocity
let rateDecel = .1 // rate at which velocity decays
let heroSprite = droneSprt.down

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
  }
}


let lastKeyDown = ''; // use to determine which sprite to display once movement animation is over (once sprite anims are implemented)
// event listener for directional movement input
document.addEventListener('keydown', function(playerWalk) {
  switch (playerWalk.key) {
    case 'w':
    case 'W':
      keys.ArrowUp.pressed = true
      lastKeyDown = 'ArrowUp'
      // console.log('Walk Up')
    break;
    case 's':
    case 'S':
      keys.ArrowDown.pressed = true
      lastKeyDown = 'ArrowDown'
      // console.log('Walk Down')
    break;
    case 'a':
    case 'A':
      keys.ArrowLeft.pressed = true
      lastKeyDown = 'ArrowLeft'
      // console.log('Walk Left')
    break;
    case 'd':
    case 'D':
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
      keys.ArrowUp.pressed = false
      // console.log('Walk Up')
    break;
    case 's':
    case 'S':
      keys.ArrowDown.pressed = false
      // console.log('Walk Down')
    break;
      case 'a':
      case 'A':
        keys.ArrowLeft.pressed = false
        // console.log('Walk Left')
      break;
      case 'd':
      case 'D':
        keys.ArrowRight.pressed = false
        // console.log('Walk Right')
      break;
      default:
      break;
  }
});

// event listener for actions other than directional movement
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
      // setTimeout(() => keys.Shift.pressed = false, 30)
      // console.log('dash')
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
    default:
    break
  }
})

const BasicRender = ({}) => {

  // const [currentStam, setCurrentStam] = useState(maxStam)

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

      let moveObj = { // object passed to MoveEngine to get next frame movement
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
        heroSprite: heroSprite
      }

      // is true if any directional input is given, otherwise false
      let keysPressed = (keys.ArrowUp.pressed || keys.ArrowDown.pressed || keys.ArrowLeft.pressed || keys.ArrowRight.pressed)

      // moveEngine runs only if there is a directional input or if there is any x or y velocity
      if (keysPressed || xVel !== 0 || yVel !== 0) {
        moveObj = moveEngine(moveObj)
      }

      playerSprite.position.x = moveObj.x
      playerSprite.position.y = moveObj.y

      heroSprite = moveObj.heroSprite
      playerImage.src = heroSprite

      xVel = moveObj.xVel
      yVel = moveObj.yVel

      currentStam = moveObj.currentStam

      // regenerates stamina - can't do this in moveEngine because that only runs when there is input or velocity
      if (currentStam < maxStam) {
        currentStam = currentStam + .06
      } else {
        currentStam = maxStam
      }


      rateAccel = moveObj.rateAccel
      rateDecel = moveObj.rateDecel


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
      ctx.fillRect(14, 4, currentStam, 7)


      // this draws all interior objects that have collision
      for (let i = 0; i < innerBoundary.length; i++) {
        ctx.fillStyle = 'rgb(177, 15, 15)'
        let {x, y, xBlocks, yBlocks, gridSize} = innerBoundary[i]
        ctx.fillRect(x, y, xBlocks * gridSize, yBlocks * gridSize)
      }

      // draws hero sprite image to canvas
      playerSprite.draw()

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
