import PostLists from "./PostLists"
import {useState} from "react"

function App() {
  const [show, setShow] = useState(true)
  
  const handleShow = () => {
    setShow(!show)
  }

  return (
    <div>
      <p>Que pasa calabaza</p>
      <button onClick={handleShow}>Cancelar peticion</button>
      {show && <PostLists></PostLists>}
    </div>

  )
}

export default App
