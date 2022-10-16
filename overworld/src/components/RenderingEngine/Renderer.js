
import React, { useRef, useEffect } from 'react'

import introBackgroundLayer from './Background.js'

let centerX = 0;
let centerY = 0;

const Renderer = ({ canvasRef, height, width }) => {

  return (
    <div id='main-display-div'>
      <div id='canvas-container'>
        <canvas ref={canvasRef} height={height} width={width}/>
      </div>
    </div>
  )
}

export default Renderer
