
import React, { useRef, useEffect } from 'react'
import playerSprite from '../../assets/sprites/main_character/down_0.png'

let centerX = 0;
let centerY = 0;

const PlayerRender = ({ height, width }) => {

  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

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

    const playerLayer = new PlayerSprite({
      position: {
        x: centerX,
        y: centerY
      },
      image: background_1
    })

    playerLayer.draw()

  },[])

  return (
    <div id='main-display-div'>
      <div id='canvas-container'>
        <canvas ref={canvasRef} height={height} width={width}/>
      </div>
    </div>
  )
}

export default PlayerRender
