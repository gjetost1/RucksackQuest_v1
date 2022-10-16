
import React, { useRef, useEffect } from 'react'

let centerX = 0;
let centerY = 0;

const Background = ({ height, width }) => {

  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // class for rendering a background
    class Background {
      constructor({ position, velocity, image }) {
        this.position = position
        this.image = image
      }
      draw(){
        context.drawImage(this.image, this.position.x, this.position.y, width, height);
      }
    }

    const background_1 = new Image()
    background_1.src = "https://i.imgur.com/rkxlut8.png"

    const introBackgroundLayer = new Background({
      position: {
        x: centerX,
        y: centerY
      },
      image: background_1
    })

    introBackgroundLayer.draw()

  },[])

  return (
    <div id='main-display-div'>
      <div id='canvas-container'>
        <canvas ref={canvasRef} height={height} width={width}/>
      </div>
    </div>
  )
}

export default Background
