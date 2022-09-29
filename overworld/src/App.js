import PlayingField from './components/PlayingField';
import './App.css';

const height = 640
const width = 960

// const height = window.innerHeight * .976
// const width = window.innerWidth * .99

function App() {
  return (
     <PlayingField height={height} width={width} />
  );
}

export default App;
