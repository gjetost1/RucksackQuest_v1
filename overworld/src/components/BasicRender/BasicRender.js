import React, { useContext, useEffect, useRef, useState } from 'react'
import './BasicRender.css'
import black_square from '../../assets/sprites/black_square.png'
import CanvasContext from '../CanvasContext'

const height = 192
const width = 256
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
  }
}

let lastKeyDown = '';
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

document.addEventListener('keydown', (jump) => {
  console.log(jump)
  switch(jump.key) {
    case ' ':
      keys.Space.pressed = true
      setTimeout(() => keys.Space.pressed = false, 30)
      console.log('jump')
    break
    default:
    break
  }
})

document.addEventListener('keyup', function(playerWalk) {
  switch (playerWalk.key) {
    case 'ArrowUp':
      keys.ArrowUp.pressed = false
      console.log('Walk Up')
    break;
    case 'ArrowDown':
      keys.ArrowDown.pressed = false
      console.log('Walk Down')
    break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        console.log('Walk Left')
      break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = false
        console.log('Walk Right')
      break;
      default:
      break;
  }
});

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
      const coordsExp = [[0, 0], [gridSize, 0], [gridSize, gridSize], [0, gridSize]]
      // console.log(x, y, bounds)
      for (let i = 0; i < bounds.length; i++) {
        let {tl, tr, bl, br} = bounds[i]
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


      if (!checkCollision(playerSprite.position.x + 1, playerSprite.position.y, border, blockSize)) {
        xVel = -.2
        // yVel = -.2
      } else if (!checkCollision(playerSprite.position.x - 1, playerSprite.position.y, border, blockSize)) {
        xVel = .2
        // yVel = -.2
      } else if (!checkCollision(playerSprite.position.x, playerSprite.position.y + 1, border, blockSize)) {
        // xVel = .2
        yVel = -.2
      } else if (!checkCollision(playerSprite.position.x, playerSprite.position.y - 1, border, blockSize)) {
        // xVel = .2
        yVel = .2
      } else if (!checkCollision(playerSprite.position.x - 1, playerSprite.position.y - 1, border, blockSize)) {
        xVel = .2
        yVel = .2
      } else if (!checkCollision(playerSprite.position.x + 1, playerSprite.position.y + 1, border, blockSize)) {
        xVel = -.2
        yVel = -.2
      } else if (!checkCollision(playerSprite.position.x + 1, playerSprite.position.y - 1, border, blockSize)) {
        xVel = -.2
        yVel = .2
      } else if (!checkCollision(playerSprite.position.x - 1, playerSprite.position.y + 1, border, blockSize)) {
        xVel = .2
        yVel = -.2
      }


        playerSprite.position.x = playerSprite.position.x + xVel;  // Move Right
        playerSprite.position.y = playerSprite.position.y + yVel;  // Move Down


      // if (checkCollision(playerSprite.position.x, playerSprite.position.y, border, blockSize)) {
      //   playerSprite.position.x = playerSprite.position.x + xVel;  // Move Right
      //   playerSprite.position.y = playerSprite.position.y + yVel;  // Move Down
      // } else {
      //   xVel = 0
      //   yVel = 0
      // }



      if (keys.Space.pressed) {
        playerSprite.position.y = playerSprite.position.y - 20;
        // console.log('jump!!!!!')
      }
      if (keys.ArrowDown.pressed && keys.ArrowRight.pressed && checkCollision(playerSprite.position.x + 1, playerSprite.position.y + 1, border, blockSize)) {
        // playerSprite.position.y = playerSprite.position.y + moveY;  // Move Down
        // playerSprite.position.x = playerSprite.position.x + moveX;  // Move Right
        yVel = yVel + .2
        if (yVel > 2) {
          yVel = 2
        }
        xVel = xVel + .2
        if (xVel > 2) {
          xVel = 2
        }
      }
      else if (keys.ArrowUp.pressed && keys.ArrowRight.pressed && checkCollision(playerSprite.position.x + 1, playerSprite.position.y - 1, border, blockSize)) {
        // playerSprite.position.y = playerSprite.position.y - moveY;  // Move Up
        // playerSprite.position.x = playerSprite.position.x + moveX;  // Move Right
        yVel = yVel - .2
        if (yVel < -2) {
          yVel = -2
        }
        xVel = xVel + .2
        if (xVel > 2) {
          xVel = 2
        }
      }
      else if (keys.ArrowDown.pressed && keys.ArrowLeft.pressed && checkCollision(playerSprite.position.x - 1.2, playerSprite.position.y + 1, border, blockSize)) {
        // playerSprite.position.y = playerSprite.position.y + moveY;  // Move Down
        // playerSprite.position.x = playerSprite.position.x - moveX;  // Move Left
        yVel = yVel + .2
        if (yVel > 2) {
          yVel = 2
        }
        xVel = xVel - .2
        if (xVel < -2) {
          xVel = -2
        }
      }
      else if (keys.ArrowUp.pressed && keys.ArrowLeft.pressed && checkCollision(playerSprite.position.x - 1.2, playerSprite.position.y - 1, border, blockSize)) {
        // playerSprite.position.y = playerSprite.position.y - moveY;  // Move Up
        // playerSprite.position.x = playerSprite.position.x - moveX;  // Move Left
        yVel = yVel - .2
        if (yVel < -2) {
          yVel = -2
        }
        xVel = xVel - .2
        if (xVel < -2) {
          xVel = -2
        }
      }
      else if (keys.ArrowDown.pressed && checkCollision(playerSprite.position.x, playerSprite.position.y + 1, border, blockSize)) {
        // playerSprite.position.y = playerSprite.position.y + moveY;  // Move Down
        yVel = yVel + .2
        if (yVel > 2) {
          yVel = 2
        }
      }
      else if (keys.ArrowUp.pressed && checkCollision(playerSprite.position.x, playerSprite.position.y - 1, border, blockSize)) {
        // playerSprite.position.y = playerSprite.position.y - moveY;  // Move Up
        yVel = yVel - .2
        if (yVel < -2) {
          yVel = -2
        }
      }
      else if (keys.ArrowRight.pressed && checkCollision(playerSprite.position.x + 5, playerSprite.position.y, border, blockSize)) {
        // playerSprite.position.x = playerSprite.position.x + moveX;  // Move Right
        xVel = xVel + .2
        if (xVel > 2) {
          xVel = 2
        }
      }
      else if (keys.ArrowLeft.pressed && checkCollision(playerSprite.position.x - 5, playerSprite.position.y, border, blockSize)) {
        // playerSprite.position.x = playerSprite.position.x - moveX;  // Move Left
        xVel = xVel - .2
        if (xVel < -2) {
          xVel = -2
        }
      } else {
        // reduces velocity back to zero for x and y every frame
        const velReduce = .1
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
