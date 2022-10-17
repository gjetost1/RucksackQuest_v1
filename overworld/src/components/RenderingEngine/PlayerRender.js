
import React, { useRef, useEffect } from 'react'
import playerSprite from '../../assets/sprites/main_character/down_0.png'
import './RenderingEngine.css'

let centerX = 0
let centerY = 0

const PlayerRender = ({ canvas, height, width }) => {

  // const canvasRef = useRef(null)

  useEffect(() => {

    const context = canvas.current.getContext('2d')

    // class for rendering the player sprite
    class PlayerSprite {
      constructor({ position, velocity, image }) {
        this.position = position
        this.image = image
      }
      draw(){
        context.drawImage(this.image, this.position.x, this.position.y, width, height);
      }
    }

    const player_1 = new Image()
    player_1.src = playerSprite
    // player_1.src = "https://i.imgur.com/rkxlut8.png"

    const playerLayer = new PlayerSprite({
      position: {
        x: centerX,
        y: centerY
      },
      image: player_1
    })

    playerLayer.draw()

  },[])

  return (
    <canvas id='player-canvas' ref={canvas} height={height} width={width}/>
  )
}

export default PlayerRender
