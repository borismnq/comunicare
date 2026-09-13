import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BoardPage } from './pages/BoardPage'
import { CaregiverPage } from './pages/CaregiverPage'
import { PainMapPage } from './pages/PainMapPage'
import { ProfilesPage } from './pages/ProfilesPage'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const init = useAppStore((s) => s.init)
  const settings = useAppStore((s) => s.settings)

  useEffect(() => {
    void init()
  }, [init])

  useEffect(() => {
    document.body.classList.toggle('high-contrast', !!settings?.highContrast)
  }, [settings?.highContrast])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BoardPage />} />
        <Route path="/perfiles" element={<ProfilesPage />} />
        <Route path="/cuidador" element={<CaregiverPage />} />
        <Route path="/dolor" element={<PainMapPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
