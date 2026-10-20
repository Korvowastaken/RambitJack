import { useState, useEffect } from 'react'
import Card, { CardBack, cardSize } from './components/cards'
import { handScore, isBlackjack, drawCard, outcome } from './game'
import './App.css'

const resultText = { player: 'PLAYER WON!!', dealer: 'HOUSE WON!', draw: 'DRAW' }

function App() {

  const [dealerPicks , setDealerPicks] = useState([])
  const [playerPicks , setPlayerPicks] = useState([])
  // 'idle' | 'player' | 'dealer' | 'over'
  const [phase, setPhase] = useState('idle')
  // keys cards per round so a repeated card still replays its deal animation
  const [round, setRound] = useState(0)

  const [gamesPlayed, setGamesPlayed] = useState(() => {
    const saved = localStorage.getItem('gamesPlayed');
    return saved ? parseInt(saved) : 0;
  });

  const [playerWins, setPlayerWins] = useState(() => {
    const saved = localStorage.getItem('playerWins');
    return saved ? parseInt(saved) : 0;
  });

  const holeCardHidden = phase === 'player'
  const playerScore = handScore(playerPicks)
  const dealerScore = handScore(holeCardHidden ? dealerPicks.slice(0, 1) : dealerPicks)
  const result = phase === 'over' ? outcome(playerPicks, dealerPicks) : null

  const startNewGame = () => {
    const cards = []
    for (let i = 0; i < 4; i++) cards.push(drawCard(cards))
    const player = [cards[0], cards[2]]
    setPlayerPicks(player)
    setDealerPicks([cards[1], cards[3]])
    setPhase(isBlackjack(player) ? 'dealer' : 'player')
    setRound(prev => prev + 1)
  }

  const hit = () => {
    const picks = [...playerPicks, drawCard([...playerPicks, ...dealerPicks])]
    setPlayerPicks(picks)
    // bust or 21 ends the player's turn; the dealer effect settles the result
    if (handScore(picks) >= 21) setPhase('dealer')
  }

  useEffect(() => {
    localStorage.setItem('gamesPlayed', gamesPlayed);
  }, [gamesPlayed]);

  useEffect(() => {
    localStorage.setItem('playerWins', playerWins);
  }, [playerWins]);

  useEffect(() => {
    if (phase !== 'dealer') return
    const id = setTimeout(() => {
      const playerDone = handScore(playerPicks) > 21 || isBlackjack(playerPicks)
      if (!playerDone && handScore(dealerPicks) < 17) {
        setDealerPicks(prev => [...prev, drawCard([...playerPicks, ...prev])])
      } else {
        setPhase('over')
        setGamesPlayed(prev => prev + 1)
        if (outcome(playerPicks, dealerPicks) === 'player') setPlayerWins(prev => prev + 1)
      }
    }, 2000)
    return () => clearTimeout(id)
  }, [phase, playerPicks, dealerPicks])

  return (
    <div className='bg-[#2A5D40] min-h-screen  py-4 flex flex-col items-center justify-around '>

      {/* cards measure this to fly out of it; first in the DOM so dealt cards paint above it */}
      <div id='deck' aria-label='deck' className={`fixed top-4 right-4 ${cardSize}`}>
        {[3, 2, 1, 0].map(depth => (
          <CardBack key={depth} className='inset-0' style={{ translate: `${depth * 2}px ${depth * 2}px` }} />
        ))}
      </div>

      {gamesPlayed > 0 && <p className='absolute top-2 left-2 bg-[#1c4a30] rounded-2xl px-3 py-0.5 font-mono font-bold text-amber-400 text-xs sm:text-sm'>winrate: { Math.floor((playerWins/gamesPlayed)*100)}%</p>}

      {/* stacked (below xl): dealer on top, player at the bottom */}
      <div className='flex flex-col-reverse xl:flex-row xl:justify-center xl:gap-[10vw] xl:items-center xl:w-[70vw]'>

        <div className='flex flex-col items-center justify-center'>
          <div className="flex flex-col justify-center items-center mb-6 text-1.5xl font-bold text-white ">
            <p className='mb-2'>PLAYER SCORE</p>
            <p key={playerScore} className='text-2xl animate-pop'>  {playerScore} </p>
            {playerScore > 21 && <p className='text-gray-900'>BUST!</p>}
            {isBlackjack(playerPicks) && <p className='text-yellow-300'>BLACKJACK!!</p>}
          </div>

          <div
            className={`flex justify-center relative h-30 sm:h-45 mb-8 ${playerScore > 21 ? 'animate-shake' : ''}`}
            style={{
              transform: `translateX(${- ((playerPicks.length + 1) * 25)}px)`
            }}>
            {/* initial deal alternates player, dealer, player, dealer */}
            {playerPicks.map((pick, index) => (
              <Card key={`${round}-${pick}`} pick={pick} zIndex={index + 1} dealDelay={index < 2 ? index * 300 : 0} />
            ))}
          </div>
        </div>


      {result && <p className={`${result === 'dealer' ? 'bg-red-700 text-white' : 'bg-amber-200 text-black'} font-extrabold text-center w-auto z-200 px-24 py-4 rounded-2xl max-w-[80vw] animate-banner self-center my-4 xl:my-0`}>{resultText[result]}</p>}



        {phase !== 'idle' && <div className='flex flex-col mb-8 items-center justify-center'>

          <div className="flex flex-col justify-center items-center font-bold text-white">
            <p className='mb-2'>DEALER SCORE</p>
            <p key={dealerScore} className='text-2xl animate-pop'>  {dealerScore} </p>

          </div>

          <div
            className="flex justify-center relative h-30 sm:h-45 mt-8"
            style={{
              transform: `translateX(${- ((dealerPicks.length + 1) * 25)}px)`
            }}>
            {dealerPicks.map((pick, index) => (
              <Card key={`${round}-${pick}`} pick={pick} zIndex={index + 1} hidden={holeCardHidden && index === 1} dealDelay={index < 2 ? index * 300 + 150 : 0} />
            ))}
          </div>
        </div>}
      </div>


      <div className='flex w-3xs justify-evenly align-self-center'>
        {phase === 'idle' && (
          <button onClick={startNewGame} className='px-4 py-2 rounded bg-green-700 text-white'>
            Start Game
          </button>
        )}
        {phase === 'player' && (
          <>
            <button
              onClick={hit}
              className='px-4 py-2 rounded bg-black text-white'>
              Hit Me
            </button>
            <button
              onClick={() => setPhase('dealer')}
              className='px-4 py-2 rounded bg-yellow-700 text-white'>
              Stand
            </button>
          </>
        )}
        {phase === 'over' && (
          <button
            onClick={startNewGame}
            className='px-4 py-2 rounded bg-black text-white'>
            Play Again
          </button>
        )}
      </div>

    </div>
  )
}

export default App
