import { useReducer, useCallback } from 'react'
import { NUMBERS, TILE_COLORS } from '../data/numbers'

// Generates non-overlapping (x, y) percentage positions for 11 tiles.
// Safe zones: top 18% (prompt bubble), bottom 6% (iOS home bar).
// Tiles are centered at (x%, y%) so keep x in [8, 92], y in [20, 92].
function generatePositions() {
  const positions = []
  const MIN_DIST = 18   // percent
  const MIN_DIST_RELAXED = 12

  const rand = (min, max) => Math.random() * (max - min) + min

  for (let i = 0; i < NUMBERS.length; i++) {
    let placed = false
    for (let attempt = 0; attempt < 80; attempt++) {
      const minDist = attempt < 50 ? MIN_DIST : MIN_DIST_RELAXED
      const x = rand(8, 92)
      const y = rand(20, 92)
      const tooClose = positions.some(p => {
        const dx = p.x - x
        const dy = p.y - y
        return Math.sqrt(dx * dx + dy * dy) < minDist
      })
      if (!tooClose) {
        positions.push({ x: Math.round(x), y: Math.round(y) })
        placed = true
        break
      }
    }
    if (!placed) {
      positions.push({ x: Math.round(rand(8, 92)), y: Math.round(rand(20, 92)) })
    }
  }
  return positions
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildInitialTiles() {
  const positions = generatePositions()
  const colors = shuffle(TILE_COLORS)  // randomize colors every game
  return NUMBERS.map((num, i) => ({
    value: num.value,
    x: positions[i].x,
    y: positions[i].y,
    color: colors[i],
    found: false,
    animState: 'idle',
  }))
}

const INITIAL_STATE = {
  phase: 'welcome',
  playerName: '',
  tiles: [],
  targetValue: null,
  remaining: [],
  foundCount: 0,
}

function pickNext(remaining) {
  const idx = Math.floor(Math.random() * remaining.length)
  return { target: remaining[idx], rest: remaining.filter((_, i) => i !== idx) }
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      const tiles = buildInitialTiles()
      const allValues = NUMBERS.map(n => n.value)
      const { target, rest } = pickNext(allValues)
      return {
        phase: 'playing',
        playerName: action.name,
        tiles,
        targetValue: target,
        remaining: rest,
        foundCount: 0,
      }
    }

    case 'TAP_CORRECT': {
      const tiles = state.tiles.map(t =>
        t.value === action.value ? { ...t, found: true, animState: 'pop' } : t
      )
      const foundCount = state.foundCount + 1
      if (state.remaining.length === 0) {
        return { ...state, tiles, foundCount, phase: 'winner' }
      }
      const { target, rest } = pickNext(state.remaining)
      return { ...state, tiles, foundCount, targetValue: target, remaining: rest }
    }

    case 'TAP_WRONG': {
      const tiles = state.tiles.map(t =>
        t.value === action.value ? { ...t, animState: 'shake' } : t
      )
      return { ...state, tiles }
    }

    case 'CLEAR_ANIM': {
      const tiles = state.tiles.map(t =>
        t.value === action.value ? { ...t, animState: 'idle' } : t
      )
      return { ...state, tiles }
    }

    case 'RESTART':
      return INITIAL_STATE

    default:
      return state
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const startGame = useCallback((name) => {
    dispatch({ type: 'START_GAME', name: name.trim() || 'მეგობარო' })
  }, [])

  const tapTile = useCallback((value) => {
    if (state.phase !== 'playing') return false
    const tile = state.tiles.find(t => t.value === value)
    if (!tile || tile.found) return false

    const isCorrect = value === state.targetValue
    if (isCorrect) {
      dispatch({ type: 'TAP_CORRECT', value })
      setTimeout(() => dispatch({ type: 'CLEAR_ANIM', value }), 350)
    } else {
      dispatch({ type: 'TAP_WRONG', value })
      setTimeout(() => dispatch({ type: 'CLEAR_ANIM', value }), 450)
    }
    return isCorrect
  }, [state])

  const restartGame = useCallback(() => {
    dispatch({ type: 'RESTART' })
  }, [])

  return { state, startGame, tapTile, restartGame }
}
