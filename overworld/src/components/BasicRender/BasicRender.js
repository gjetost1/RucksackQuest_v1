import React, { useContext, useEffect, useRef, useState } from 'react'
import './BasicRender.css'
import black_square from '../../assets/sprites/black_square.png'
import CanvasContext from '../CanvasContext'

const height = 192 * 2
const width = 256 * 2
const blockSize = 16

// move rate for character sprite
let moveX = 1.2
let moveY = 1.2

let xVel = 0
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
document.addEventListener('keydown', function(playerWalk) {
  switch (playerWalk.key) {
    case 'ArrowUp':
      keys.ArrowUp.pressed = true
      lastKeyDown = 'ArrowUp'
      // console.log('Walk Up')
    break;
    case 'ArrowDown':
      keys.ArrowDown.pressed = true
      lastKeyDown = 'ArrowDown'
      // console.log('Walk Down')
    break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      lastKeyDown = 'ArrowLeft'
      // console.log('Walk Left')
    break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      lastKeyDown = 'ArrowRight'
      // console.log('Walk Right')
    break;
      default:
      break;
  }
})


document.addEventListener('keyup', function(playerWalk) {
  switch (playerWalk.key) {
    case 'ArrowUp':
      keys.ArrowUp.pressed = false
      // console.log('Walk Up')
    break;
    case 'ArrowDown':
      keys.ArrowDown.pressed = false
      // console.log('Walk Down')
    break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        // console.log('Walk Left')
      break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = false
        // console.log('Walk Right')
      break;
      default:
      break;
  }
});

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

  const [collision, setCollision] = useState(false)

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
      const coordsExp = [[0, 0], [gridSize, 0], [gridSize, gridSize], [0, gridSize]] // array of coordinates for all 4 corners of colliding object
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
      if (keys.Shift.pressed) {
        // console.log('################')
        maxAccel = 2
        rateAccel = .4
      } else {
        maxAccel = 1
        rateAccel = .1
      }


      if (keys.ArrowDown.pressed && keys.ArrowRight.pressed) {
        // playerSprite.position.y = playerSprite.position.y + moveY;  // Move Down
        // playerSprite.position.x = playerSprite.position.x + moveX;  // Move Right
        if (yVel <= maxAccel) {
          yVel = yVel + rateAccel
        }
        if (xVel <= maxAccel) {
          xVel = xVel + rateAccel
        }
      }
      else if (keys.ArrowUp.pressed && keys.ArrowRight.pressed) {
        // playerSprite.position.y = playerSprite.position.y - moveY;  // Move Up
        // playerSprite.position.x = playerSprite.position.x + moveX;  // Move Right
        if (yVel >= -maxAccel) {
          yVel = yVel - rateAccel
        }
        if (xVel <= maxAccel) {
          xVel = xVel + rateAccel
        }
      }
      else if (keys.ArrowDown.pressed && keys.ArrowLeft.pressed) {
        // playerSprite.position.y = playerSprite.position.y + moveY;  // Move Down
        // playerSprite.position.x = playerSprite.position.x - moveX;  // Move Left
        if (yVel <= maxAccel) {
          yVel = yVel + rateAccel
        }
        if (xVel >= -maxAccel) {
          xVel = xVel - rateAccel
        }
      }
      else if (keys.ArrowUp.pressed && keys.ArrowLeft.pressed) {
        // playerSprite.position.y = playerSprite.position.y - moveY;  // Move Up
        // playerSprite.position.x = playerSprite.position.x - moveX;  // Move Left
        if (yVel >= -maxAccel) {
          yVel = yVel - rateAccel
        }
        if (xVel >= -maxAccel) {
          xVel = xVel - rateAccel
        }
      }
      else if (keys.ArrowDown.pressed) {
        // playerSprite.position.y = playerSprite.position.y + moveY;  // Move Down
        if (yVel <= maxAccel) {
          yVel = yVel + rateAccel
        }
      }
      else if (keys.ArrowUp.pressed) {
        // playerSprite.position.y = playerSprite.position.y - moveY;  // Move Up
        if (yVel >= -maxAccel) {
          yVel = yVel - rateAccel
        }
      }
      else if (keys.ArrowRight.pressed) {
        // playerSprite.position.x = playerSprite.position.x + moveX;  // Move Right
        if (xVel <= maxAccel) {
          xVel = xVel + rateAccel
        }
      }
      else if (keys.ArrowLeft.pressed) {
        // playerSprite.position.x = playerSprite.position.x - moveX;  // Move Left
        if (xVel >= -maxAccel) {
          xVel = xVel - rateAccel
        }
      } else {

        // reduces velocity back to zero for x and y every frame that input is not given
        const velReduce = .08 // rate at which velocity decays
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
  }, [width, height])


  return (
    <div id='main-container'>
      <div id='canvas-container'>
        <canvas ref={canvasRef} height={height} width={width} />
      </div>
    </div>
  )
}

export default BasicRender
