import { useState, useEffect } from 'react'
import Card from './components/cards'
import './App.css'

function App() {
  
  const [prevPick, setPrevPick] = useState([Math.floor(Math.random() * 52)])
  const [handValues, setHandValues] = useState(getCardValue(prevPick[0]))
  const [dealerValues, setDealerValues] = useState([0,0])
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [isGameOver, setIsGameOver] = useState(false)
  const [isDealerTur, setIsDealerTurn] = useState(false)

  const offset = 0

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

  function updateHandValues(newCardValue , dealtTo) {

    if(dealtTo === 'player'){
      setHandValues(prev => {

      const newLow = prev[0] + newCardValue[0]
      const newHigh = prev[1] + newCardValue[1]
      
      if (newLow > 21 && newHigh > 21) {
        setIsGameOver(true)
        return [newLow, newHigh]
      }
      else if(newLow === 21 || newHigh === 21){
        setIsGameOver(true)
        return [newLow, newHigh]
      }
       
      return [newLow, newHigh]
      })
    }
    else if(dealtTo === 'dealer'){
      setDealerValues(prev => {

      const newLow = prev[0] + newCardValue[0]
      const newHigh = prev[1] + newCardValue[1]
      
      if (newLow > 21 && newHigh > 21) {
        setIsGameOver(true)
        return [newLow, newHigh]
      }
      else if(newLow === 21 || newHigh === 21){
        setIsGameOver(true)
        return [newLow, newHigh]
      }
       
      return [newLow, newHigh]
      })
    }
    
  }

  function shuffle(dealtTo) {

    if (isGameOver) return 

    let genNum
    do {
      genNum = Math.floor(Math.random() * 52)
    } while (prevPick.includes(genNum))

    const newCardValue = getCardValue(genNum) 
    updateHandValues(newCardValue , dealtTo)
    setPrevPick(prev => [...prev, genNum])
  }

  function dealer(){
    setIsDealerTurn(true)

    useEffect(()=>{
      

    },[])
  }

  
  useEffect(() => {
    let zIndex = 0
    setPlayerHand(prevPick.map(pick => <Card key={pick} pick={pick} zIndex={++zIndex} />))
    
  }, [prevPick])

  useEffect(() => {
    if (handValues[0] > 21 && handValues[1] > 21) {
      setIsGameOver(true)
    }
  }, [handValues])

  return (
    <div className='bg-red-900 h-screen p-25 flex flex-col'>

      <div className="flex flex-col justify-center items-center text-3xl font-bold text-white">
         <p className='mb-2'>Score: {handValues[1] <= 21 ? handValues[1] : handValues[0]} </p>
        {isGameOver && (handValues[0] > 21 && handValues[1]> 21) && <p className='text-gray-900 ml-4'> BUST!</p>}
        {isGameOver && (handValues[0]===21 || handValues[1]===21) && <p className='text-yellow-300 ml-4'> BLACKJACK!!</p>}
      </div>
      
      <div>
        <div 
          className="flex justify-center relative h-112.5"
          style={{
            transform: `translateX(${- (playerHand.length*30)}px)`
          }}>
          {playerHand}
        </div>
      </div>
      

      <div className='flex justify-center'>

        {!isGameOver && <button onClick={() => shuffle('player')} className='px-4 py-2 rounded bg-black text-white'>hit me</button>}
        {!isGameOver && <button onClick={dealer} className='px-4 py-2 rounded bg-yellow-700 text-white'>stand</button>}

        {isGameOver && (
          <button onClick={() => {
            const initialCard = Math.floor(Math.random() * 52)
            setPrevPick([initialCard])
            const initialValue = getCardValue(initialCard)
            setHandValues(initialValue)
            setIsGameOver(false)
          }} className='px-4 py-2 rounded bg-black text-white'>
            Play Again
          </button>
        )}

      </div>

    </div>
  )
}

export default App