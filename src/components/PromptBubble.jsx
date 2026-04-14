import { NUMBERS } from '../data/numbers'

export default function PromptBubble({ targetValue, foundCount, total, onReplay }) {
  const num = NUMBERS.find(n => n.value === targetValue)

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>

      {/* Score */}
      <div className="flex flex-col items-center min-w-[44px]">
        <span className="text-white text-xs font-bold leading-none" style={{ fontFamily: '"Noto Sans Georgian", sans-serif' }}>
          ნაპოვნი
        </span>
        <span className="text-white font-black text-lg leading-none">{foundCount}/{total}</span>
      </div>

      {/* Target — white button, no color overlap with any tile */}
      <button
        onTouchEnd={(e) => { e.preventDefault(); onReplay() }}
        onClick={onReplay}
        className="flex items-center gap-2 rounded-2xl px-4 py-2 active:scale-95 transition-transform"
        style={{ background: 'white', border: '2px solid rgba(255,255,255,0.6)' }}
        aria-label="Replay prompt"
      >
        <span className="font-bold text-lg leading-none" style={{ fontFamily: '"Noto Sans Georgian", sans-serif', color: '#1e1b4b' }}>
          {num?.georgian}
        </span>
        <span className="text-lg">🔊</span>
      </button>

      {/* Right spacer (keep layout balanced) */}
      <div className="min-w-[44px]" />
    </div>
  )
}
