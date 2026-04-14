import './App.css'
import { useEffect, useRef } from 'react'
import { useGame } from './hooks/useGame'
import { useVoice } from './hooks/useVoice'
import { celebrateCorrect, celebrateWin } from './utils/confetti'
import WelcomeScreen from './components/WelcomeScreen'
import GameScreen from './components/GameScreen'
import WinnerBanner from './components/WinnerBanner'

export default function App() {
  const { state, startGame, tapTile, restartGame } = useGame()
  const { playPrompt, playFeedback, playWinner, stopAll } = useVoice()
  const prevTargetRef = useRef(null)

  // Play prompt whenever the target changes (but NOT on initial mount)
  useEffect(() => {
    if (state.phase !== 'playing' || state.targetValue === null) return
    if (state.targetValue === prevTargetRef.current) return

    prevTargetRef.current = state.targetValue
    // Slight delay so the correct-answer audio finishes first
    const timer = setTimeout(() => {
      playPrompt(state.playerName, state.targetValue)
    }, state.foundCount > 0 ? 1200 : 0)

    return () => clearTimeout(timer)
  }, [state.targetValue, state.phase])

  // On winner
  useEffect(() => {
    if (state.phase === 'winner') {
      celebrateWin()
      setTimeout(() => playWinner(), 400)
    }
  }, [state.phase])

  function handleStart(name) {
    // iOS audio must be unlocked inside the user gesture — call playPrompt synchronously here.
    // startGame sets the new state; we pass the first target manually below after dispatch.
    startGame(name)
  }

  // Once game transitions to playing and we have a target, play the prompt immediately.
  // The useEffect above handles this via prevTargetRef.

  function handleTap(value) {
    if (state.phase !== 'playing') return
    const isCorrect = tapTile(value)
    if (isCorrect === null || isCorrect === undefined) return

    playFeedback(isCorrect)
    if (isCorrect) {
      celebrateCorrect()
    }
  }

  function handleReplay() {
    if (state.phase === 'playing' && state.targetValue != null) {
      playPrompt(state.playerName, state.targetValue)
    }
  }

  function handleRestart() {
    stopAll()
    prevTargetRef.current = null
    restartGame()
  }

  if (state.phase === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />
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
