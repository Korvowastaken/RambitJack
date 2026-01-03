import { useState, useEffect } from 'react'
import Card from './components/cards'
import './App.css'

function App() {
  
  const [shuffledPick, setShuffledPick] = useState(Math.floor(Math.random() * 52))
  const [prevPick, setPrevPick] = useState([Math.floor(Math.random() * 52)])
  const [playerHand, setPlayerHand] = useState([])

  useEffect(() => {
    setPlayerHand(prevPick.map(pick => <Card key={pick} pick={pick} />))
  }, [prevPick])

  function shuffle() {
    let genNum
    do {
      genNum = Math.floor(Math.random() * 52)
    } while (prevPick.includes(genNum))

    setShuffledPick(genNum)
    setPrevPick(prev => [...prev, genNum])
    console.log([...prevPick, genNum]) // Show updated array here
  }

  return (
    <>
      {playerHand}
      {/* <Card pick={shuffledPick} /> */}
      <button onClick={shuffle}>hit me</button>
    </>
  )
}

export default App