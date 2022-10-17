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
  const canvas = React.useRef();

  return (
    <>
      <Renderer id='background' canvas={canvas} height={globalvars.scene_height} width={globalvars.scene_width} />
      {/* <RenderBoy id='player-sprite' canvas={canvas} height={globalvars.scene_height} width={globalvars.scene_width} /> */}
      {/* <PlayingField canvas={canvas} height={globalvars.scene_height} width={globalvars.scene_width} /> */}
      {/* <SpriteAnimator canvas={canvas} height={globalvars.scene_height} width={globalvars.scene_width} /> */}
    </>
  );
}

export default App;
