import React, { useRef, useEffect } from 'react'
import './RenderingEngine.css'

let centerX = 0;
let centerY = 0;

const Background = ({ canvas, height, width }) => {

  // const canvasRef = useRef(null)

  useEffect(() => {

    const context = canvas.current.getContext('2d')

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
    <canvas id='background-canvas' ref={canvas} height={height} width={width}/>
  )
}

export default Background
