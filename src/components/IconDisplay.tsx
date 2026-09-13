import { useEffect, useState } from 'react'
import { LUCIDE_ICONS } from '../lib/icons'
import type { CardIconKind } from '../db/schema'

type Props = {
  kind: CardIconKind
  value: string
  photo?: Blob
  size?: number
  className?: string
}

export function IconDisplay({
  kind,
  value,
  photo,
  size = 48,
  className = '',
}: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (kind !== 'photo' || !photo) {
      setPhotoUrl(null)
      return
    }
    const url = URL.createObjectURL(photo)
    setPhotoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [kind, photo])

  if (kind === 'emoji') {
    return (
      <span
        className={`leading-none select-none ${className}`}
        style={{ fontSize: size }}
        aria-hidden
      >
        {value}
      </span>
    )
  }

  if (kind === 'photo') {
    if (!photoUrl) {
      return (
        <span className={`text-white/80 ${className}`} style={{ fontSize: size * 0.5 }}>
          📷
        </span>
      )
    }
    return (
      <img
        src={photoUrl}
        alt=""
        className={`rounded-xl object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  const Icon = LUCIDE_ICONS[value]
  if (!Icon) {
    return (
      <span className={className} style={{ fontSize: size * 0.6 }} aria-hidden>
        ●
      </span>
    )
  }
  return <Icon size={size} strokeWidth={2.25} className={className} aria-hidden />
}
