import { useRef } from 'react'
import { PHRASES } from '../data/numbers'

const BASE = import.meta.env.BASE_URL + 'audio/'

// Module-level so we can cancel across renders
let currentAudio = null

function stopCurrent() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
}

function playFile(filename) {
  return new Promise((resolve, reject) => {
    stopCurrent()
    const audio = new Audio(BASE + filename + '.mp3')
    audio.preload = 'none'
    currentAudio = audio
    audio.onended = () => { currentAudio = null; resolve() }
    audio.onerror = () => { currentAudio = null; reject(new Error('Audio load failed: ' + filename)) }
    audio.play().catch(reject)
  })
}

function speakFallback(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'ka-GE'
  utt.rate = 0.85
  window.speechSynthesis.speak(utt)
}

export function useVoice() {
  const isBusyRef = useRef(false)

  async function playPrompt(playerName, numberValue) {
    if (isBusyRef.current) stopCurrent()
    isBusyRef.current = true

    const introFile = 'intro_' + playerName.toLowerCase()

    try {
      // Chain: intro → find_number → prompt_{n}
      try {
        await playFile(introFile)
      } catch {
        // Name-specific file missing — use generic
        try { await playFile('intro_generic') } catch { /* ignore */ }
      }

      await playFile('find_number')
      await playFile('prompt_' + numberValue)
    } catch (err) {
      // Fallback to Web Speech if MP3s aren't in place yet (dev mode)
      const num = numberValue
      speakFallback('იპოვე ციფრი ' + num)
    } finally {
      isBusyRef.current = false
    }
  }

  function playFeedback(isCorrect) {
    const pool = isCorrect ? PHRASES.correct : PHRASES.wrong
    const pick = pool[Math.floor(Math.random() * pool.length)]
    playFile(pick).catch(() => {
      speakFallback(isCorrect ? 'ყოჩაღ!' : 'კიდევ სცადე!')
    })
  }

  function playWinner() {
    playFile('winner').catch(() => {
      speakFallback('ბრავო! ყველა ციფრი იპოვე!')
    })
  }

  function stopAll() {
    stopCurrent()
    if (window.speechSynthesis) window.speechSynthesis.cancel()
  }

  return { playPrompt, playFeedback, playWinner, stopAll }
}
