import { useEffect } from 'react'
import { celebrateWin } from '../utils/confetti'

export default function WinnerBanner({ playerName, onRestart }) {
  useEffect(() => {
    celebrateWin()
  }, [])

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center gap-6 px-6"
      style={{
        height: '100dvh',
        background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
      }}
    >
      {/* Animated stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute text-2xl"
            style={{
              top: `${Math.random() * 80 + 5}%`,
              left: `${Math.random() * 90 + 5}%`,
              animation: `float ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite alternate`,
              fontSize: 16 + Math.random() * 18,
            }}
          >
            {['⭐', '🌟', '✨', '💫'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      {/* Trophy */}
      <div className="text-8xl" style={{ animation: 'pop 0.5s ease-out' }}>🏆</div>

      {/* Message */}
      <div className="text-center z-10">
        <h1
          className="text-white font-black text-3xl leading-tight mb-2"
          style={{ fontFamily: '"Noto Sans Georgian", sans-serif' }}
        >
          ბრავო, {playerName}!
        </h1>
        <p
          className="text-yellow-300 font-bold text-xl"
          style={{ fontFamily: '"Noto Sans Georgian", sans-serif' }}
        >
          ყველა ციფრი იპოვე! 🎉
        </p>
        <p
          className="text-purple-200 font-bold text-base mt-1"
          style={{ fontFamily: '"Noto Sans Georgian", sans-serif' }}
        >
          შენ ძალიან ჭკვიანი ხარ!
        </p>
      </div>

      {/* Stars row */}
      <div className="flex gap-3 text-4xl z-10">
        {'⭐'.repeat(5).split('').map((s, i) => (
          <span key={i} style={{ animation: `pop 0.4s ease-out ${i * 0.1}s both` }}>{s}</span>
        ))}
      </div>

      {/* Restart button */}
      <button
        onTouchEnd={(e) => { e.preventDefault(); onRestart() }}
        onClick={onRestart}
        className="z-10 px-8 py-4 rounded-3xl text-white font-black text-xl active:scale-95 transition-transform"
        style={{
          fontFamily: '"Noto Sans Georgian", sans-serif',
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          boxShadow: '0 4px 24px rgba(124,58,237,0.5)',
        }}
      >
        კიდევ ერთხელ! 🔄
      </button>
    </div>
  )
}
