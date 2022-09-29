import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import { main_down, main_up, main_left, main_right } from './spriteRef.js'

import swamp_test_1 from '../../assets/backgrounds/test/swamp_test_1.png'

import InputHandler from '../InputHandler'


let centerX = 0;
let centerY = 0;
let spriteSize = 1;
let spriteMiddle = 2;






const PlayingField = ({height, width}) => {
  // let [spriteSrc, setSpriteSrc] = useState(main_down)
  let spriteIndex = 0
  const animateDelay = 10 // one animation per this number of frames
  let animateCounter = 0 // this counts up to animateDelay
  let spriteSrc = main_down[0]

  const canvas = React.useRef();


  useEffect(() => {
    const ctx = canvas.current.getContext('2d');
    spriteIndex = 0
  class Sprite {
    constructor({ position, velocity, image }) {
      this.position = position
      this.image = image
    }

    draw(){
      ctx.drawImage(this.image, this.position.x, this.position.y, width, height);
    }}
// Game Scene Configuration
  const gameScene = new Image();
    gameScene.src = swamp_test_1;
  const gameSceneLayer = new Sprite({
    position: {
      x: centerX,
      y: centerY
    },
    image: gameScene
}) //  End Game Scene Configuration

// this function handles all inputs from the keyboard
const {keys, lastKeyDown} = InputHandler()

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




    gameSceneLayer.draw() // Draw Game Scene Layer
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
    // if (keys.ArrowDown.pressed && lastKeyDown === 'ArrowDown') {
    //   gameSceneLayer.position.y = gameSceneLayer.position.y - 3;  // Move Down
    // }
    // else if (keys.ArrowUp.pressed && lastKeyDown === 'ArrowUp') {
    //   gameSceneLayer.position.y = gameSceneLayer.position.y + 3;  // Move Up
    // }
    // else if (keys.ArrowRight.pressed && lastKeyDown === 'ArrowRight') {
    //   gameSceneLayer.position.x = gameSceneLayer.position.x - 3;  // Move Left
    // }
    // else if (keys.ArrowLeft.pressed && lastKeyDown === 'ArrowLeft') {
    //   gameSceneLayer.position.x = gameSceneLayer.position.x + 3;  // Move Right
    // }
  }
  animate();
}, [height, width]);

return (
    <canvas ref={canvas} height={height} width={width} />
  );
};
PlayingField.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default PlayingField;
