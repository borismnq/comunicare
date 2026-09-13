export function vibrate(pattern: number | number[] = 30): void {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern)
    } catch {
      // ignore unsupported environments
    }
  }
}
