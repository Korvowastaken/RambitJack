import { useState } from 'react'
import Card from './components/cards'
import './App.css'

function App() {
  const [shuffledPick, setShuffledPick] = useState(Math.floor(Math.random() * 52))
  const [prevPick, setPrevPick] = useState([shuffledPick])



  function shuffle() {

    let genNum

    do {
      genNum = Math.floor(Math.random() * 52)
      
    } while (prevPick.includes(genNum))

    setShuffledPick(genNum)
    setPrevPick(prev => [...prev, genNum])
    console.log(prevPick)
  }

  return (
    <>
      <Card pick={shuffledPick} />
      <button onClick={shuffle}>hit me</button>
    </>
  )
}

export default App