import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, UserRound } from 'lucide-react'
import { createPatientWithTemplates } from '../db/patients'
import { deletePatient, savePatient } from '../db'
import type { Patient } from '../db/schema'
import { getPreferredVoiceURI } from '../lib/speech'
import { useAppStore } from '../store/useAppStore'

function PatientPhoto({ photo, name }: { photo?: Blob; name: string }) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!photo) {
      setUrl(null)
      return
    }
    const u = URL.createObjectURL(photo)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [photo])

  if (url) {
    return (
      <img
        src={url}
        alt=""
        className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white"
      />
    )
  }
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
      <UserRound size={28} />
      <span className="sr-only">{name}</span>
    </div>
  )
}

export function ProfilesPage() {
  const { patients, activePatient, refreshPatients, setActivePatient, init } =
    useAppStore()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Patient | null>(null)
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState<Blob | undefined>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const resetForm = () => {
    setName('')
    setBirthDate('')
    setNotes('')
    setPhoto(undefined)
    setError('')
    setCreating(false)
    setEditing(null)
  }

  const openEdit = (patient: Patient) => {
    setEditing(patient)
    setCreating(false)
    setName(patient.name)
    setBirthDate(patient.birthDate ?? '')
    setNotes(patient.notes ?? '')
    setPhoto(patient.photo)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('El nombre es obligatorio')
      return
    }
    setBusy(true)
    setError('')
    try {
      if (editing) {
        await savePatient({
          ...editing,
          name: name.trim(),
          birthDate: birthDate || undefined,
          notes: notes || undefined,
          photo,
        })
        await refreshPatients()
        if (activePatient?.id === editing.id) {
          await setActivePatient(editing.id)
        }
      } else {
        const voiceURI = await getPreferredVoiceURI()
        const patient = await createPatientWithTemplates({
          name,
          birthDate: birthDate || undefined,
          notes: notes || undefined,
          photo,
          voice: { voiceURI, rate: 1, pitch: 1 },
        })
        await refreshPatients()
        await setActivePatient(patient.id)
      }
      resetForm()
      await init()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar')
    } finally {
      setBusy(false)
    }
  }

  const onDelete = async (patient: Patient) => {
    if (
      !confirm(
        `¿Eliminar el perfil de ${patient.name}? Se borrarán todos sus botones.`,
      )
    ) {
      return
    }
    await deletePatient(patient.id)
    await init()
  }

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-4 overflow-auto p-4 sm:p-6">
      <header className="flex items-center gap-3">
        <Link
          to="/"
          className="rounded-2xl bg-white p-3 text-brand-700 shadow-sm ring-1 ring-brand-100"
          aria-label="Volver al tablero"
        >
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-800">
            Perfiles
          </h1>
          <p className="text-sm text-muted">
            Gestiona varios pacientes desde la misma app
          </p>
        </div>
      </header>

      <ul className="space-y-3">
        {patients.map((patient) => {
          const active = activePatient?.id === patient.id
          return (
            <li
              key={patient.id}
              className={`flex items-center gap-3 rounded-3xl bg-white/90 p-3 shadow-sm ring-1 ${
                active ? 'ring-brand-500' : 'ring-brand-100'
              }`}
            >
              <PatientPhoto photo={patient.photo} name={patient.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-bold text-brand-800">
                  {patient.name}
                </p>
                {patient.notes ? (
                  <p className="truncate text-sm text-muted">{patient.notes}</p>
                ) : (
                  <p className="text-sm text-muted">
                    {active ? 'Paciente activo' : 'Toca para activar'}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {!active ? (
                  <button
                    type="button"
                    onClick={() => setActivePatient(patient.id)}
                    className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Usar
                  </button>
                ) : (
                  <span className="rounded-xl bg-brand-100 px-3 py-2 text-center text-sm font-semibold text-brand-800">
                    Activo
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => openEdit(patient)}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(patient)}
                  className="rounded-xl bg-red-50 px-3 py-2 text-red-600"
                  aria-label={`Eliminar ${patient.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      {!creating && !editing ? (
        <button
          type="button"
          onClick={() => {
            resetForm()
            setCreating(true)
          }}
          className="flex items-center justify-center gap-2 rounded-3xl bg-brand-700 px-4 py-4 font-semibold text-white"
        >
          <Plus size={20} />
          Nuevo paciente
        </button>
      ) : (
        <form
          onSubmit={onSubmit}
          className="space-y-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-brand-100"
        >
          <h2 className="font-display text-xl font-bold text-brand-800">
            {editing ? 'Editar paciente' : 'Nuevo paciente'}
          </h2>
          <label className="block text-sm font-semibold">
            Nombre
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-brand-200 px-4 py-3"
              required
            />
          </label>
          <label className="block text-sm font-semibold">
            Fecha de nacimiento
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-brand-200 px-4 py-3"
            />
          </label>
          <label className="block text-sm font-semibold">
            Notas (alergias, contacto, condición)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-2xl border border-brand-200 px-4 py-3"
            />
          </label>
          <label className="block text-sm font-semibold">
            Foto
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0]
                setPhoto(file)
              }}
            />
          </label>
          {error ? (
            <p className="text-sm font-semibold text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 rounded-2xl bg-brand-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
            >
              {busy ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
