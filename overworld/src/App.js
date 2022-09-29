import PlayingField from './components/PlayingField';
import RenderBoy from './components/RenderBoy/RenderBoy';
import SpriteAnimator from './components/SpriteAnimator';
import globalvars from './globalvars';
import './App.css';

// const height = 640
// const width = 960

// const height = window.innerHeight * .976
// const width = window.innerWidth * .99

function App() {
  return (
    <>
      {/* <RenderBoy height={globalvars.scene_height} width={globalvars.scene_width} /> */}
      <PlayingField height={globalvars.scene_height} width={globalvars.scene_width} />
      {/* <SpriteAnimator height={globalvars.scene_height} width={globalvars.scene_width}/> */}
    </>
  );
}

export default App;
