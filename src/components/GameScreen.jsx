import NumberTile from './NumberTile'
import PromptBubble from './PromptBubble'
import { NUMBERS } from '../data/numbers'

export default function GameScreen({ state, onTap, onReplay }) {
  const { tiles, targetValue, foundCount } = state

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        height: '100dvh',
        background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      }}
    >
      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Prompt bubble */}
      {targetValue != null && (
        <PromptBubble
          targetValue={targetValue}
          foundCount={foundCount}
          total={NUMBERS.length}
          onReplay={onReplay}
        />
      )}

      {/* Number tiles */}
      {tiles.map(tile => (
        <NumberTile
          key={tile.value}
          value={tile.value}
          x={tile.x}
          y={tile.y}
          color={tile.color}
          found={tile.found}
          animState={tile.animState}
          onTap={onTap}
        />
      ))}
    </div>
  )
}
