
import './App.css'
import image from './image.jpg'
import { useState, useCallback, useEffect, useRef } from 'react' 
import Box from './Box'

const testFaces = [
  {id: 0, title: 'Tolkien', x: 0.19884726224783864, y: 0.003267973856209111, size: 0.12},
  {id: 1, title: 'Lewis', x: 0.5605187319884726, y: 0.1111111111111111, size: 0.12}
]

//Todo - Create a function that updates face postitions on mouseup

function App() {
  const [mouseStatus, setMouseStatus] = useState(undefined)
  const [faces, setFaces] = useState(testFaces)
  const [containerSize, setContainerSize] = useState({x: 0, y:0})

  const containerRef = useRef(null)/*useCallback(node => {
    if (node !== null) {
      setContainerSize({
        x: entry.contentRect.width,
        y: entry.contentRect.height
      })
    }
  }, [])*/

  const ro = new ResizeObserver(entries => {
    for (let entry of entries) {
      setContainerSize({
        x: entry.contentRect.width,
        y: entry.contentRect.height
      })
    }
  })

  useEffect(() => {
    if(containerRef !== null) {
      ro.observe(containerRef.current)
    }
  }, [])

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
      className="Container"
      onMouseMove={(event) => setMouseStatus(event)}
      onMouseUp={(event) => setMouseStatus(event)}
      onMouseLeave={(event) => setMouseStatus(event)}
    >
      <img ref={containerRef} src={image} />
      {faceBoxes}
    </div>
  )
}

export default App;
