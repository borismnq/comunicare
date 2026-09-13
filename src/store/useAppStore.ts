import { create } from 'zustand'
import type { AppSettings, Card, Category, Patient } from '../db/schema'
import {
  ensureSettings,
  getCards,
  getCategories,
  getPatient,
  getPatients,
  updateSettings,
} from '../db'

type AppState = {
  ready: boolean
  settings: AppSettings | null
  patients: Patient[]
  activePatient: Patient | null
  categories: Category[]
  cards: Card[]
  activeCategoryId: string | null | 'all'
  lastSpoken: string
  caregiverUnlocked: boolean
  unlockExpiresAt: number | null
  init: () => Promise<void>
  refreshPatients: () => Promise<void>
  setActivePatient: (id: string) => Promise<void>
  reloadBoard: () => Promise<void>
  setActiveCategory: (id: string | null | 'all') => void
  setLastSpoken: (text: string) => void
  unlockCaregiver: () => void
  lockCaregiver: () => void
  patchSettings: (patch: Partial<Omit<AppSettings, 'id'>>) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  ready: false,
  settings: null,
  patients: [],
  activePatient: null,
  categories: [],
  cards: [],
  activeCategoryId: 'all',
  lastSpoken: '',
  caregiverUnlocked: false,
  unlockExpiresAt: null,

  init: async () => {
    const settings = await ensureSettings()
    const patients = await getPatients()
    let activePatient: Patient | null = null
    if (settings.activePatientId) {
      activePatient = (await getPatient(settings.activePatientId)) ?? null
    }
    if (!activePatient && patients[0]) {
      activePatient = patients[0]
      await updateSettings({ activePatientId: activePatient.id })
      settings.activePatientId = activePatient.id
    }

    let categories: Category[] = []
    let cards: Card[] = []
    if (activePatient) {
      categories = await getCategories(activePatient.id)
      cards = await getCards(activePatient.id)
    }

    set({
      ready: true,
      settings,
      patients,
      activePatient,
      categories,
      cards,
      activeCategoryId: 'all',
    })
  },

  refreshPatients: async () => {
    const patients = await getPatients()
    set({ patients })
  },

  setActivePatient: async (id: string) => {
    const patient = await getPatient(id)
    if (!patient) return
    await updateSettings({ activePatientId: id })
    const categories = await getCategories(id)
    const cards = await getCards(id)
    const settings = await ensureSettings()
    set({
      activePatient: patient,
      categories,
      cards,
      settings,
      activeCategoryId: 'all',
      lastSpoken: '',
      caregiverUnlocked: false,
    })
  },

  reloadBoard: async () => {
    const { activePatient } = get()
    if (!activePatient) return
    const patient = (await getPatient(activePatient.id)) ?? activePatient
    const categories = await getCategories(patient.id)
    const cards = await getCards(patient.id)
    set({ activePatient: patient, categories, cards })
  },

  setActiveCategory: (id) => set({ activeCategoryId: id }),
  setLastSpoken: (text) => set({ lastSpoken: text }),

  unlockCaregiver: () =>
    set({
      caregiverUnlocked: true,
      unlockExpiresAt: Date.now() + 15 * 60 * 1000,
    }),

  lockCaregiver: () =>
    set({ caregiverUnlocked: false, unlockExpiresAt: null }),

  patchSettings: async (patch) => {
    const settings = await updateSettings(patch)
    set({ settings })
  },
}))
