import type { Category } from '../db/schema'
import { IconDisplay } from './IconDisplay'

type Props = {
  categories: Category[]
  activeId: string | null | 'all'
  onChange: (id: string | null | 'all') => void
}

export function CategoryTabs({ categories, activeId, onChange }: Props) {
  const items: { id: string | 'all'; label: string; color: string; icon: string }[] = [
    { id: 'all', label: 'Todos', color: '#0f766e', icon: 'sparkles' },
    ...categories.map((c) => ({
      id: c.id,
      label: c.name,
      color: c.color,
      icon: c.icon,
    })),
  ]

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Categorías"
    >
      {items.map((item) => {
        const active = activeId === item.id
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              active
                ? 'text-white shadow-md'
                : 'bg-white/80 text-brand-800 ring-1 ring-brand-200'
            }`}
            style={active ? { backgroundColor: item.color } : undefined}
          >
            <IconDisplay kind="lucide" value={item.icon} size={18} />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
