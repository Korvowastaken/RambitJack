import { useState, useEffect } from 'react'
import Card from './components/cards'
import './App.css'

function App() {

  const [usedCards, setUsedCards] = useState([])
  const [dealerPicks , setDealerPicks] = useState([])
  const [playerPicks , setPlayerPicks] = useState([])


  const [playerValues , setPlayerValues] = useState([0,0])
  const [dealerValues , setDealerValues] = useState([0,0])


  const [isGameOver, setIsGameOver] = useState(false)
  const [isDealerTurn, setIsDealerTurn] = useState(false)
  const [dealerWon, setDealerWon] = useState(false)
  const [playerWon, setPlayerWon] = useState(false)
  

  const offset = 0

  function getCardValue(genNum) {
    const rank = genNum % 13
    
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
      setPlayerValues(prev => {

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
        
        return [newLow, newHigh]
      }
      else if(newLow === 21 || newHigh === 21){
        setDealerWon(true)
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
    } while (usedCards.includes(genNum))

    const newCardValue = getCardValue(genNum)
    updateHandValues(newCardValue , dealtTo)

     if(dealtTo==='player'){
      setPlayerPicks(prev => [...prev, genNum])
    }
    else{
      setDealerPicks(prev => [...prev, genNum])
    }
    setUsedCards(prev => [...prev, genNum])
    console.log(`usercards: ${usedCards}`)
  }

  useEffect(() => {
    if (isDealerTurn && !isGameOver) {
      const dealerScore = dealerValues[1] <= 21 ? dealerValues[1] : dealerValues[0]
      const playerScore = playerValues[1] <= 21 ? playerValues[1] : playerValues[0]
      
      if (dealerScore <= 17 && dealerScore <= 21) {
        setTimeout(() => {
          shuffle('dealer')
        }, 2000)
      } else {
        if (dealerScore > 21) {
          setPlayerWon(true)
        }
        if ((dealerScore > playerScore) && (dealerScore <= 21)) {
          setDealerWon(true)
        }
        if (playerScore > dealerScore) {
          setPlayerWon(true)
        }
        if (playerScore === dealerScore){
          console.log('Draw')
        }
        setIsGameOver(true)
      }
    }
  }, [isDealerTurn, isGameOver, dealerValues, playerValues])

  useEffect(()=>{

    if(dealerWon){
      console.log('dealer won')
    }
    if(playerWon){
      console.log('player won')
    }

  },[dealerWon, playerWon])

  useEffect(() => {
    if (playerValues[0] > 21 && playerValues[1] > 21) {
      setIsGameOver(true)
    }
  }, [playerValues])

  return (
    <div className='bg-red-900 min-h-screen  py-4 flex flex-col'>

      {playerWon && <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sky-300 z-200'> PLAYER WONNNNNNN !! </p> }
      {dealerWon && <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sky-300 z-200'> HOUSE WON!</p>}

      <div className="flex flex-col justify-center items-center text-1.5xl font-bold text-white ">
         <p className='mb-2'>PLAYER SCORE:</p>
         <p className='text-2xl'>  {playerValues[1] <= 21 ? playerValues[1] : playerValues[0]} </p>
        {isGameOver && (playerValues[0] > 21 && playerValues[1]> 21) && <p className='text-gray-900'>BUST!</p>}
        {isGameOver && (playerValues[0]===21 || playerValues[1]===21) && <p className='text-yellow-300'>BLACKJACK!!</p>}
      </div>
      
      <div>
        <div 
          className="flex justify-center relative h-60"
          style={{
            transform: `translateX(${- (playerPicks.length * 30)}px)`
          }}>
          {playerPicks.map((pick, index) => (
            <Card key={pick} pick={pick} zIndex={index + 1} />
          ))}
        </div>
      </div>

      

      {isDealerTurn && <div>

        <div className='flex flex-col justify-center items-center text-1xl font-bold text-white'>
          <p >DEALER SCORE</p> 
          <p> {dealerValues[1] <= 21 ? dealerValues[1] : dealerValues[0]} </p>
        </div>

        <div 
          className="flex justify-center relative h-60"
          style={{
            transform: `translateX(${- (dealerPicks.length * 30)}px)`
          }}>
          {dealerPicks.map((pick, index) => (
            <Card key={pick} pick={pick} zIndex={index + 1} />
          ))}
        </div>
      </div>}
      

      <div className='flex justify-center'>

        {!isGameOver && <button onClick={() => shuffle('player')} className='px-4 py-2 rounded bg-black text-white'>hit me</button>}
        {!isGameOver && <button onClick={() => setIsDealerTurn(true)} className='px-4 py-2 rounded bg-yellow-700 text-white'>stand</button>}

        {isGameOver && (
          <button onClick={() => {

            console.log('game over')
            const initialCard = Math.floor(Math.random() * 52)
            const initialValue = getCardValue(initialCard)
            setUsedCards([initialCard])
            setPlayerPicks([initialCard])
            setDealerPicks([])
            setIsGameOver(false)
            setIsDealerTurn(false)
            setPlayerValues(initialValue)
            setDealerValues([0,0])
            setPlayerWon(false)
            setDealerWon(false)

          }} className='px-4 py-2 rounded bg-black text-white'>
            Play Again
          </button>
        )}

      </div>

    </div>
  )
}

export default App