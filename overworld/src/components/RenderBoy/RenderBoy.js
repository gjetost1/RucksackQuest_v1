import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import globalvars from '../../globalvars'


import swamp_test_1 from '../../assets/backgrounds/test/swamp_test_1.png'

import InputHandler from '../InputHandler'
import SpriteAnimator from '../SpriteAnimator'

import Sprite from './spriteClass'
// import Sprite from '../SpriteAnimator/SpriteClass'


let centerX = 0
let centerY = 0



const RenderBoy = ({ canvas, height, width }) => {
  // let [spriteSrc, setSpriteSrc] = useState(main_down)


  // const canvas = React.useRef()

  useEffect(() => {
    const ctx = canvas.current.getContext('2d')
    // spriteIndex = 0

  class Sprite {
    constructor({ position, velocity, image }) {
      this.position = position
      this.image = image
    }
    draw(){
      ctx.drawImage(this.image, this.position.x, this.position.y, globalvars.scene_width, globalvars.scene_height)
    }}


// Game Scene Configuration
  const gameScene = new Image()
    gameScene.src = swamp_test_1

  const gameSceneLayer = new Sprite({
    position: {
      x: centerX,
      y: centerY
    },
    image: gameScene
}) //  End Game Scene Configuration


gameSceneLayer.draw() // Draw Game Scene Layer

  // SpriteAnimator(ctx, gameSceneLayer,centerX, centerY, height, width)
}, [height, width])

return (
    <canvas ref={canvas} height={height} width={width} />
  );
};
RenderBoy.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default RenderBoy
