import { useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Settings2, Users } from 'lucide-react'
import { CardButton } from '../components/CardButton'
import { CategoryTabs } from '../components/CategoryTabs'
import { PhraseViewer } from '../components/PhraseViewer'
import type { Card } from '../db/schema'
import { vibrate } from '../lib/haptics'
import { speak } from '../lib/speech'
import { useAppStore } from '../store/useAppStore'

export function BoardPage() {
  const navigate = useNavigate()
  const lastTapAt = useRef(0)
  const {
    ready,
    activePatient,
    categories,
    cards,
    activeCategoryId,
    lastSpoken,
    settings,
    setActiveCategory,
    setLastSpoken,
  } = useAppStore()

  const visibleCards = useMemo(() => {
    if (activeCategoryId === 'all') return cards
    return cards.filter((c) => c.categoryId === activeCategoryId)
  }, [cards, activeCategoryId])

  const gridCols = activePatient?.gridCols ?? 3
  const gridClass =
    gridCols === 2
      ? 'grid-cols-2'
      : gridCols === 4
        ? 'grid-cols-2 sm:grid-cols-4'
        : 'grid-cols-2 sm:grid-cols-3'

  const onActivate = async (card: Card) => {
    const now = Date.now()
    const cooldown = settings?.tapCooldownMs ?? 700
    if (now - lastTapAt.current < cooldown) return
    lastTapAt.current = now

    if (settings?.hapticsEnabled) vibrate(35)

    const text = card.speechText?.trim() || card.label
    setLastSpoken(text)

    if (card.isPainMap) {
      await speak(text, activePatient?.voice)
      navigate('/dolor')
      return
    }

    await speak(text, activePatient?.voice)
  }

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center text-brand-700">
        Cargando ComuniCare…
      </div>
    )
  }

  if (!activePatient) {
    return (
      <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-brand-800">
          ComuniCare
        </h1>
        <p className="text-muted">
          Crea el primer perfil de paciente para empezar a comunicarte.
        </p>
        <Link
          to="/perfiles"
          className="rounded-2xl bg-brand-700 px-6 py-3 font-semibold text-white"
        >
          Crear paciente
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col gap-4 overflow-hidden p-3 sm:p-5">
      <header className="flex shrink-0 items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            ComuniCare
          </p>
          <h1 className="font-display text-xl font-extrabold text-brand-800 sm:text-2xl">
            {activePatient.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dolor"
            className="rounded-2xl bg-white/80 p-3 text-brand-700 shadow-sm ring-1 ring-brand-100"
            aria-label="Mapa de dolor"
          >
            <MapPin size={22} />
          </Link>
          <Link
            to="/perfiles"
            className="rounded-2xl bg-white/80 p-3 text-brand-700 shadow-sm ring-1 ring-brand-100"
            aria-label="Perfiles"
          >
            <Users size={22} />
          </Link>
          <Link
            to="/cuidador"
            className="rounded-2xl bg-brand-700 p-3 text-white shadow-sm"
            aria-label="Área del cuidador"
          >
            <Settings2 size={22} />
          </Link>
        </div>
      </header>

      <div className="shrink-0">
        <PhraseViewer text={lastSpoken} />
      </div>

      <div className="z-20 shrink-0 bg-brand-50/90 pb-1 backdrop-blur-sm">
        <CategoryTabs
          categories={categories}
          activeId={activeCategoryId}
          onChange={setActiveCategory}
        />
      </div>

      <div
        className={`grid min-h-0 flex-1 content-start gap-3 overflow-y-auto overscroll-contain ${gridClass} pb-4`}
      >
        {visibleCards.map((card) => (
          <CardButton key={card.id} card={card} onActivate={onActivate} />
        ))}
        {visibleCards.length === 0 ? (
          <p className="col-span-full rounded-2xl bg-white/70 p-6 text-center text-muted">
            No hay botones en esta categoría. El cuidador puede agregarlos.
          </p>
        ) : null}
      </div>
    </div>
  )
}
