import type { Patient, VoiceSettings } from './schema'
import {
  db,
  ensureSettings,
  savePatient,
  updateSettings,
} from './index'
import { DEFAULT_TEMPLATES, createId } from './templates'

export async function createPatientWithTemplates(input: {
  name: string
  birthDate?: string
  notes?: string
  photo?: Blob
  voice?: VoiceSettings
  gridCols?: 2 | 3 | 4
}): Promise<Patient> {
  const patient: Patient = {
    id: createId(),
    name: input.name.trim(),
    birthDate: input.birthDate,
    notes: input.notes,
    photo: input.photo,
    voice: input.voice ?? { voiceURI: '', rate: 1, pitch: 1 },
    gridCols: input.gridCols ?? 3,
    createdAt: Date.now(),
  }

  await db.transaction('rw', db.patients, db.categories, db.cards, db.settings, async () => {
    await savePatient(patient)

    const categoryIds = new Map<string, string>()
    for (const cat of DEFAULT_TEMPLATES.categories) {
      const id = createId()
      categoryIds.set(cat.name, id)
      await db.categories.add({
        id,
        patientId: patient.id,
        ...cat,
      })
    }

    for (const card of DEFAULT_TEMPLATES.cards) {
      const { categoryName, ...rest } = card
      await db.cards.add({
        id: createId(),
        patientId: patient.id,
        categoryId: categoryName ? categoryIds.get(categoryName) ?? null : null,
        ...rest,
      })
    }

    await ensureSettings()
    await updateSettings({ activePatientId: patient.id })
  })

  return patient
}
