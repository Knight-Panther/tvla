import { NUMBERS, TILE_COLORS } from '../data/numbers'

export default function NumberTile({ value, x, y, found, animState, onTap }) {
  const num = NUMBERS.find(n => n.value === value)
  const color = TILE_COLORS[value]

  const animClass = animState === 'shake' ? 'shake' : animState === 'pop' ? 'pop' : ''

  function handleTouchEnd(e) {
    e.preventDefault()
    if (!found) onTap(value)
  }

  return (
    <button
      onTouchEnd={handleTouchEnd}
      onClick={() => { if (!found) onTap(value) }}
      className={`absolute flex flex-col items-center justify-center rounded-2xl shadow-xl select-none cursor-pointer transition-opacity duration-300 ${animClass}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: 72,
        height: 72,
        backgroundColor: color,
        opacity: found ? 0 : 1,
        pointerEvents: found ? 'none' : 'auto',
        border: '3px solid rgba(255,255,255,0.45)',
      }}
      aria-label={num?.georgian}
    >
      <span className="text-white font-black leading-none" style={{ fontSize: 30 }}>
        {value}
      </span>
      <span className="text-white font-bold leading-none mt-0.5" style={{ fontSize: 10, fontFamily: '"Noto Sans Georgian", sans-serif' }}>
        {num?.georgian}
      </span>
    </button>
  )
}
