import { useState, useEffect } from 'react'
import Card, { CardBack, cardSize } from './components/cards'
import { handScore, isBlackjack, drawCard, outcome, dealerShouldHit } from './game'
import { sfx, setMuted } from './sound'
import './App.css'

const resultText = { player: 'PLAYER WON!!', dealer: 'HOUSE WON!', draw: 'DRAW' }
const resultStyle = { player: 'bg-amber-300 text-black', dealer: 'bg-red-700 text-white', draw: 'bg-slate-600 text-white' }

// chunky Balatro-style button: dark lip underneath that it presses down into
const button = 'font-pixel text-xl sm:text-2xl text-white px-6 py-2 rounded-xl shadow-[0_5px_0_rgba(0,0,0,0.4)] text-shadow-[0_2px_0_rgba(0,0,0,0.35)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-[translate,filter,box-shadow] duration-100'

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

  const [hardMode, setHardMode] = useState(() => localStorage.getItem('hardMode') === 'true')
  const [soundOn, setSoundOn] = useState(() => localStorage.getItem('soundOn') !== 'false')

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
    if (handScore(picks) > 21) sfx.lose()
    if (handScore(picks) >= 21) stand()
  }

  // ending the player's turn reveals the hole card
  const stand = () => {
    setPhase('dealer')
    sfx.flip()
  }

  useEffect(() => {
    localStorage.setItem('gamesPlayed', gamesPlayed);
  }, [gamesPlayed]);

  useEffect(() => {
    localStorage.setItem('playerWins', playerWins);
  }, [playerWins]);

  useEffect(() => {
    localStorage.setItem('hardMode', hardMode);
  }, [hardMode]);

  useEffect(() => {
    setMuted(!soundOn)
    localStorage.setItem('soundOn', soundOn);
  }, [soundOn]);

  useEffect(() => {
    if (phase !== 'dealer') return
    const id = setTimeout(() => {
      const playerDone = handScore(playerPicks) > 21 || isBlackjack(playerPicks)
      if (!playerDone && dealerShouldHit(dealerPicks, playerPicks, hardMode)) {
        setDealerPicks(prev => [...prev, drawCard([...playerPicks, ...prev])])
      } else {
        const winner = outcome(playerPicks, dealerPicks)
        setPhase('over')
        setGamesPlayed(prev => prev + 1)
        if (winner === 'player') setPlayerWins(prev => prev + 1)
        // a bust already played the losing sound when it happened
        if (handScore(playerPicks) <= 21) sfx[{ player: 'win', dealer: 'lose', draw: 'draw' }[winner]]()
      }
    }, 2000)
    return () => clearTimeout(id)
  }, [phase, playerPicks, dealerPicks, hardMode])

  return (
    <div className='bg-[#2A5D40] min-h-screen  py-4 flex flex-col items-center justify-around '>

      {/* cards measure this to fly out of it; first in the DOM so dealt cards paint above it */}
      <div id='deck' aria-label='deck' className={`fixed top-4 right-4 ${cardSize}`}>
        {[3, 2, 1, 0].map(depth => (
          <CardBack key={depth} className='inset-0' style={{ translate: `${depth * 2}px ${depth * 2}px` }} />
        ))}
      </div>

      {/* max-w keeps the pills clear of the deck in the top-right on narrow phones */}
      <div className='absolute top-2 left-2 flex flex-wrap gap-2 max-w-[calc(100vw-7.5rem)] font-mono font-bold text-xs sm:text-sm'>
        {gamesPlayed > 0 && <p className='bg-[#1c4a30] rounded-2xl px-3 py-0.5 text-amber-400'>winrate: { Math.floor((playerWins/gamesPlayed)*100)}%</p>}
        {/* locked mid-hand so the mode can't be switched after seeing the cards */}
        <button
          onClick={() => { setHardMode(prev => !prev); sfx.click() }}
          disabled={phase === 'player' || phase === 'dealer'}
          aria-pressed={hardMode}
          title='Hard mode: the dealer keeps drawing while behind you. Change between hands.'
          className={`rounded-2xl px-3 py-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${hardMode ? 'bg-red-700 text-white' : 'bg-[#1c4a30] text-amber-400'}`}>
          hard mode: {hardMode ? 'on' : 'off'}
        </button>
        <button
          // unmute before the click sound so turning sound on is audible
          onClick={() => { setMuted(soundOn); setSoundOn(!soundOn); sfx.click() }}
          aria-pressed={soundOn}
          className='rounded-2xl px-3 py-0.5 bg-[#1c4a30] text-amber-400'>
          sound: {soundOn ? 'on' : 'off'}
        </button>
      </div>

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
            // z-10: cards flying to the player cross the dealer's hand and must pass over it
            className={`flex justify-center relative z-10 h-30 sm:h-45 mb-8 ${playerScore > 21 ? 'animate-shake' : ''}`}
            style={{
              transform: `translateX(${- ((playerPicks.length + 1) * 25)}px)`
            }}>
            {/* initial deal alternates player, dealer, player, dealer */}
            {playerPicks.map((pick, index) => (
              <Card key={`${round}-${pick}`} pick={pick} zIndex={index + 1} dealDelay={index < 2 ? index * 300 : 0} />
            ))}
          </div>
        </div>


      {result && <p className={`${resultStyle[result]} font-pixel font-bold text-2xl sm:text-3xl tracking-wide text-center w-auto z-200 px-10 sm:px-24 py-3 rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.35)] max-w-[80vw] animate-banner self-center my-4 xl:my-0`}>{resultText[result]}</p>}



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


      <div className='flex gap-4 justify-center'>
        {phase === 'idle' && (
          <button onClick={startNewGame} className={`${button} bg-orange-600`}>
            Start Game
          </button>
        )}
        {phase === 'player' && (
          <>
            <button
              onClick={hit}
              className={`${button} bg-blue-600`}>
              Hit Me
            </button>
            <button
              onClick={stand}
              className={`${button} bg-red-600`}>
              Stand
            </button>
          </>
        )}
        {phase === 'over' && (
          <button
            onClick={startNewGame}
            className={`${button} bg-orange-600`}>
            Play Again
          </button>
        )}
      </div>

    </div>
  )
}

export default App
