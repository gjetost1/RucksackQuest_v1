
import React, { useRef, useEffect } from 'react'
import playerSprite from '../../assets/sprites/main_character/down_0.png'
import './RenderingEngine.css'
import { main_down, main_up, main_left, main_right } from './spriteRef.js'
import InputHandler from '../InputHandler'


let centerX = 0
let centerY = 0
let spriteSize = 1
let spriteMiddle = 2

const PlayerRender = ({ canvas, height, width }) => {
  InputHandler()
  // const canvasRef = useRef(null)

  useEffect(() => {

    const context = canvas.current.getContext('2d')

    const {keys, lastKeyDown} = InputHandler()
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

    const playerImage = new Image()
    playerImage.src = playerSprite

    const playerLayer = new PlayerSprite({
      position: {
        x: centerX,
        y: centerY
      },
      image: playerImage
    })

    function animate() {

      // add any sprites or sprite arrays that you want pre-loaded on the page. This prevents flickering of animations while it is loading them
        for (let element of main_down) {
          const img = new Image()
            img.src = element
        }
        for (let element of main_up) {
          const img = new Image()
            img.src = element
        }
        for (let element of main_left) {
          const img = new Image()
            img.src = element
        }
        for (let element of main_right) {
          const img = new Image()
            img.src = element
        }




        // playerLayer.draw() // Draw Game Scene Layer
        window.requestAnimationFrame(animate);
            // const playerImage = new Image()
          // playerImage.src = spriteSrc;
          context.drawImage(playerImage,
        // START CROPPING SPRITE HERE
        centerX,
        centerY,
        playerImage.width / spriteSize,
        playerImage.height,
        // ACTUAL SPRITE SIZE
        width / spriteMiddle - (playerImage.width / spriteSize) / spriteMiddle,
        height / spriteMiddle - playerImage.height / spriteMiddle,
        playerImage.width / spriteSize,
        playerImage.height,
        // END CROPPING SPRITE HERE
        );
    }
    animate();
    // playerLayer.draw()

  },[])

  return (
    <canvas id='player-canvas' ref={canvas} height={height} width={width}/>
  )
}

export default PlayerRender
