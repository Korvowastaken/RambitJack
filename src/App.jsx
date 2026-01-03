import { useState, useEffect } from 'react'
import Card from './components/cards'
import './App.css'

function App() {
  
  const [prevPick, setPrevPick] = useState([Math.floor(Math.random() * 52)])
  const [handValues, setHandValues] = useState(getCardValue(prevPick))
  const [playerHand, setPlayerHand] = useState([])
  const [isGameOver, setIsGameOver] = useState(false)

  useEffect(() => {
    setPlayerHand(prevPick.map(pick => <Card key={pick} pick={pick} />))
  }, [prevPick])

  function getCardValue(cardNum) {
    const rank = cardNum % 13
    
    if (rank === 0) {
      return [1, 11] 
    } else if (rank >= 10) {
      return [10, 10]
    } else {
      return [rank + 1, rank + 1]
    }
  }

  function updateHandValues(newCardValue) {
    setHandValues(prev => {

      const newLow = prev[0] + newCardValue[0]
      const newHigh = prev[1] + newCardValue[1]
      
      if (newLow > 21 && newHigh > 21) {
        setIsGameOver(true)
        return [newLow, newHigh]
      }
      
      return [newLow, newHigh]
    })
  }

  function shuffle() {

    if (isGameOver) return 

    let genNum
    do {
      genNum = Math.floor(Math.random() * 52)
    } while (prevPick.includes(genNum))

    const newCardValue = getCardValue(genNum)
    updateHandValues(newCardValue)
    setPrevPick(prev => [...prev, genNum])
  }

  useEffect(() => {
    if (handValues[0] > 21 && handValues[1] > 21) {
      setIsGameOver(true)
    }
  }, [handValues])

  return (
    <>
      <div className="score-display">
         Score: {handValues[1] <= 21 ? handValues[1] : handValues[0]} 
        {isGameOver && <span> BUST!</span>}
      </div>
      <div className="hand-container">
        {playerHand}
      </div>
      <button onClick={shuffle} disabled={isGameOver}>hit me</button>

      {isGameOver && (
        <button onClick={() => {
          const initialCard = Math.floor(Math.random() * 52)
          setPrevPick([initialCard])
          const initialValue = getCardValue(initialCard)
          setHandValues(initialValue)
          setIsGameOver(false)
        }}>
          Play Again
        </button>
      )}
    </>
  )
}

export default App