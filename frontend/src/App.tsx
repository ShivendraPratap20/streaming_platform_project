import VideoPlayer from './components/VideoPlayer'
import './App.css'

function App() {

  return(
    <VideoPlayer src="http://localhost:8000/hls/index.m3u8" />
  )
}

export default App
