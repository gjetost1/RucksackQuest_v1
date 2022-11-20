const inputEngine = (keys) => {
  // console.log(keys)
  let lastKeyDown = ''; // use to determine which sprite to display once movement animation is over (once sprite anims are implemented)


  // event listener for directional movement input
  document.addEventListener('keydown', function(playerWalk) {
    switch (playerWalk.key) {
      case 'w':
      case 'W':
      case 'ArrowUp':
        keys.ArrowUp.pressed = true
        // console.log('up')
        lastKeyDown = 'ArrowUp'
        // console.log('Walk Up')
      break;
      case 's':
      case 'S':
      case 'ArrowDown':
        keys.ArrowDown.pressed = true
        lastKeyDown = 'ArrowDown'
        // console.log('Walk Down')
      break;
      case 'a':
      case 'A':
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        lastKeyDown = 'ArrowLeft'
        // console.log('Walk Left')
      break;
      case 'd':
      case 'D':
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        lastKeyDown = 'ArrowRight'
        // console.log('Walk Right')
      break;
        default:
        break;
    }
  })

  // event listener for directional movement end of input
  document.addEventListener('keyup', function(playerWalk) {
    switch (playerWalk.key) {
      case 'w':
      case 'W':
      case 'ArrowUp':
        keys.ArrowUp.pressed = false
        // console.log('Walk Up')
      break;
      case 's':
      case 'S':
      case 'ArrowDown':
        keys.ArrowDown.pressed = false
        // console.log('Walk Down')
      break;
        case 'a':
        case 'A':
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = false
          // console.log('Walk Left')
        break;
        case 'd':
        case 'D':
        case 'ArrowRight':
          keys.ArrowRight.pressed = false
          // console.log('Walk Right')
        break;
        default:
        break;
    }
  });

  // event listener for inputs other than directional movement
  document.addEventListener('keydown', (action) => {
    // console.log(jump)
    switch(action.key) {
      case ' ':
        keys.Space.pressed = true
        setTimeout(() => keys.Space.pressed = false, 30)
        // console.log('jump')
      break
      case 'Shift':
        keys.Shift.pressed = true
        // console.log('dash')
      break
      case 'e':
      case 'E':
        keys.e.pressed = true
        // console.log('action')
      break
      default:
      break
    }
  })

  // event listener for end of input other than directional movement
  document.addEventListener('keyup', (action) => {
    // console.log(jump)
    switch(action.key) {
      case ' ':
        keys.Space.pressed = false
      break
      case 'Shift':
        keys.Shift.pressed = false
      break
      case 'e':
      case 'E':
        keys.e.pressed = false
        // console.log('end action')
      break
      default:
      break
    }
  })

  // these next 2 event listeners manage mouse input.
  // case 0 is left mouse button
  // 1 is middle mouse button
  // 2 is left mouse button
  document.addEventListener('pointerdown', (action) => {
    // console.log(action.button)
    switch(action.button) {
      case 0:
        keys.mouse1.pressed = true
      break
      case 2:
        action.preventDefault() // prevents the middle mouse button from going into all direction scroll mode
      break
      default:
      break
    }
  })

  document.addEventListener('pointerup', (action) => {
    switch(action.button) {
      case 0:
        keys.mouse1.pressed = false
      break
      default:
      break
    }
  })

  // disables right-click context menu since this messes with input registration
  // and also lets you use the right mouse button for input
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  }, false);

  return keys
}

export default inputEngine
