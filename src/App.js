
import './App.css'
import image from './image.jpg'
import { useState, useRef, useEffect } from 'react' 
import Box from './Box'

const testFaces = [
  {id: 0, title: 'Tolkien', x: 0.19884726224783864, y: 0.003267973856209111, size: 0.12},
  {id: 1, title: 'Lewis', x: 0.5605187319884726, y: 0.1111111111111111, size: 0.12}
]

//Todo - Create a function that updates face postitions on mouseup

function App() {
  const containerRef = useRef(null)
  const [mouseStatus, setMouseStatus] = useState(undefined)
  const [faces, setFaces] = useState(testFaces)
  const [containerSize, setContainerSize] = useState({x: 0, y:0})

  useEffect(() => {
    setContainerSize({
      x: containerRef.current.offsetWidth,
      y: containerRef.current.offsetHeight
    })
  })

  const faceBoxes = faces.map((face) =>
    <Box 
      key={face.id} 
      mouseStatus={mouseStatus} 
      x={face.x} 
      y={face.y} 
      title={face.title} 
      size={face.size}
      containerSize={containerSize}
    />
  )

  return (
    <div 
      ref={containerRef}
      className="Container"
      onMouseMove={(event) => setMouseStatus(event)}
      onMouseUp={(event) => setMouseStatus(event)}
    >
      <img src={image} />
      {faceBoxes}
    </div>
  )
}

export default App;
