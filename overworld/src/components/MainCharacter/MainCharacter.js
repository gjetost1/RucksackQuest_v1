import './MainCharacter.css'
import React, {useState, useEffect} from 'react';

import { main_down, main_up, main_left, main_right } from './spriteRef.js'


let spriteSize = 1;
let spriteMiddle = 2;



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
      // spriteSrc = 'https://neoeononebucket.s3.us-east-2.amazonaws.com/rucksack_quest/up_up.png'
      console.log('Walk Up')
      // console.log(spriteSrc)
    break;
    case 'ArrowDown':
      keys.ArrowDown.pressed = true
      lastKeyDown = 'ArrowDown'
      console.log('Walk Down')
      // console.log(spriteSrc)
    break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      lastKeyDown = 'ArrowLeft'
      console.log('Walk Left')
      // console.log(spriteSrc)
    break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      lastKeyDown = 'ArrowRight'
      console.log('Walk Right')
      // console.log(spriteSrc)
    break;
      default:
      break;
  }
});
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

export const playerAnimate = (width, height, ctx, gameSceneLayer, centerX, centerY) => {
  let spriteSrc = main_down[0]
  let spriteIndex = 0
  const animateDelay = 10 // one animation per this number of frames
  let animateCounter = 0 // this counts up to animateDelay

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

/////////////////////////////////////////////////////////////////////////////////

export const MainCharacter = ({ ctx }) => {

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


}

export default MainCharacter
