export type VoiceSettings = {
  voiceURI: string
  rate: number
  pitch: number
}

export type Patient = {
  id: string
  name: string
  photo?: Blob
  birthDate?: string
  notes?: string
  voice: VoiceSettings
  gridCols: 2 | 3 | 4
  createdAt: number
}

export type Category = {
  id: string
  patientId: string
  name: string
  color: string
  icon: string
  order: number
}

export type CardIconKind = 'lucide' | 'emoji' | 'photo'

export type Card = {
  id: string
  patientId: string
  categoryId: string | null
  label: string
  speechText?: string
  iconKind: CardIconKind
  iconValue: string
  photo?: Blob
  color: string
  order: number
  isPainMap?: boolean
}

export type AppSettings = {
  id: 'singleton'
  pinHash?: string
  activePatientId?: string
  highContrast: boolean
  hapticsEnabled: boolean
  tapCooldownMs: number
}
