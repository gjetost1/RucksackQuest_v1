import React, { useRef, useEffect } from 'react'
import Background from './Background.js'
import PlayerRender from './PlayerRender.js'
import './RenderingEngine.css'

let centerX = 0
let centerY = 0

const Renderer = ({ canvas, height, width }) => {

  // console.log(canvas)

  // useEffect(() => {
  //   const context = canvas.current.getContext('2d')
  // console.log(context)

  // }, [])

  return (
    <div id='main-display-div'>
      <div id='canvas-container'>
        <PlayerRender canvas={canvas} height={height} width={width} />
        <Background canvas={canvas} height={height} width={width} />
        {/* <canvas ref={canvasRef} height={height} width={width}/> */}
      </div>
    </div>
  )
}

export default Renderer
