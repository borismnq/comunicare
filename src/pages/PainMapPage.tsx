import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PhraseViewer } from '../components/PhraseViewer'
import { vibrate } from '../lib/haptics'
import { speak } from '../lib/speech'
import { useAppStore } from '../store/useAppStore'

type Zone = {
  id: string
  label: string
  phrase: string
  path: string
}

const ZONES: Zone[] = [
  {
    id: 'head',
    label: 'Cabeza',
    phrase: 'Me duele la cabeza',
    path: 'M140 28c-28 0-48 20-48 48 0 22 14 40 34 46v14h28v-14c20-6 34-24 34-46 0-28-20-48-48-48z',
  },
  {
    id: 'throat',
    label: 'Garganta',
    phrase: 'Me duele la garganta',
    path: 'M126 122h28v22h-28z',
  },
  {
    id: 'chest',
    label: 'Pecho',
    phrase: 'Me duele el pecho',
    path: 'M100 144h80v48H100z',
  },
  {
    id: 'abdomen',
    label: 'Abdomen',
    phrase: 'Me duele el abdomen',
    path: 'M104 192h72v52H104z',
  },
  {
    id: 'left-arm',
    label: 'Brazo izquierdo',
    phrase: 'Me duele el brazo izquierdo',
    path: 'M52 150c-18 8-34 36-36 58l24 8c4-16 14-34 28-42z',
  },
  {
    id: 'right-arm',
    label: 'Brazo derecho',
    phrase: 'Me duele el brazo derecho',
    path: 'M228 150c18 8 34 36 36 58l-24 8c-4-16-14-34-28-42z',
  },
  {
    id: 'left-leg',
    label: 'Pierna izquierda',
    phrase: 'Me duele la pierna izquierda',
    path: 'M110 244h28v90h-28z',
  },
  {
    id: 'right-leg',
    label: 'Pierna derecha',
    phrase: 'Me duele la pierna derecha',
    path: 'M142 244h28v90h-28z',
  },
]

export function PainMapPage() {
  const { activePatient, settings, setLastSpoken } = useAppStore()
  const [activeZone, setActiveZone] = useState<string | null>(null)
  const [phrase, setPhrase] = useState('')
  const lastTap = useRef(0)

  const onZone = async (zone: Zone) => {
    const now = Date.now()
    if (now - lastTap.current < (settings?.tapCooldownMs ?? 700)) return
    lastTap.current = now

    setActiveZone(zone.id)
    setPhrase(zone.phrase)
    setLastSpoken(zone.phrase)
    if (settings?.hapticsEnabled) vibrate(40)
    await speak(zone.phrase, activePatient?.voice)
  }

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-4 p-4 sm:p-6">
      <header className="flex items-center gap-3">
        <Link
          to="/"
          className="rounded-2xl bg-white p-3 text-brand-700 shadow-sm ring-1 ring-brand-100"
          aria-label="Volver"
        >
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-800">
            ¿Dónde te duele?
          </h1>
          <p className="text-sm text-muted">Toca la parte del cuerpo</p>
        </div>
      </header>

      <PhraseViewer text={phrase} />

      <div className="flex flex-1 items-center justify-center rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-brand-100">
        <svg
          viewBox="0 0 280 360"
          className="h-full max-h-[60vh] w-full max-w-md"
          role="img"
          aria-label="Mapa corporal"
        >
          <ellipse cx="140" cy="200" rx="90" ry="130" fill="#ccfbf1" opacity="0.5" />
          {ZONES.map((zone) => (
            <path
              key={zone.id}
              d={zone.path}
              role="button"
              tabIndex={0}
              aria-label={zone.label}
              onClick={() => onZone(zone)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  void onZone(zone)
                }
              }}
              className="cursor-pointer outline-none transition"
              fill={activeZone === zone.id ? '#0f766e' : '#5eead4'}
              stroke="#115e59"
              strokeWidth={3}
              style={{
                filter:
                  activeZone === zone.id
                    ? 'drop-shadow(0 0 8px rgba(15,118,110,0.55))'
                    : undefined,
              }}
            />
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ZONES.map((zone) => (
          <button
            key={`btn-${zone.id}`}
            type="button"
            onClick={() => onZone(zone)}
            className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
              activeZone === zone.id
                ? 'bg-brand-700 text-white'
                : 'bg-white text-brand-800 ring-1 ring-brand-100'
            }`}
          >
            {zone.label}
          </button>
        ))}
      </div>
    </div>
  )
}
