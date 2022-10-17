import React, { useContext, useEffect, useRef } from 'react'
import './BasicRender.css'
import black_square from '../../assets/sprites/black_square.png'
import CanvasContext from '../CanvasContext'

const height = 180
const width = 320

// move rate for character sprite
let moveX = 1.2
let moveY = 1.2

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
  }
}

let lastKeyDown = '';
document.addEventListener('keydown', function(playerWalk) {
  switch (playerWalk.key) {
    case 'ArrowUp':
      keys.ArrowUp.pressed = true
      lastKeyDown = 'ArrowUp'
      console.log('Walk Up')
    break;
    case 'ArrowDown':
      keys.ArrowDown.pressed = true
      lastKeyDown = 'ArrowDown'
      console.log('Walk Down')
    break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      lastKeyDown = 'ArrowLeft'
      console.log('Walk Left')
    break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      lastKeyDown = 'ArrowRight'
      console.log('Walk Right')
    break;
      default:
      break;
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

const BasicRender = ({  }) => {

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

    const checkBounds = (x, y) => {
      if (x <= 0 && y <= 0) {
        return {x: 0, y: 0}
      }
      if (x <= 0 && y >= height - rectHeight) {
        return {x: 0, y: 0}
      }
      if (x >= width - rectWidth && y <= 0) {
        return {x: 0, y: 0}
      }
      if (x >= width && y >= height - rectHeight) {
        return {x: 0, y: 0}
      }
      if (x >= width - rectWidth) {
        return {x: 0, y: 1.2}
      }
      if (x <= 0) {
        return {x: 0, y: 1.2}
      }
      if (y >= height - rectHeight) {
        return {x: 1.2, y: 0}
      }
      if (y <= 0) {
        return {x: 1.2, y: 0}
      }
      else {
        return {x: 1.2, y: 1.2}
      }
    }

    // ctx.fillRect(coordX, coordY, 16, 16)

    const animate = () => {
      window.requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 0, 0, 1)'
      ctx.fillRect(0, 0, width, height)

      playerSprite.draw()
      moveX = 1.2
      moveY = 1.2
      if (keys.ArrowDown.pressed && keys.ArrowRight.pressed) {
        const {x, y} = checkBounds(playerSprite.position.x + 1, playerSprite.position.y + 1)
        moveX = x
        moveY = y
        playerSprite.position.y = playerSprite.position.y + moveY;  // Move Down
        playerSprite.position.x = playerSprite.position.x + moveX;  // Move Right
      }
      else if (keys.ArrowUp.pressed && keys.ArrowRight.pressed) {
        const {x, y} = checkBounds(playerSprite.position.x - 1, playerSprite.position.y + 1)
        moveX = x
        moveY = y
        playerSprite.position.y = playerSprite.position.y - moveY;  // Move Up
        playerSprite.position.x = playerSprite.position.x + moveX;  // Move Right
      }
      else if (keys.ArrowDown.pressed && keys.ArrowLeft.pressed ) {
        const {x, y} = checkBounds(playerSprite.position.x - 1, playerSprite.position.y - 1)
        moveX = x
        moveY = y
        playerSprite.position.y = playerSprite.position.y + moveY;  // Move Down
        playerSprite.position.x = playerSprite.position.x - moveX;  // Move Left
      }
      else if (keys.ArrowUp.pressed && keys.ArrowLeft.pressed ) {
        const {x, y} = checkBounds(playerSprite.position.x - 1, playerSprite.position.y - 1)
        moveX = x
        moveY = y
        playerSprite.position.y = playerSprite.position.y - moveY;  // Move Up
        playerSprite.position.x = playerSprite.position.x - moveX;  // Move Left
      }
      else if (keys.ArrowDown.pressed) {
        const {x, y} = checkBounds(width / 2, playerSprite.position.y + 1)
        moveX = x
        moveY = y
        playerSprite.position.y = playerSprite.position.y + moveY;  // Move Down
      }
      else if (keys.ArrowUp.pressed) {
        const {x, y} = checkBounds(width / 2, playerSprite.position.y - 1)
        moveX = x
        moveY = y
        playerSprite.position.y = playerSprite.position.y - moveY;  // Move Up
      }
      else if (keys.ArrowRight.pressed) {
        const {x, y} = checkBounds(playerSprite.position.x + 1, height / 2)
        moveX = x
        moveY = y
        playerSprite.position.x = playerSprite.position.x + moveX;  // Move Right
      }
      else if (keys.ArrowLeft.pressed) {
        const {x, y} = checkBounds(playerSprite.position.x - 1, height / 2)
        moveX = x
        moveY = y
        playerSprite.position.x = playerSprite.position.x - moveX;  // Move Left
      }

    }
    animate();
  }, [])

  return (
    <div id='main-container'>
      <div id='canvas-container'>
        <canvas ref={canvasRef} height={height} width={width} />
      </div>
    </div>
  )
}

export default BasicRender
