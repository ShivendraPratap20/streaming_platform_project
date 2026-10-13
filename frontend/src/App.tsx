import VideoPlayer from './components/VideoPlayer'
import './App.css'

function App() {

  return(
    <VideoPlayer src="http://localhost:8000/hls/master.m3u8" />
  )
}

export default App
