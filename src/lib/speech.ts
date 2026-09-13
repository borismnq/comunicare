export type SpeakOptions = {
  voiceURI?: string
  rate?: number
  pitch?: number
  lang?: string
}

export type AppVoice = {
  voiceURI: string
  name: string
  lang: string
  localService: boolean
}

function isSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isSupported()) return Promise.resolve([])

  const existing = window.speechSynthesis.getVoices()
  if (existing.length > 0) return Promise.resolve(existing)

  return new Promise((resolve) => {
    const handle = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handle)
      resolve(window.speechSynthesis.getVoices())
    }
    window.speechSynthesis.addEventListener('voiceschanged', handle)
    // Fallback if voiceschanged never fires
    window.setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handle)
      resolve(window.speechSynthesis.getVoices())
    }, 1500)
  })
}

export async function getSpanishVoices(): Promise<AppVoice[]> {
  const voices = await loadVoices()
  const spanish = voices
    .filter((v) => v.lang.toLowerCase().startsWith('es'))
    .map((v) => ({
      voiceURI: v.voiceURI,
      name: v.name,
      lang: v.lang,
      localService: v.localService,
    }))

  spanish.sort((a, b) => {
    if (a.localService !== b.localService) return a.localService ? -1 : 1
    return a.name.localeCompare(b.name, 'es')
  })

  return spanish
}

export async function getPreferredVoiceURI(): Promise<string> {
  const voices = await getSpanishVoices()
  return voices[0]?.voiceURI ?? ''
}

export async function speak(text: string, options: SpeakOptions = {}): Promise<void> {
  if (!isSupported() || !text.trim()) return

  const voices = await loadVoices()
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text.trim())
  utterance.lang = options.lang ?? 'es-ES'
  utterance.rate = options.rate ?? 1
  utterance.pitch = options.pitch ?? 1

  if (options.voiceURI) {
    const match = voices.find((v) => v.voiceURI === options.voiceURI)
    if (match) utterance.voice = match
  } else {
    const spanish = voices
      .filter((v) => v.lang.toLowerCase().startsWith('es'))
      .sort((a, b) => Number(b.localService) - Number(a.localService))
    if (spanish[0]) {
      utterance.voice = spanish[0]
      utterance.lang = spanish[0].lang
    }
  }

  return new Promise((resolve) => {
    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()
    window.speechSynthesis.speak(utterance)
  })
}

export function stopSpeaking(): void {
  if (isSupported()) window.speechSynthesis.cancel()
}

export function hasSpeechSupport(): boolean {
  return isSupported()
}
