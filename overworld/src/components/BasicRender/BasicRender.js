import React, { useContext, useEffect, useRef, useState } from 'react'
import './BasicRender.css'
import moveEngine from './MoveEngine'
import black_square from '../../assets/sprites/black_square.png'
import CanvasContext from '../CanvasContext'

const height = 192 * 2
const width = 256 * 2
const blockSize = 16 // size of each grid block in pixels
let dashDecel = false // triggers special deceleration for dash movement
let dashBoost = 0
let maxVel = 1 // max acceleration (pixel movement) of velocity per frame
let rateAccel = .1 // rate at which movement object accelerates velocity
let rateDecel = .2 // rate at which velocity decays

const maxStam = 100
let currentStam = maxStam


// // move rate for character sprite
// let moveX = 1.2
// let moveY = 1.2

let xVel = 0 // current velocity for x and y movement
let yVel = 0




const outerBoundary = [
  {x: -blockSize, y: -blockSize, xBlocks: width / blockSize + 2, yBlocks: 1, gridSize: blockSize},
  {x: -blockSize, y: -blockSize, xBlocks: 1, yBlocks: height / blockSize + 2, gridSize: blockSize},
  {x: width, y: -blockSize, xBlocks: 1, yBlocks: height / blockSize + 2, gridSize: blockSize},
  {x: -blockSize, y: height, xBlocks: width / blockSize + 2, yBlocks: 1, gridSize: blockSize},
]

const innerBoundary = [
  {x: 164, y: 64, xBlocks: 6, yBlocks: 1, gridSize: blockSize},
  {x: 0, y: 120, xBlocks: 6, yBlocks: 1, gridSize: blockSize},
]



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
      dashDecel = true
      setTimeout(() => {
        dashDecel = false
      }, 100)
    break
    default:
    break
  }
})

const BasicRender = ({}) => {

  const [collision, setCollision] = useState(false)
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
    playerImage.src = black_square

    const playerSprite = new Sprite({
      image: playerImage,
      position: {
        x: coordX,
        y: coordY
      }
    })

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

    // checkCollision takes x and y coords of one thing and a bounds object and returns false if the x,y is inside those bounds
    // gridSize is the grid size in pixels of the object we are checking
    // corner is which corner we are checking - 0 = tl, 1 = tr, 2 = br, 3 = bl

    // const checkCollision = (x, y, bounds, gridSize, corner) => {
    //   const coords = [x, y]
    //   // coordsExp is used to check all the corners of the collision object, based on the upper left corner
    //   const coordsExp = [[1, 1], [gridSize - 1, 1], [gridSize - 1, gridSize - 1], [1, gridSize - 1]] // array of coordinates for all 4 corners of colliding object
    //   // console.log(x, y, bounds)
    //   for (let i = 0; i < bounds.length; i++) {
    //     let {tl, tr, bl, br} = bounds[i] //  coordinates of collision object
    //     if (corner) { // if there is a specified corner just check collision for that
    //         if (
    //           x + coordsExp[corner][0] >= tl[0] &&
    //           y + coordsExp[corner][1] >= tl[1] &&
    //           x + coordsExp[corner][0] <= tr[0] &&
    //           y + coordsExp[corner][1] >= tr[1] &&
    //           x + coordsExp[corner][0] >= bl[0] &&
    //           y + coordsExp[corner][1] <= bl[1] &&
    //           x + coordsExp[corner][0] <= br[0] &&
    //           y + coordsExp[corner][1] <= br[1]
    //           ) {
    //             // console.log('!!!COLLISION!!!')
    //             return false
    //           }
    //     } else { // otherwise check all the corners
    //       for (let j = 0; j < coordsExp.length; j++) {
    //         if (
    //           x + coordsExp[j][0] >= tl[0] &&
    //           y + coordsExp[j][1] >= tl[1] &&
    //           x + coordsExp[j][0] <= tr[0] &&
    //           y + coordsExp[j][1] >= tr[1] &&
    //           x + coordsExp[j][0] >= bl[0] &&
    //           y + coordsExp[j][1] <= bl[1] &&
    //           x + coordsExp[j][0] <= br[0] &&
    //           y + coordsExp[j][1] <= br[1]
    //           ) {
    //             // console.log('!!!COLLISION!!!')
    //             return false
    //           }
    //         }
    //       }
    //     }
    //     return true
    // }



    const cMasks = [
      getDimension(outerBoundary[0]),
      getDimension(outerBoundary[1]),
      getDimension(outerBoundary[2]),
      getDimension(outerBoundary[3]),
      getDimension(innerBoundary[0]),
      getDimension(innerBoundary[1]),
    ]



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
        maxVel: maxVel,
        rateAccel: rateAccel,
        rateDecel: rateDecel,
        dashBoost: dashBoost,
        blockSize: blockSize
      }

      moveObj = moveEngine(moveObj)

      playerSprite.position.x = moveObj.x
      playerSprite.position.y = moveObj.y

      xVel = moveObj.xVel
      yVel = moveObj.yVel

      currentStam = moveObj.currentStam
      rateAccel = moveObj.rateAccel
      rateDecel = moveObj.rateDecel


      window.requestAnimationFrame(animate);
      // ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 0, 0, 1)'
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < innerBoundary.length; i++) {
        let {x, y, xBlocks, yBlocks, gridSize} = innerBoundary[i]
        // ctx.fillStyle = 'rgba(255, 1, 1, 0)'
        ctx.clearRect(x, y, xBlocks * gridSize, yBlocks * gridSize)
      }

      playerSprite.draw()



    }

    animate();

  }, [])

  // useEffect(() => {
  //   if (keys.Shift.pressed && currentStam > 0) {
  //     // console.log('shift')
  //     maxVel = 2
  //     dashBoost = .2
  //     setCurrentStam((prev) => prev - .2)
  //   } else {
  //     maxVel = 1
  //     dashBoost = 0
  //     if (currentStam < maxStam) {
  //       setCurrentStam((prev) => prev + .2)
  //     }
  //     // console.log('deshift')
  //   }
  // },[])




  return (
    <div id='main-container'>
      <div id='canvas-container'>
        <div id='stamina-container'>
          <div id='stamina-bar'>
            <div id='stamina-level' style={{
              width: `${currentStam}%`
        }}></div>
          </div>
        </div>
        <canvas ref={canvasRef} height={height} width={width} />
      </div>
    </div>
  )
}

export default BasicRender
