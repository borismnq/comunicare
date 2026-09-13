import { useState, type FormEvent } from 'react'
import { isValidPin, verifyPin } from '../lib/pin'

type Props = {
  pinHash?: string
  onSuccess: () => void
  onCancel: () => void
  title?: string
}

export function PinGate({
  pinHash,
  onSuccess,
  onCancel,
  title = 'Área del cuidador',
}: Props) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!pinHash) {
      onSuccess()
      return
    }

    if (!isValidPin(pin)) {
      setError('El PIN debe tener 4 a 6 dígitos')
      return
    }

    const ok = await verifyPin(pin, pinHash)
    if (!ok) {
      setError('PIN incorrecto')
      setPin('')
      return
    }
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-800/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl"
      >
        <h2 className="font-display text-2xl font-extrabold text-brand-800">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {pinHash
            ? 'Introduce el PIN para editar botones y perfiles.'
            : 'Aún no hay PIN. Puedes configurar uno en Ajustes.'}
        </p>

        {pinHash ? (
          <label className="mt-5 block">
            <span className="sr-only">PIN</span>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\\d{4,6}"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\\D/g, ''))}
              className="w-full rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:ring-2 focus:ring-brand-500"
              autoFocus
            />
          </label>
        ) : null}

        {error ? (
          <p className="mt-3 text-sm font-semibold text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 font-semibold text-slate-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 rounded-2xl bg-brand-700 px-4 py-3 font-semibold text-white"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  )
}
