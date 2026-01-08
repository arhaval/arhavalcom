import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard.jsx'
import PredictionsAdmin from './pages/PredictionsAdmin.jsx'
import PredictionPage from './pages/PredictionPage.jsx'
import PredictionOverlay from './pages/PredictionOverlay.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Leaderboard from './pages/Leaderboard.jsx'

// Live App - Tahmin Sistemi için ana uygulama
function LiveApp() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/leaderboard" replace />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/predictions" element={<PredictionsAdmin />} />
      <Route path="/eflive" element={<PredictionPage />} />
      <Route path="/overlay" element={<PredictionOverlay />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </Routes>
  )
}

export default LiveApp




