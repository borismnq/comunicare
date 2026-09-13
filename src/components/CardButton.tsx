import { useRef, useState } from 'react'
import type { Card } from '../db/schema'
import { IconDisplay } from './IconDisplay'

type Props = {
  card: Card
  disabled?: boolean
  onActivate: (card: Card) => void
}

function contrastText(bg: string): string {
  const hex = bg.replace('#', '')
  if (hex.length !== 6) return '#ffffff'
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.62 ? '#134e4a' : '#ffffff'
}

export function CardButton({ card, disabled, onActivate }: Props) {
  const [pressed, setPressed] = useState(false)
  const timer = useRef<number | null>(null)
  const textColor = contrastText(card.color)

  const handle = () => {
    if (disabled) return
    setPressed(true)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setPressed(false), 180)
    onActivate(card)
  }

  return (
    <button
      type="button"
      className={`card-btn relative flex flex-col items-center justify-center gap-2 rounded-3xl px-3 py-4 text-center shadow-md ${
        pressed ? 'is-pressed speak-pulse' : ''
      }`}
      style={{
        backgroundColor: card.color,
        color: textColor,
        boxShadow: `0 10px 24px -12px ${card.color}aa`,
      }}
      aria-label={card.label}
      disabled={disabled}
      onClick={handle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handle()
        }
      }}
    >
      <IconDisplay
        kind={card.iconKind}
        value={card.iconValue}
        photo={card.photo}
        size={52}
      />
      <span className="font-display text-base font-800 leading-tight sm:text-lg font-extrabold">
        {card.label}
      </span>
    </button>
  )
}
