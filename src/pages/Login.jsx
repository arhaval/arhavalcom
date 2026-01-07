import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.username.trim() || !formData.password) {
      setError('Kullanıcı adı ve şifre gerekli!')
      return
    }

    // Check user
    const users = JSON.parse(localStorage.getItem('arhaval_users') || '[]')
    const user = users.find(u => 
      u.username.toLowerCase() === formData.username.toLowerCase() &&
      u.password === formData.password // In production, hash comparison!
    )

    if (!user) {
      setError('Kullanıcı adı veya şifre hatalı!')
      return
    }

    // Login
    localStorage.setItem('arhaval_current_user', JSON.stringify({
      id: user.id,
      username: user.username
    }))

    // Redirect
    const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/leaderboard'
    navigate(redirectTo)
  }

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4" style={{ backgroundColor: '#0a0b10' }}>
      <div className="glass-strong rounded-2xl p-8 max-w-md w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Ana Sayfa</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-secondary-cyan/20 mb-4">
            <LogIn className="text-secondary-cyan" size={48} />
          </div>
          <h1 className="text-3xl font-bold tracking-wide text-white mb-2">
            GİRİŞ YAP
          </h1>
          <p className="text-white/60">
            Hesabınıza giriş yapın
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="glass rounded-lg p-4 border-2 border-red-500/50 bg-red-500/10">
              <p className="text-red-400 text-sm font-bold">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-white mb-2 font-medium flex items-center gap-2">
              <User size={16} />
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-secondary-cyan focus:ring-2 focus:ring-secondary-cyan/50"
              placeholder="Kullanıcı adınız"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-white mb-2 font-medium flex items-center gap-2">
              <Lock size={16} />
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-secondary-cyan focus:ring-2 focus:ring-secondary-cyan/50 pr-12"
                placeholder="Şifreniz"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-secondary-cyan text-white font-bold tracking-wide uppercase rounded-lg hover:bg-secondary-cyan/90 transition-colors"
          >
            GİRİŞ YAP
          </button>

          <div className="text-center">
            <p className="text-white/60 text-sm">
              Hesabınız yok mu?{' '}
              <Link to="/register" className="text-secondary-cyan hover:text-secondary-cyan/80 font-bold">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login



