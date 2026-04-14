import { useState } from 'react'
import { NUMBERS, TILE_COLORS } from '../data/numbers'

// A few decorative numbers scattered in the background
const DECO = [
  { value: 3, top: '12%', left: '8%',  size: 64, rotate: -15 },
  { value: 7, top: '10%', right: '6%', size: 56, rotate: 12  },
  { value: 1, top: '55%', left: '4%',  size: 52, rotate: -8  },
  { value: 9, top: '60%', right: '5%', size: 60, rotate: 18  },
  { value: 5, top: '80%', left: '30%', size: 48, rotate: -5  },
]

export default function WelcomeScreen({ onStart }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (name.trim()) onStart(name.trim())
  }

  return (
    <div className="relative w-full flex flex-col items-center justify-center gap-6 overflow-hidden"
      style={{ height: '100dvh', background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>

      {/* Decorative background tiles */}
      {DECO.map((d, i) => (
        <div key={i} className="absolute flex items-center justify-center rounded-2xl opacity-25 pointer-events-none"
          style={{
            top: d.top, left: d.left, right: d.right,
            width: d.size, height: d.size,
            backgroundColor: TILE_COLORS[d.value],
            transform: `rotate(${d.rotate}deg)`,
          }}>
          <span className="text-white font-black" style={{ fontSize: d.size * 0.45 }}>{d.value}</span>
        </div>
      ))}

      {/* Main card */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 py-8 rounded-3xl mx-4"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', maxWidth: 360, width: '100%' }}>

        <div className="text-6xl">🔢</div>

        <h1 className="text-white font-black text-4xl text-center leading-tight"
          style={{ fontFamily: '"Noto Sans Georgian", sans-serif' }}>
          ციფრები
        </h1>

        <p className="text-purple-200 text-center text-sm font-bold"
          style={{ fontFamily: '"Noto Sans Georgian", sans-serif' }}>
          შეიყვანე შენი სახელი და დავიწყოთ!
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="სახელი..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="words"
            spellCheck="false"
            className="w-full text-center text-xl font-bold rounded-2xl px-4 py-3 outline-none bg-white/15 text-white placeholder-white/40 border border-white/20 focus:border-white/50"
            style={{ fontFamily: '"Noto Sans Georgian", sans-serif' }}
          />

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 rounded-2xl text-white font-black text-xl transition-all active:scale-95 disabled:opacity-40"
            style={{
              fontFamily: '"Noto Sans Georgian", sans-serif',
              background: name.trim()
                ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
                : 'rgba(255,255,255,0.2)',
            }}
          >
            თამაში! 🎮
          </button>
        </form>
      </div>

      {/* Number row at the bottom as decoration */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {[0,1,2,3,4,5,6,7,8,9,10].map(v => (
          <div key={v} className="flex items-center justify-center rounded-xl opacity-60"
            style={{ width: 26, height: 26, backgroundColor: TILE_COLORS[v] }}>
            <span className="text-white font-black text-xs">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
