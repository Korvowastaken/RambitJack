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
  const [draw , setDraw] = useState(false)
  const [startGame, setStartGame] = useState(false)
  

  const [gamesPlayed, setGamesPlayed] = useState(() => {
    const saved = localStorage.getItem('gamesPlayed');
    return saved ? parseInt(saved) : 0;
  });
  
  const [playerWins, setPlayerWins] = useState(() => {
    const saved = localStorage.getItem('playerWins');
    return saved ? parseInt(saved) : 0;
  });
  
  const startNewGame = () => {
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
    setDraw(false)
    setDealerWon(false)
    setStartGame(true)
  }


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
        setIsDealerTurn(true)
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
    
  }

  useEffect(() => {
    localStorage.setItem('gamesPlayed', gamesPlayed);
  }, [gamesPlayed]);

  useEffect(() => {
    localStorage.setItem('playerWins', playerWins);
  }, [playerWins]);

  useEffect(() => {
    if (isDealerTurn && !isGameOver) {
      const dealerScore = dealerValues[1] <= 21 ? dealerValues[1] : dealerValues[0]
      const playerScore = playerValues[1] <= 21 ? playerValues[1] : playerValues[0]
      
      setTimeout(()=>{
        if (dealerScore <= 17 && dealerScore <= 21) {
        
            shuffle('dealer')
          
        } 
        else {
          if (dealerScore > 21) {
            setPlayerWon(true)
            setPlayerWins(prev => prev + 1)
            
          }
          if ((dealerScore > playerScore) && (dealerScore <= 21)) {
            setDealerWon(true)
          }
          if (playerScore > dealerScore) {
            setPlayerWins(prev => prev + 1)
            setPlayerWon(true)
          }
          if (playerScore === dealerScore){
            setDraw(true)
          }
          setIsGameOver(true)
        }
      },2000)
    }
  }, [isDealerTurn, isGameOver, dealerValues, playerValues])

  useEffect(() => {
    if (playerValues[0] > 21 && playerValues[1] > 21) {
      setIsGameOver(true)
    }
  }, [playerValues])

  return (
    <div className='bg-[#2A5D40] min-h-screen  py-4 flex flex-col items-center justify-around '>

      {(isDealerTurn) && <p className='absolute top-2 left-2 font-bold text-amber-400 text-xs'>winrate: { Math.floor((playerWins/gamesPlayed)*100)}%</p>}      
      
      <div className='xl:flex xl:flex-row xl:justify-center xl:gap-[10vw] xl:items-center xl:w-[70vw]'>

        <div className='flex flex-col items-center justify-center'>
          <div className="flex flex-col justify-center items-center mb-6 text-1.5xl font-bold text-white ">
            <p className='mb-2'>PLAYER SCORE</p>
            <p className='text-2xl'>  {playerValues[1] <= 21 ? playerValues[1] : playerValues[0]} </p>
            {(playerValues[0] > 21 && playerValues[1]> 21) && <p className='text-gray-900'>BUST!</p>}
            {(playerValues[0]===21 || playerValues[1]===21) && <p className='text-yellow-300'>BLACKJACK!!</p>}
          </div>

          <div 
            className="flex justify-center relative h-30 sm:h-45 mb-8"
            style={{
              transform: `translateX(${- ((playerPicks.length + 1) * 25)}px)`
            }}>
            {playerPicks.map((pick, index) => (
              <Card key={pick} pick={pick} zIndex={index + 1} />
            ))}
          </div>
        </div>

        
      {playerWon && <p className=' text-black font-extrabold text-center w-auto z-200 px-24 py-4 rounded-2xl bg-amber-200 max-w-[80vw] '> PLAYER WONNNNN !! </p> }
      {dealerWon && <p className=' text-black font-extrabold text-center w-auto z-200 px-24 py-4 rounded-2xl bg-amber-200 max-w-[80vw] '> HOUSE WON!</p>}
      {draw && <p className=' text-black font-extrabold text-center w-auto z-200 px-24 py-4 rounded-2xl bg-amber-200 max-w-[80vw] ' >DRAW</p>}

        

        {isDealerTurn && <div className='flex flex-col-reverse lg:flex-col lg:mb-8 items-center justify-center'>

          <div className="flex flex-col-reverse lg:flex-col justify-center items-center font-bold text-white mt-6 lg:mt-0">
            <p className='mt-2 lg:mt-0 lg:mb-2'>DEALER SCORE</p>
            <p className='text-2xl'>  {dealerValues[1] <= 21 ? dealerValues[1] : dealerValues[0]} </p>

          </div>

          <div 
            className="flex justify-center relative h-30 sm:h-45 mt-8"
            style={{
              transform: `translateX(${- ((dealerPicks.length + 1) * 25)}px)`
            }}>
            {dealerPicks.map((pick, index) => (
              <Card key={pick} pick={pick} zIndex={index + 1} />
            ))}
          </div>
        </div>}
      </div>
      

      <div className='flex w-3xs justify-evenly align-self-center'>
        {!startGame ? (
          <button onClick={startNewGame} className='px-4 py-2 rounded bg-green-700 text-white'>
            Start Game
          </button>
        ) : (
          <>
            {!isDealerTurn && !isGameOver && (
              <>
                <button 
                  onClick={() => shuffle('player')} 
                  className='px-4 py-2 rounded bg-black text-white'>
                  Hit Me
                </button>
                <button 
                  onClick={() => setIsDealerTurn(true)} 
                  className='px-4 py-2 rounded bg-yellow-700 text-white'>
                  Stand
                </button>
              </>
            )}
            {isGameOver && (
              <button 
                onClick={() => {
                  setGamesPlayed(prev => prev + 1)
                  startNewGame()
                }} 
                className='px-4 py-2 rounded bg-black text-white'>
                Play Again
              </button>
            )}
          </>
        )}
      </div>

    </div>
  )
}

export default App