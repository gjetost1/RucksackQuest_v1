import React, { useRef, useEffect } from 'react';
// import PlayingField from './components/PlayingField';
// import RenderBoy from './components/RenderBoy/RenderBoy';
// import SpriteAnimator from './components/SpriteAnimator';
// import Renderer from './components/RenderingEngine';
import BasicRender from './components/BasicRender/BasicRender';
import globalvars from './globalvars';
import './App.css';

// const height = 640
// const width = 960
// const windowHeight = window.innerHeight
// const windowWidth = window.innerWidth


function App() {
  // const canvas = React.useRef();

  return (
    <>
      <BasicRender/>
      {/* <Renderer id='background' canvas={canvas} height={globalvars.scene_height} width={globalvars.scene_width} /> */}
      {/* <RenderBoy id='player-sprite' canvas={canvas} height={globalvars.scene_height} width={globalvars.scene_width} /> */}
      {/* <PlayingField canvas={canvas} height={globalvars.scene_height} width={globalvars.scene_width} /> */}
      {/* <SpriteAnimator canvas={canvas} height={globalvars.scene_height} width={globalvars.scene_width} /> */}
    </>
  );
}

export default App;
