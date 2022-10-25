import './SpriteAnimator.css'
import React, { useEffect } from 'react'
import globalvars from '../../globalvars'


import InputHandler from '../InputHandler'

import { main_down, main_up, main_left, main_right } from './spriteRef.js'

let spriteSize = 1
let spriteMiddle = 2

let spriteIndex = 0
const animateDelay = 10 // one animation per this number of frames
let animateCounter = 0 // this counts up to animateDelay
let spriteSrc = main_down[0]



const SpriteAnimator = ({ canvas, gameSceneLayer, centerX, centerY }) => {

  const height = globalvars.scene_height
  const width = globalvars.scene_width

  // const canvas = React.useRef()

  useEffect(() => {
    const ctx = canvas.current.getContext('2d')

      // this function handles all inputs from the keyboard
      const {keys, lastKeyDown} = InputHandler()

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

        const animate = () => {

        window.requestAnimationFrame(animate);
          const playerImage = new Image()
          playerImage.src = spriteSrc;


        ctx.drawImage(playerImage,
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


          // these 8 if statements control the 8 directions of movement and select and progress the animation frames as well
        if (keys.ArrowDown.pressed && keys.ArrowRight.pressed) {
          spriteSrc = main_right[spriteIndex]
          animateCounter++
          if (animateCounter >= animateDelay) {
            spriteIndex++
            animateCounter = 0
          }
          if (spriteIndex >= main_right.length - 1) {
            spriteIndex = 0
          }
          gameSceneLayer.position.y = gameSceneLayer.position.y - 1.2;  // Move Down
          gameSceneLayer.position.x = gameSceneLayer.position.x - 1.2;  // Move Left
        }
        else if (keys.ArrowUp.pressed && keys.ArrowRight.pressed) {
          spriteSrc = main_right[spriteIndex]
          animateCounter++
          if (animateCounter >= animateDelay) {
            spriteIndex++
            animateCounter = 0
          }
          if (spriteIndex >= main_right.length) {
            spriteIndex = 0
          }
          gameSceneLayer.position.y = gameSceneLayer.position.y + 1.2;  // Move Up
          gameSceneLayer.position.x = gameSceneLayer.position.x - 1.2;  // Move Left
        }
        else if (keys.ArrowDown.pressed && keys.ArrowLeft.pressed ) {
          spriteSrc = main_left[spriteIndex]
          animateCounter++
          if (animateCounter >= animateDelay) {
            spriteIndex++
            animateCounter = 0
          }
          if (spriteIndex >= main_left.length) {
            spriteIndex = 0
          }
          gameSceneLayer.position.y = gameSceneLayer.position.y - 1.2;  // Move Down
          gameSceneLayer.position.x = gameSceneLayer.position.x + 1.2;  // Move Right
        }
        else if (keys.ArrowUp.pressed && keys.ArrowLeft.pressed ) {
          spriteSrc = main_left[spriteIndex]
          animateCounter++
          if (animateCounter >= animateDelay) {
            spriteIndex++
            animateCounter = 0
          }
          if (spriteIndex >= main_left.length) {
            spriteIndex = 0
          }
          gameSceneLayer.position.y = gameSceneLayer.position.y + 1.2;  // Move Up
          gameSceneLayer.position.x = gameSceneLayer.position.x + 1.2;  // Move Right
        }
        else if (keys.ArrowDown.pressed) {
          spriteSrc = main_down[spriteIndex]
          animateCounter++
          if (animateCounter >= animateDelay) {
            spriteIndex++
            animateCounter = 0
          }
          if (spriteIndex >= main_down.length ) {
            spriteIndex = 0
          }
          gameSceneLayer.position.y = gameSceneLayer.position.y - 1.5;  // Move Down
        }
        else if (keys.ArrowUp.pressed) {
          spriteSrc = main_up[spriteIndex]
          animateCounter++
          if (animateCounter >= animateDelay) {
            spriteIndex++
            animateCounter = 0
          }
          if (spriteIndex >= main_up.length ) {
            spriteIndex = 0
          }
          gameSceneLayer.position.y = gameSceneLayer.position.y + 1.5;  // Move Up
        }
        else if (keys.ArrowRight.pressed) {
          spriteSrc = main_right[spriteIndex]
          animateCounter++
          if (animateCounter >= animateDelay) {
            spriteIndex++
            animateCounter = 0
          }
          if (spriteIndex >= main_right.length ) {
            spriteIndex = 0
          }
          gameSceneLayer.position.x = gameSceneLayer.position.x - 1.5;  // Move Left
        }
        else if (keys.ArrowLeft.pressed) {
          spriteSrc = main_left[spriteIndex]
          animateCounter++
          if (animateCounter >= animateDelay) {
            spriteIndex++
            animateCounter = 0
          }
          if (spriteIndex >= main_left.length ) {
            spriteIndex = 0
          }
          gameSceneLayer.position.x = gameSceneLayer.position.x + 1.5;  // Move Right
        } else {
          // if no input is given the sprite returns to the first resting position
          spriteIndex = 0
          if (lastKeyDown === 'ArrowDown') {
            spriteSrc = main_down[spriteIndex]
          } else if (lastKeyDown === 'ArrowUp') {
            spriteSrc = main_up[spriteIndex]
          } else if (lastKeyDown === 'ArrowRight') {
            spriteSrc = main_right[spriteIndex]
          } else if (lastKeyDown === 'ArrowLeft') {
            spriteSrc = main_left[spriteIndex]
          }
        }
      }
  }, [height, width])

      return (
        <canvas ref={canvas} height={height} width={width} />
      )
}

export default SpriteAnimator
