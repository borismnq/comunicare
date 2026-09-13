import type { Card, Category } from './schema'

export type TemplateSeed = {
  categories: Omit<Category, 'id' | 'patientId'>[]
  cards: (Omit<Card, 'id' | 'patientId' | 'categoryId'> & {
    categoryName: string | null
  })[]
}

export const DEFAULT_TEMPLATES: TemplateSeed = {
  categories: [
    { name: 'Necesidades', color: '#0d9488', icon: 'heart-pulse', order: 0 },
    { name: 'Emociones', color: '#db2777', icon: 'smile', order: 1 },
    { name: 'Actividades', color: '#2563eb', icon: 'sparkles', order: 2 },
    { name: 'Básicos', color: '#64748b', icon: 'message-circle', order: 3 },
  ],
  cards: [
    // Necesidades
    {
      categoryName: 'Necesidades',
      label: 'Tengo hambre',
      iconKind: 'emoji',
      iconValue: '🍽️',
      color: '#14b8a6',
      order: 0,
    },
    {
      categoryName: 'Necesidades',
      label: 'Tengo sed',
      iconKind: 'emoji',
      iconValue: '💧',
      color: '#0ea5e9',
      order: 1,
    },
    {
      categoryName: 'Necesidades',
      label: 'Tengo sueño',
      iconKind: 'emoji',
      iconValue: '😴',
      color: '#6366f1',
      order: 2,
    },
    {
      categoryName: 'Necesidades',
      label: 'Quiero ir al baño',
      iconKind: 'emoji',
      iconValue: '🚽',
      color: '#78716c',
      order: 3,
    },
    {
      categoryName: 'Necesidades',
      label: 'Me duele algo',
      speechText: 'Me duele algo',
      iconKind: 'emoji',
      iconValue: '🩹',
      color: '#ef4444',
      order: 4,
      isPainMap: true,
    },
    // Emociones
    {
      categoryName: 'Emociones',
      label: 'Estoy triste',
      iconKind: 'emoji',
      iconValue: '😢',
      color: '#3b82f6',
      order: 5,
    },
    {
      categoryName: 'Emociones',
      label: 'Estoy contento',
      iconKind: 'emoji',
      iconValue: '😊',
      color: '#eab308',
      order: 6,
    },
    {
      categoryName: 'Emociones',
      label: 'Tengo miedo',
      iconKind: 'emoji',
      iconValue: '😨',
      color: '#8b5cf6',
      order: 7,
    },
    {
      categoryName: 'Emociones',
      label: 'Estoy incómodo',
      iconKind: 'emoji',
      iconValue: '😣',
      color: '#f97316',
      order: 8,
    },
    // Actividades
    {
      categoryName: 'Actividades',
      label: 'Quiero ver TV',
      iconKind: 'emoji',
      iconValue: '📺',
      color: '#2563eb',
      order: 9,
    },
    {
      categoryName: 'Actividades',
      label: 'Quiero escuchar música',
      iconKind: 'emoji',
      iconValue: '🎵',
      color: '#ec4899',
      order: 10,
    },
    {
      categoryName: 'Actividades',
      label: 'Quiero salir a pasear',
      iconKind: 'emoji',
      iconValue: '🚶',
      color: '#16a34a',
      order: 11,
    },
    {
      categoryName: 'Actividades',
      label: 'Quiero estar solo',
      iconKind: 'emoji',
      iconValue: '🧘',
      color: '#64748b',
      order: 12,
    },
    {
      categoryName: 'Actividades',
      label: 'Quiero compañía',
      iconKind: 'emoji',
      iconValue: '🤝',
      color: '#0d9488',
      order: 13,
    },
    // Básicos
    {
      categoryName: 'Básicos',
      label: 'Sí',
      iconKind: 'emoji',
      iconValue: '👍',
      color: '#22c55e',
      order: 14,
    },
    {
      categoryName: 'Básicos',
      label: 'No',
      iconKind: 'emoji',
      iconValue: '👎',
      color: '#ef4444',
      order: 15,
    },
    {
      categoryName: 'Básicos',
      label: 'Gracias',
      iconKind: 'emoji',
      iconValue: '🙏',
      color: '#0d9488',
      order: 16,
    },
    {
      categoryName: 'Básicos',
      label: 'Ayuda',
      iconKind: 'emoji',
      iconValue: '🆘',
      color: '#dc2626',
      order: 17,
    },
  ],
}

export function createId(): string {
  return crypto.randomUUID()
}
