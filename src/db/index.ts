import Dexie, { type EntityTable } from 'dexie'
import type { AppSettings, Card, Category, Patient } from './schema'

export class ComuniCareDB extends Dexie {
  patients!: EntityTable<Patient, 'id'>
  categories!: EntityTable<Category, 'id'>
  cards!: EntityTable<Card, 'id'>
  settings!: EntityTable<AppSettings, 'id'>

  constructor() {
    super('comunicare')
    this.version(1).stores({
      patients: 'id, name, createdAt',
      categories: 'id, patientId, order',
      cards: 'id, patientId, categoryId, order',
      settings: 'id',
    })
  }
}

export const db = new ComuniCareDB()

export async function ensureSettings(): Promise<AppSettings> {
  const existing = await db.settings.get('singleton')
  if (existing) return existing
  const defaults: AppSettings = {
    id: 'singleton',
    highContrast: false,
    hapticsEnabled: true,
    tapCooldownMs: 700,
  }
  await db.settings.put(defaults)
  return defaults
}

export async function updateSettings(
  patch: Partial<Omit<AppSettings, 'id'>>,
): Promise<AppSettings> {
  const current = await ensureSettings()
  const next: AppSettings = { ...current, ...patch, id: 'singleton' }
  if ('pinHash' in patch && patch.pinHash === undefined) {
    delete next.pinHash
  }
  await db.settings.put(next)
  return next
}

export async function getPatients(): Promise<Patient[]> {
  return db.patients.orderBy('createdAt').reverse().toArray()
}

export async function getPatient(id: string): Promise<Patient | undefined> {
  return db.patients.get(id)
}

export async function savePatient(patient: Patient): Promise<void> {
  await db.patients.put(patient)
}

export async function deletePatient(id: string): Promise<void> {
  await db.transaction('rw', db.patients, db.categories, db.cards, db.settings, async () => {
    await db.categories.where('patientId').equals(id).delete()
    await db.cards.where('patientId').equals(id).delete()
    await db.patients.delete(id)
    const settings = await ensureSettings()
    if (settings.activePatientId === id) {
      const remaining = await db.patients.orderBy('createdAt').reverse().first()
      await updateSettings({ activePatientId: remaining?.id })
    }
  })
}

export async function getCategories(patientId: string): Promise<Category[]> {
  return db.categories.where('patientId').equals(patientId).sortBy('order')
}

export async function saveCategory(category: Category): Promise<void> {
  await db.categories.put(category)
}

export async function deleteCategory(id: string): Promise<void> {
  await db.transaction('rw', db.categories, db.cards, async () => {
    await db.cards.where('categoryId').equals(id).modify({ categoryId: null })
    await db.categories.delete(id)
  })
}

export async function getCards(patientId: string): Promise<Card[]> {
  return db.cards.where('patientId').equals(patientId).sortBy('order')
}

export async function getCardsByCategory(
  patientId: string,
  categoryId: string | null,
): Promise<Card[]> {
  const all = await getCards(patientId)
  if (categoryId === null) return all
  return all.filter((c) => c.categoryId === categoryId)
}

export async function saveCard(card: Card): Promise<void> {
  await db.cards.put(card)
}

export async function deleteCard(id: string): Promise<void> {
  await db.cards.delete(id)
}

export async function reorderCards(orderedIds: string[]): Promise<void> {
  await db.transaction('rw', db.cards, async () => {
    for (let i = 0; i < orderedIds.length; i++) {
      await db.cards.update(orderedIds[i], { order: i })
    }
  })
}
