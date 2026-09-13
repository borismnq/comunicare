type Props = {
  text: string
}

export function PhraseViewer({ text }: Props) {
  return (
    <div
      className="min-h-[4.5rem] rounded-3xl bg-white/85 px-5 py-4 text-center shadow-sm ring-1 ring-brand-100 backdrop-blur"
      aria-live="polite"
      aria-atomic="true"
    >
      {text ? (
        <p
          key={text}
          className="phrase-pop font-display text-2xl font-extrabold text-brand-800 sm:text-3xl"
        >
          {text}
        </p>
      ) : (
        <p className="text-lg text-muted">Toca un botón para hablar</p>
      )}
    </div>
  )
}
