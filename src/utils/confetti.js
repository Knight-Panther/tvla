import confetti from 'canvas-confetti'

export function celebrateWin() {
  confetti({ particleCount: 150, spread: 120, origin: { x: 0.5, y: 0.45 } })
  setTimeout(() => {
    confetti({ particleCount: 80, spread: 60, angle: 60,  origin: { x: 0.15, y: 0.5 } })
    confetti({ particleCount: 80, spread: 60, angle: 120, origin: { x: 0.85, y: 0.5 } })
  }, 350)
  setTimeout(() => {
    confetti({ particleCount: 60, spread: 90, origin: { x: 0.5, y: 0.3 } })
  }, 700)
}

export function celebrateCorrect() {
  confetti({ particleCount: 45, spread: 70, scalar: 0.85, origin: { x: 0.5, y: 0.55 } })
}
