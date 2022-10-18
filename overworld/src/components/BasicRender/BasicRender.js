import React, { useContext, useEffect, useRef, useState } from 'react'
import './BasicRender.css'
import MoveEngine from './MoveEngine'
import black_square from '../../assets/sprites/black_square.png'
import CanvasContext from '../CanvasContext'

const height = 192 * 2
const width = 256 * 2
const blockSize = 16 // size of each grid block in pixels
let dashDecel = false // triggers special deceleration for dash movement
let dashBoost = 0
let maxAccel = 1

const maxStam = 100


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
  const [currentStam, setCurrentStam] = useState(maxStam)

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

    const checkCollision = (x, y, bounds, gridSize, corner) => {
      const coords = [x, y]
      // coordsExp is used to check all the corners of the collision object, based on the upper left corner
      const coordsExp = [[1, 1], [gridSize - 1, 1], [gridSize - 1, gridSize - 1], [1, gridSize - 1]] // array of coordinates for all 4 corners of colliding object
      // console.log(x, y, bounds)
      for (let i = 0; i < bounds.length; i++) {
        let {tl, tr, bl, br} = bounds[i] //  coordinates of collision object
        if (corner) { // if there is a specified corner just check collision for that
            if (
              x + coordsExp[corner][0] >= tl[0] &&
              y + coordsExp[corner][1] >= tl[1] &&
              x + coordsExp[corner][0] <= tr[0] &&
              y + coordsExp[corner][1] >= tr[1] &&
              x + coordsExp[corner][0] >= bl[0] &&
              y + coordsExp[corner][1] <= bl[1] &&
              x + coordsExp[corner][0] <= br[0] &&
              y + coordsExp[corner][1] <= br[1]
              ) {
                // console.log('!!!COLLISION!!!')
                return false
              }
        } else { // otherwise check all the corners
          for (let j = 0; j < coordsExp.length; j++) {
            if (
              x + coordsExp[j][0] >= tl[0] &&
              y + coordsExp[j][1] >= tl[1] &&
              x + coordsExp[j][0] <= tr[0] &&
              y + coordsExp[j][1] >= tr[1] &&
              x + coordsExp[j][0] >= bl[0] &&
              y + coordsExp[j][1] <= bl[1] &&
              x + coordsExp[j][0] <= br[0] &&
              y + coordsExp[j][1] <= br[1]
              ) {
                // console.log('!!!COLLISION!!!')
                return false
              }
            }
          }
        }
        return true
    }



    const border = [
      getDimension(outerBoundary[0]),
      getDimension(outerBoundary[1]),
      getDimension(outerBoundary[2]),
      getDimension(outerBoundary[3]),
      getDimension(innerBoundary[0]),
      getDimension(innerBoundary[1]),
    ]

    const animate = () => {
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
      // moveX = 1.2
      // moveY = 1.2


      // const checkBorder = (border) => {
      //   for (let i = 0; i < border.length; i++) {
      //     if (checkCollision(playerSprite.position.x, playerSprite.position.y, border[i])) {
      //       return false
      //     }
      //     return true
      //   }
      // }

      // console.log(playerSprite.position.x, playerSprite.position.y, border)

      // this if chain reverses the velocity of the object on collision and makes sure it doesn't clip into a collision mask
      if (!checkCollision(playerSprite.position.x + 1, playerSprite.position.y - 1, border, blockSize, 1) && !checkCollision(playerSprite.position.x + 1, playerSprite.position.y + 1, border, blockSize, 2)) {
        playerSprite.position.x -= .5
        xVel = -xVel
        // yVel = -.2
        // console.log('1 & 2')
      } else if (!checkCollision(playerSprite.position.x - 1, playerSprite.position.y - 1, border, blockSize, 0) && !checkCollision(playerSprite.position.x - 1, playerSprite.position.y + 1, border, blockSize, 3)) {
        playerSprite.position.x += .5
        xVel = -xVel
        // yVel = -.2
        // console.log('0 & 3')
      } else if (!checkCollision(playerSprite.position.x + 1, playerSprite.position.y + 1, border, blockSize, 2) && !checkCollision(playerSprite.position.x - 1, playerSprite.position.y + 1, border, blockSize, 3)) {
        playerSprite.position.y -= .5
        // xVel = .2
        yVel = -yVel
        // console.log('2 & 3')
      } else if (!checkCollision(playerSprite.position.x - 1, playerSprite.position.y - 1, border, blockSize, 0) && !checkCollision(playerSprite.position.x + 1, playerSprite.position.y - 1, border, blockSize, 1)) {
        playerSprite.position.y += .5
        // xVel = .2
        yVel = -yVel
        // console.log('0 & 1')
      } else if (!checkCollision(playerSprite.position.x - 1, playerSprite.position.y - 1, border, blockSize, 0)) {
        // playerSprite.position.x += .5
        // playerSprite.position.y += .5
        xVel = -xVel
        yVel = yVel
        // console.log('0')
      } else if (!checkCollision(playerSprite.position.x + 1, playerSprite.position.y + 1, border, blockSize, 2)) {
        // playerSprite.position.x -= .5
        // playerSprite.position.y -= .5
        xVel = -xVel
        yVel = yVel
        // console.log('2')
      } else if (!checkCollision(playerSprite.position.x + 1, playerSprite.position.y - 1, border, blockSize, 1)) {
        // playerSprite.position.x -= .5
        // playerSprite.position.y += .5
        xVel = -xVel
        yVel = yVel
        // console.log('1')
      } else if (!checkCollision(playerSprite.position.x - 1, playerSprite.position.y + 1, border, blockSize, 3)) {
        // playerSprite.position.x += .5
        // playerSprite.position.y -= .5
        xVel = xVel
        yVel = -yVel
        // console.log('3')
      }

      // moves the movement object every frame based on curent velocity
      const movePlayer = () => {
        playerSprite.position.x = playerSprite.position.x + xVel;  // Move Right
        playerSprite.position.y = playerSprite.position.y + yVel;  // Move Down
      }
      // only runs movement function if any velocity is not zero
      if (xVel != 0 || yVel != 0) {
        movePlayer()
      }

      // if (checkCollision(playerSprite.position.x, playerSprite.position.y, border, blockSize)) {
      //   playerSprite.position.x = playerSprite.position.x + xVel;  // Move Right
      //   playerSprite.position.y = playerSprite.position.y + yVel;  // Move Down
      // } else {
      //   xVel = 0
      //   yVel = 0
      // }



      // if (keys.Space.pressed) {
      //   playerSprite.position.y = playerSprite.position.y - 20;
      //   // console.log('jump!!!!!')
      // }

      let maxAccel = 1 // max acceleration (pixel movement) of velocity per frame
      let rateAccel = .1 // rate at which movement object accelerates velocity
      let velReduce = .2 // rate at which velocity decays

      if (keys.Shift.pressed && currentStam > 0) {
        // console.log('shift')
        maxAccel = 2
        dashBoost = .2
        setCurrentStam((prev) => prev - .2)
      } else {
        maxAccel = 1
        dashBoost = 0
        if (currentStam < maxStam) {
          setCurrentStam((prev) => prev + .2)
        }
        // console.log('deshift')
      }
      // console.log(currentStam)

      // console.log(xVel, yVel)


      if (keys.ArrowDown.pressed && keys.ArrowRight.pressed) {
        // playerSprite.position.y = playerSprite.position.y + moveY;  // Move Down
        // playerSprite.position.x = playerSprite.position.x + moveX;  // Move Right
        if (yVel <= maxAccel) {
          yVel = yVel + rateAccel + dashBoost
        }
        if (xVel <= maxAccel) {
          xVel = xVel + rateAccel + dashBoost
        }
      }
      else if (keys.ArrowUp.pressed && keys.ArrowRight.pressed) {
        // playerSprite.position.y = playerSprite.position.y - moveY;  // Move Up
        // playerSprite.position.x = playerSprite.position.x + moveX;  // Move Right
        if (yVel >= -maxAccel) {
          yVel = yVel - rateAccel - dashBoost
        }
        if (xVel <= maxAccel) {
          xVel = xVel + rateAccel + dashBoost
        }
      }
      else if (keys.ArrowDown.pressed && keys.ArrowLeft.pressed) {
        // playerSprite.position.y = playerSprite.position.y + moveY;  // Move Down
        // playerSprite.position.x = playerSprite.position.x - moveX;  // Move Left
        if (yVel <= maxAccel) {
          yVel = yVel + rateAccel + dashBoost
        }
        if (xVel >= -maxAccel) {
          xVel = xVel - rateAccel - dashBoost
        }
      }
      else if (keys.ArrowUp.pressed && keys.ArrowLeft.pressed) {
        // playerSprite.position.y = playerSprite.position.y - moveY;  // Move Up
        // playerSprite.position.x = playerSprite.position.x - moveX;  // Move Left
        if (yVel >= -maxAccel) {
          yVel = yVel - rateAccel - dashBoost
        }
        if (xVel >= -maxAccel) {
          xVel = xVel - rateAccel - dashBoost
        }
      }
      else if (keys.ArrowDown.pressed) {
        // playerSprite.position.y = playerSprite.position.y + moveY;  // Move Down
        if (yVel <= maxAccel) {
          yVel = yVel + rateAccel + dashBoost
        }
        xVel = 0
      }
      else if (keys.ArrowUp.pressed) {
        // playerSprite.position.y = playerSprite.position.y - moveY;  // Move Up
        if (yVel >= -maxAccel) {
          yVel = yVel - rateAccel - dashBoost
        }
        xVel = 0
      }
      else if (keys.ArrowRight.pressed) {
        // playerSprite.position.x = playerSprite.position.x + moveX;  // Move Right
        if (xVel <= maxAccel) {
          xVel = xVel + rateAccel + dashBoost
        }
        yVel = 0
      }
      else if (keys.ArrowLeft.pressed) {
        // playerSprite.position.x = playerSprite.position.x - moveX;  // Move Left
        if (xVel >= -maxAccel) {
          xVel = xVel - rateAccel - dashBoost
        }
        yVel = 0
      }
      else {
        // reduces velocity back to zero for x and y every frame that input is not given
        if (xVel < 0) {
          xVel = xVel + velReduce
        }
        if (xVel < 0 && xVel >= -velReduce) {
          xVel = 0
        }
        if (xVel > 0) {
          xVel = xVel - velReduce
        }
        if (xVel > 0 && xVel <= velReduce) {
          xVel = 0
        }
        if (yVel < 0) {
          yVel = yVel + velReduce
        }
        if (yVel < 0 && yVel >= -velReduce) {
          yVel = 0
        }
        if (yVel > 0) {
          yVel = yVel - velReduce
        }
        if (yVel > 0 && yVel <= velReduce) {
          yVel = 0
        }
      }

      if (dashDecel) {
        let velReduce = .15 // rate at which velocity decays
        if (xVel < 0) {
          xVel = xVel + velReduce
        }
        if (xVel < 0 && xVel >= -velReduce) {
          xVel = 0
        }
        if (xVel > 0) {
          xVel = xVel - velReduce
        }
        if (xVel > 0 && xVel <= velReduce) {
          xVel = 0
        }
        if (yVel < 0) {
          yVel = yVel + velReduce
        }
        if (yVel < 0 && yVel >= -velReduce) {
          yVel = 0
        }
        if (yVel > 0) {
          yVel = yVel - velReduce
        }
        if (yVel > 0 && yVel <= velReduce) {
          yVel = 0
        }
      }


    }


    // const gravityInterval = setInterval(() => {
    //   if (checkCollision(playerSprite.position.x, playerSprite.position.y + 1, border, blockSize)) {
    //     playerSprite.position.y = playerSprite.position.y + 1
    //   }
    // }, 40)


    animate();
  }, [])

  // useEffect(() => {
  //   if (keys.Shift.pressed && currentStam > 0) {
  //     // console.log('shift')
  //     maxAccel = 2
  //     dashBoost = .2
  //     setCurrentStam((prev) => prev - .2)
  //   } else {
  //     maxAccel = 1
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
