import React, { useContext, useEffect, useRef } from 'react'
import './BasicRender.css'
import CanvasContext from '../CanvasContext'

const height = 180
const width = 320

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
    const rectSize = 16
    const coordX = (width / 2) - (rectSize / 2)
    const coordY = (height / 2) - (rectSize / 2)
    ctx.fillRect(coordX, coordY, 16, 16)
  },[])

  return (
    <div id='canvas-container'>
      <canvas ref={canvasRef} height={height} width={width} />
    </div>
  )
}

export default BasicRender
