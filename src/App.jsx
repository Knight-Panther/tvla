import './App.css'
import { useEffect, useRef } from 'react'
import { useGame } from './hooks/useGame'
import { useVoice } from './hooks/useVoice'
import { celebrateCorrect, celebrateWin } from './utils/confetti'
import WelcomeScreen from './components/WelcomeScreen'
import GameScreen from './components/GameScreen'
import WinnerBanner from './components/WinnerBanner'
import InstallPrompt from './components/InstallPrompt'

export default function App() {
  const { state, startGame, tapTile, restartGame } = useGame()
  const { playPrompt, playFeedback, playWinner, stopAll } = useVoice()

  // Refs so async callbacks always read the latest values without stale closures
  const stateRef = useRef(state)
  useEffect(() => { stateRef.current = state }, [state])

  // Lock taps while correct-feedback audio plays (prevents it being cut off)
  const feedbackLockRef = useRef(false)

  // Play the first prompt when the game starts
  const didPlayFirstRef = useRef(false)
  useEffect(() => {
    if (state.phase === 'playing' && state.targetValue !== null && !didPlayFirstRef.current) {
      didPlayFirstRef.current = true
      playPrompt(state.playerName, state.targetValue)
    }
    if (state.phase !== 'playing') {
      didPlayFirstRef.current = false
    }
  }, [state.phase, state.targetValue])

  // On winner
  useEffect(() => {
    if (state.phase === 'winner') {
      celebrateWin()
      setTimeout(() => playWinner(), 400)
    }
  }, [state.phase])

  function handleStart(name) {
    startGame(name)
  }

  function handleTap(value) {
    if (state.phase !== 'playing') return
    if (feedbackLockRef.current) return  // ignore taps while correct-feedback plays

    const isCorrect = tapTile(value)
    if (isCorrect === null || isCorrect === undefined) return

    if (isCorrect) {
      celebrateCorrect()
      feedbackLockRef.current = true
      playFeedback(true).then(() => {
        return new Promise(r => setTimeout(r, 500))
      }).then(() => {
        feedbackLockRef.current = false
        const s = stateRef.current
        if (s.phase === 'playing' && s.targetValue !== null) {
          playPrompt(s.playerName, s.targetValue)
        }
      })
    } else {
      playFeedback(false)
    }
  }

  function handleReplay() {
    if (state.phase === 'playing' && state.targetValue != null) {
      playPrompt(state.playerName, state.targetValue)
    }
  }

  function handleRestart() {
    stopAll()
    restartGame()
  }

  if (state.phase === 'welcome') {
    return (
      <>
        <WelcomeScreen onStart={handleStart} />
        <InstallPrompt />
      </>
    )
  }

  if (state.phase === 'winner') {
    return <WinnerBanner playerName={state.playerName} onRestart={handleRestart} />
  }

  return (
    <GameScreen
      state={state}
      onTap={handleTap}
      onReplay={handleReplay}
    />
  )
}
