import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Card from './components/cards'
import './App.css'

function App() {

  const [count, setCount] = useState(0)

  return (
    <>
      <h1>hello maybe black jack</h1>
      <Card />

      <button >hit me</button>
    </>
  )
}

export default App
