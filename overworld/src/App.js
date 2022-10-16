import React, { useRef, useEffect } from 'react';
import PlayingField from './components/PlayingField';
import RenderBoy from './components/RenderBoy/RenderBoy';
import SpriteAnimator from './components/SpriteAnimator';
import Renderer from './components/RenderingEngine';
import globalvars from './globalvars';
import './App.css';

// const height = 640
// const width = 960

// const height = window.innerHeight * .976
// const width = window.innerWidth * .99

function App() {
  // const canvas = React.useRef();
  const canvasRef = useRef(null)

  const canvas = canvasRef.current
  const context = canvas.getContext('2d')


  return (
    <>
      <Renderer canvasRef= {canvasRef} height={globalvars.scene_height} width={globalvars.scene_width} />
      {/* <RenderBoy canvas={canvas} height={globalvars.scene_height} width={globalvars.scene_width} /> */}
      {/* <PlayingField canvas={canvas} height={globalvars.scene_height} width={globalvars.scene_width} /> */}
      {/* <SpriteAnimator canvas={canvas} height={globalvars.scene_height} width={globalvars.scene_width} /> */}
    </>
  );
}

export {canvas, context}

export default App;
