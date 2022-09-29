// object that keeps track of if a key is pressed or not
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

// tracks last key pressed for certain events eg. idle state facing direction of main character sprite
let lastKeyDown = '';
const InputHandler = () => {
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
  return {keys, lastKeyDown}
}

export default InputHandler
