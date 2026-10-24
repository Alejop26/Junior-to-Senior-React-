import { useState } from 'react'


function App() {
  const arrowfunction = () => ('hola que hace', 'hplala')

  console.log(arrowfunction())
  return (
    <button onClick={arrowfunction}>que pasa que pasa</button>
  )
}

export default App
